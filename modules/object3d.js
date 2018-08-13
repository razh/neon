// @flow

import type { Matrix4 } from './mat4';
import type { Quaternion } from './quat';
import type { Vector3 } from './vec3';

export type Object3D = {
  parent?: Object3D,
  children: Object3D[],
  position: Vector3,
  quaternion: Quaternion,
  scale: Vector3,
  matrix: Matrix4,
  matrixWorld: Matrix4,
  modelViewMatrix: Matrix4,
  visible: boolean,
};

import {
  mat4_create,
  mat4_compose,
  mat4_copy,
  mat4_lookAt,
  mat4_multiplyMatrices,
} from './mat4';

import {
  quat_create,
  quat_multiply,
  quat_setFromAxisAngle,
  quat_setFromRotationMatrix,
} from './quat';

import {
  vec3_create,
  vec3_add,
  vec3_multiplyScalar,
  vec3_applyQuaternion,
  vec3_X,
  vec3_Y,
  vec3_Z,
} from './vec3';

export var object3d_create = (): Object3D => {
  return {
    parent: undefined,
    children: [],
    position: vec3_create(),
    quaternion: quat_create(),
    scale: vec3_create(1, 1, 1),
    matrix: mat4_create(),
    matrixWorld: mat4_create(),
    modelViewMatrix: mat4_create(),
    visible: true,
  };
};

export var object3d_lookAt = (() => {
  var m1 = mat4_create();

  return (object: Object3D, vector: Vector3) => {
    mat4_lookAt(m1, vector, object.position, vec3_Y);
    quat_setFromRotationMatrix(object.quaternion, m1);
  };
})();

export var object3d_add = (parent: Object3D, child: Object3D) => {
  child.parent = parent;
  parent.children.push(child);
  return parent;
};

export var object3d_remove = (parent: Object3D, child: Object3D) => {
  var index = parent.children.indexOf(child);
  if (index >= 0) {
    parent.children.splice(index, 1);
  }
};

export var object3d_rotateOnAxis = (() => {
  var q1 = quat_create();

  return (obj: Object3D, axis: Vector3, angle: number) => {
    quat_setFromAxisAngle(q1, axis, angle);
    quat_multiply(obj.quaternion, q1);
    return obj;
  };
})();

export var object3d_rotateX = (obj: Object3D, angle: number) => {
  return object3d_rotateOnAxis(obj, vec3_X, angle);
};

export var object3d_rotateY = (obj: Object3D, angle: number) => {
  return object3d_rotateOnAxis(obj, vec3_Y, angle);
};

export var object3d_rotateZ = (obj: Object3D, angle: number) => {
  return object3d_rotateOnAxis(obj, vec3_Z, angle);
};

export var object3d_translateOnAxis = (() => {
  var v1 = vec3_create();

  return (obj: Object3D, axis: Vector3, distance: number) => {
    vec3_applyQuaternion(Object.assign(v1, axis), obj.quaternion);
    vec3_add(obj.position, vec3_multiplyScalar(v1, distance));
    return obj;
  };
})();

export var object3d_translateX = (obj: Object3D, distance: number) => {
  return object3d_translateOnAxis(obj, vec3_X, distance);
};

export var object3d_translateY = (obj: Object3D, distance: number) => {
  return object3d_translateOnAxis(obj, vec3_Y, distance);
};

export var object3d_translateZ = (obj: Object3D, distance: number) => {
  return object3d_translateOnAxis(obj, vec3_Z, distance);
};

export var object3d_traverse = (obj: Object3D, callback: Object3D => void) => {
  callback(obj);
  obj.children.map(child => object3d_traverse(child, callback));
};

export var object3d_updateMatrix = (obj: Object3D) => {
  mat4_compose(obj.matrix, obj.position, obj.quaternion, obj.scale);
};

export var object3d_updateMatrixWorld = (obj: Object3D) => {
  object3d_updateMatrix(obj);

  if (!obj.parent) {
    mat4_copy(obj.matrixWorld, obj.matrix);
  } else {
    mat4_multiplyMatrices(obj.matrixWorld, obj.parent.matrixWorld, obj.matrix);
  }

  obj.children.map(object3d_updateMatrixWorld);
};
