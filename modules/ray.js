/**
 * @typedef {import('./box3').Box3} Box3
 * @typedef {import('./face3').Face3} Face3
 * @typedef {import('./mat4').Matrix4} Matrix4
 * @typedef {import('./mesh').Mesh} Mesh
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @typedef Ray
 * @property {Vector3} origin
 * @property {Vector3} direction
 */

/**
 * @typedef Intersection
 * @property {Mesh} object
 * @property {number} distance
 * @property {Vector3} point
 * @property {Face3=} face
 * @property {number=} faceIndex
 */

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

var _diff = vec3_create();

var _edge1 = vec3_create();
var _edge2 = vec3_create();
var _normal = vec3_create();

var _inverseMatrix = mat4_create();

var _intersectionPoint = vec3_create();
var _intersectionPointWorld = vec3_create();

/**
 * @param {Vector3} origin
 * @param {Vector3} direction
 * @return {Ray}
 */
export var ray_create = (origin = vec3_create(), direction = vec3_create()) => {
  return {
    origin,
    direction,
  };
};

/**
 * @param {Ray} a
 * @param {Ray} b
 * @return {Ray}
 */
export var ray_copy = (a, b) => {
  Object.assign(a.origin, b.origin);
  Object.assign(a.direction, b.direction);
  return a;
};

/**
 * @param {Ray} ray
 * @param {number} t
 * @param {Vector3} target
 * @return {Vector3}
 */
export var ray_at = (ray, t, target = vec3_create()) => {
  return vec3_add(
    vec3_multiplyScalar(Object.assign(target, ray.direction), t),
    ray.origin,
  );
};

/**
 * @param {Ray} ray
 * @param {Box3} box
 * @param {Vector3} target
 * @return {Vector3=}
 */
export var ray_intersectBox = (ray, box, target) => {
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

/**
 * @param {Ray} ray
 * @param {Vector3} a
 * @param {Vector3} b
 * @param {Vector3} c
 * @param {Vector3} target
 * @return {Vector3=}
 */
export var ray_intersectTriangle = (ray, a, b, c, target) => {
  // Compute the offset origin, edges, and normal.
  // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
  vec3_subVectors(_edge1, b, a);
  vec3_subVectors(_edge2, c, a);
  vec3_crossVectors(_normal, _edge1, _edge2);

  // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
  // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
  //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
  //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
  //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
  var DdN = vec3_dot(ray.direction, _normal);
  var sign = 1;

  if (DdN > 0) {
    return;
  } else if (DdN < 0) {
    sign = -1;
    DdN *= -1;
  } else {
    return;
  }

  vec3_subVectors(_diff, ray.origin, a);
  var DdQxE2 =
    sign * vec3_dot(ray.direction, vec3_crossVectors(_edge2, _diff, _edge2));

  // b1 < 0, no intersection
  if (DdQxE2 < 0) {
    return;
  }

  var DdE1xQ = sign * vec3_dot(ray.direction, vec3_cross(_edge1, _diff));

  // b2 < 0, no intersection
  if (DdE1xQ < 0) {
    return;
  }

  // b1+b2 > 1, no intersection
  if (DdQxE2 + DdE1xQ > DdN) {
    return;
  }

  // Line intersects triangle, check if ray does.
  var QdN = -sign * vec3_dot(_diff, _normal);

  // t < 0, no intersection
  if (QdN < 0) {
    return;
  }

  // Ray intersects triangle.
  return ray_at(ray, QdN / DdN, target);
};

/**
 * @param {Mesh} object
 * @param {Ray} ray
 * @param {Vector3} a
 * @param {Vector3} b
 * @param {Vector3} c
 * @param {Vector3} point
 * @return {Intersection=}
 */
var checkIntersection = (object, ray, a, b, c, point) => {
  var intersect = ray_intersectTriangle(ray, a, b, c, point);
  if (!intersect) {
    return;
  }

  Object.assign(_intersectionPointWorld, point);
  vec3_applyMatrix4(_intersectionPointWorld, object.matrixWorld);

  var distance = vec3_distanceTo(ray.origin, _intersectionPointWorld);

  return {
    object,
    distance,
    point: vec3_clone(_intersectionPointWorld),
  };
};

var _ray = ray_create();

/**
 * @param {Ray} ray
 * @param {Mesh} object
 * @return {Intersection[]}
 */
export var ray_intersectsMesh = (ray, object) => {
  /** @type {Intersection[]} */
  var intersections = [];

  mat4_getInverse(_inverseMatrix, object.matrixWorld);
  ray_applyMatrix4(ray_copy(_ray, ray), _inverseMatrix);

  var { vertices, faces } = object.geometry;

  faces.map((face, index) => {
    var a = vertices[face.a];
    var b = vertices[face.b];
    var c = vertices[face.c];

    var intersection = checkIntersection(
      object,
      _ray,
      a,
      b,
      c,
      _intersectionPoint,
    );
    if (intersection) {
      intersection.face = face;
      intersection.faceIndex = index;
      intersections.push(intersection);
    }
  });

  return intersections;
};

/**
 * @param {Ray} r
 * @param {Matrix4} m
 * @return {Ray}
 */
export var ray_applyMatrix4 = (r, m) => {
  vec3_applyMatrix4(r.origin, m);
  vec3_transformDirection(r.direction, m);
  return r;
};

/**
 * @param {Ray} ray
 * @param {Mesh[]} objects
 * @return {Intersection[]}
 */
export var ray_intersectObjects = (ray, objects) => {
  return objects
    .flatMap(object => ray_intersectsMesh(ray, object))
    .sort((a, b) => a.distance - b.distance);
};
