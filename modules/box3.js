// @flow

import type { Mesh } from './mesh';
import type { Object3D } from './object3d';
import type { Vector3 } from './vec3';

export type Box3 = {
  min: Vector3,
  max: Vector3,
};

import { object3d_traverse, object3d_updateMatrixWorld } from './object3d.js';
import {
  vec3_create,
  vec3_add,
  vec3_applyMatrix4,
  vec3_min,
  vec3_max,
} from './vec3.js';

export var box3_create = (
  min: Vector3 = vec3_create(Infinity, Infinity, Infinity),
  max: Vector3 = vec3_create(-Infinity, -Infinity, -Infinity),
) => {
  return {
    min,
    max,
  };
};

export var box3_copy = (a: Box3, b: Box3) => {
  Object.assign(a.min, b.min);
  Object.assign(a.max, b.max);
  return a;
};

export var box3_makeEmpty = (box: Box3) => {
  box.min.x = box.min.y = box.min.z = Infinity;
  box.max.x = box.max.y = box.max.z -= Infinity;
  return box;
};

export var box3_expandByPoint = (box: Box3, point: Vector3) => {
  vec3_min(box.min, point);
  vec3_max(box.max, point);
  return box;
};

export var box3_expandByObject = (() => {
  var scope;
  var v1 = vec3_create();

  var traverse = node => {
    var { geometry } = ((node: any): Mesh);
    if (geometry) {
      geometry.vertices.map(vertex => {
        Object.assign(v1, vertex);
        vec3_applyMatrix4(v1, node.matrixWorld);
        box3_expandByPoint(scope, v1);
      });
    }
  };

  return (box: Box3, object: Object3D) => {
    scope = box;
    object3d_updateMatrixWorld(object);
    object3d_traverse(object, traverse);
    return box;
  };
})();

export var box3_setFromPoints = (box: Box3, points: Vector3[]) => {
  box3_makeEmpty(box);
  points.map(point => box3_expandByPoint(box, point));
  return box;
};

export var box3_setFromObject = (box: Box3, object: Object3D) => {
  box3_makeEmpty(box);
  box3_expandByObject(box, object);
  return box;
};

export var box3_containsPoint = (box: Box3, point: Vector3) => {
  // prettier-ignore
  return (
    box.min.x <= point.x && point.x <= box.max.x &&
    box.min.y <= point.y && point.y <= box.max.y &&
    box.min.z <= point.z && point.z <= box.max.z
  );
};

export var box3_intersectsBox = (a: Box3, b: Box3) => {
  // prettier-ignore
  return !(
    a.max.x < b.min.x || a.min.x > b.max.x ||
    a.max.y < b.min.y || a.min.y > b.max.y ||
    a.max.z < b.min.z || a.min.z > b.max.z
  );
};

export var box3_translate = (box: Box3, offset: Vector3) => {
  vec3_add(box.min, offset);
  vec3_add(box.max, offset);
  return box;
};
