// @flow

import type { Box3 } from './box3';
import type { Face3 } from './face3';
import type { Matrix4 } from './mat4';
import type { Mesh } from './mesh';
import type { Vector3 } from './vec3';

export type Ray = {
  origin: Vector3,
  direction: Vector3,
};

export type Intersection = {
  object: Mesh,
  distance: number,
  point: Vector3,
  face?: Face3,
  faceIndex?: number,
};

import { mat4_create, mat4_getInverse } from './mat4.js';
import {
  vec3_create,
  vec3_add,
  vec3_applyMatrix4,
  vec3_clone,
  vec3_cross,
  vec3_crossVectors,
  vec3_distanceTo,
  vec3_dot,
  vec3_multiplyScalar,
  vec3_subVectors,
  vec3_transformDirection,
} from './vec3.js';

export var ray_create = (
  origin: Vector3 = vec3_create(),
  direction: Vector3 = vec3_create(),
): Ray => {
  return {
    origin,
    direction,
  };
};

export var ray_copy = (a: Ray, b: Ray) => {
  Object.assign(a.origin, b.origin);
  Object.assign(a.direction, b.direction);
  return a;
};

export var ray_at = (ray: Ray, t: number, result: Vector3 = vec3_create()) => {
  return vec3_add(
    vec3_multiplyScalar(Object.assign(result, ray.direction), t),
    ray.origin,
  );
};

export var ray_intersectBox = (ray: Ray, box: Box3, target: Vector3) => {
  var { origin, direction } = ray;

  var txmin = (box.min.x - origin.x) / direction.x;
  var txmax = (box.max.x - origin.x) / direction.x;
  if (txmin > txmax) {
    [txmin, txmax] = [txmax, txmin];
  }

  var tymin = (box.min.y - origin.y) / direction.y;
  var tymax = (box.max.y - origin.y) / direction.y;
  if (tymin > tymax) {
    [tymin, tymax] = [tymax, tymin];
  }

  if (txmin > tymax || tymin > txmax) {
    return;
  }

  // Math.min/max with NaN support (0 / 0).
  var tmin = tymin > txmin || txmin !== txmin ? tymin : txmin;
  var tmax = tymax < txmax || txmax !== txmax ? tymax : txmax;

  var tzmin = (box.min.z - origin.z) / direction.z;
  var tzmax = (box.max.z - origin.z) / direction.z;
  if (tzmin > tzmax) {
    [tzmin, tzmax] = [tzmax, tzmin];
  }

  if (tmin > tzmax || tzmin > tmax) {
    return;
  }

  tmin = tzmin > tmin || tmin !== tmin ? tzmin : tmin;
  tmax = tzmax < tmax || tmax !== tmax ? tzmax : tmax;

  if (tmax < 0) {
    return;
  }

  return ray_at(ray, tmin >= 0 ? tmin : tmax, target);
};

export var ray_intersectTriangle = (() => {
  var diff = vec3_create();
  var edge1 = vec3_create();
  var edge2 = vec3_create();
  var normal = vec3_create();

  return (ray: Ray, a: Vector3, b: Vector3, c: Vector3, target: Vector3) => {
    vec3_subVectors(edge1, b, a);
    vec3_subVectors(edge2, c, a);

    vec3_crossVectors(normal, edge1, edge2);

    // Determinant.
    var DdN = vec3_dot(ray.direction, normal);
    var sign = 1;

    if (DdN > 0) {
      return;
    } else if (DdN < 0) {
      sign = -1;
      DdN *= -1;
    } else {
      return;
    }

    vec3_subVectors(diff, ray.origin, a);
    var DdQxE2 =
      sign * vec3_dot(ray.direction, vec3_crossVectors(edge2, diff, edge2));
    if (DdQxE2 < 0) {
      return;
    }

    var DdE1xQ = sign * vec3_dot(ray.direction, vec3_cross(edge1, diff));
    if (DdE1xQ < 0) {
      return;
    }

    if (DdQxE2 + DdE1xQ > DdN) {
      return;
    }

    var QdN = -sign * vec3_dot(diff, normal);
    if (QdN < 0) {
      return;
    }

    return ray_at(ray, QdN / DdN, target);
  };
})();

export var ray_intersectsMesh = (() => {
  var inverseMatrix = mat4_create();
  var rayCopy = ray_create();

  var intersectionPoint = vec3_create();
  var intersectionPointWorld = vec3_create();

  var checkIntersection = (object, ray, a, b, c, point): ?Intersection => {
    var intersect = ray_intersectTriangle(ray, a, b, c, point);
    if (!intersect) {
      return;
    }

    Object.assign(intersectionPointWorld, point);
    vec3_applyMatrix4(intersectionPointWorld, object.matrixWorld);

    var distance = vec3_distanceTo(ray.origin, intersectionPointWorld);

    return {
      object,
      distance,
      point: vec3_clone(intersectionPointWorld),
    };
  };

  return (ray: Ray, object: Mesh) => {
    var intersections = [];

    mat4_getInverse(inverseMatrix, object.matrixWorld);
    ray_applyMatrix4(ray_copy(rayCopy, ray), inverseMatrix);

    var { vertices, faces } = object.geometry;

    faces.map((face, index) => {
      var a = vertices[face.a];
      var b = vertices[face.b];
      var c = vertices[face.c];

      var intersection = checkIntersection(
        object,
        rayCopy,
        a,
        b,
        c,
        intersectionPoint,
      );
      if (intersection) {
        intersection.face = face;
        intersection.faceIndex = index;
        intersections.push(intersection);
      }
    });

    return intersections;
  };
})();

export var ray_applyMatrix4 = (r: Ray, m: Matrix4) => {
  vec3_applyMatrix4(r.origin, m);
  vec3_transformDirection(r.direction, m);
  return r;
};

export var ray_intersectObjects = (
  ray: Ray,
  objects: Mesh[],
): Intersection[] => {
  return []
    .concat(...objects.map(object => ray_intersectsMesh(ray, object)))
    .sort((a, b) => a.distance - b.distance);
};
