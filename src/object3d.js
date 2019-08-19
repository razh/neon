/**
 * @typedef {import('./mat4').Matrix4} Matrix4
 * @typedef {import('./quat').Quaternion} Quaternion
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @typedef Object3D
 * @property {Object3D=} parent
 * @property {Object3D[]} children
 * @property {Vector3} position
 * @property {Quaternion} quaternion
 * @property {Vector3} scale
 * @property {Matrix4} matrix
 * @property {Matrix4} matrixWorld
 * @property {Matrix4} modelViewMatrix
 * @property {boolean} visible
 */

import {
  mat4_compose,
  mat4_copy,
  mat4_create,
  mat4_lookAt,
  mat4_multiplyMatrices,
} from './mat4.js';
import {
  quat_create,
  quat_multiply,
  quat_setFromAxisAngle,
  quat_setFromRotationMatrix,
} from './quat.js';
import {
  vec3_add,
  vec3_applyQuaternion,
  vec3_create,
  vec3_multiplyScalar,
  vec3_X,
  vec3_Y,
  vec3_Z,
} from './vec3.js';

var _v1 = vec3_create();
var _q1 = quat_create();
var _m1 = mat4_create();

/**
 * @return {Object3D}
 */
export var object3d_create = () => {
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

/**
 * @param {Object3D} object
 * @param {Vector3} vector
 */
export var object3d_lookAt = (object, vector) => {
  mat4_lookAt(_m1, vector, object.position, vec3_Y);
  quat_setFromRotationMatrix(object.quaternion, _m1);
};

/**
 * @param {Object3D} parent
 * @param {Object3D} child
 * @return {Object3D}
 */
export var object3d_add = (parent, child) => {
  child.parent = parent;
  parent.children.push(child);
  return parent;
};

/**
 * @param {Object3D} parent
 * @param {Object3D} child
 */
export var object3d_remove = (parent, child) => {
  var index = parent.children.indexOf(child);
  if (index >= 0) {
    parent.children.splice(index, 1);
  }
};

/**
 * @param {Object3D} obj
 * @param {Vector3} axis
 * @param {number} angle
 * @return {Object3D}
 */
export var object3d_rotateOnAxis = (obj, axis, angle) => {
  // rotate object on axis in object space
  // axis is assumed to be normalized
  quat_setFromAxisAngle(_q1, axis, angle);
  quat_multiply(obj.quaternion, _q1);
  return obj;
};

/**
 * @param {Object3D} obj
 * @param {number} angle
 * @return {Object3D}
 */
export var object3d_rotateX = (obj, angle) => {
  return object3d_rotateOnAxis(obj, vec3_X, angle);
};

/**
 * @param {Object3D} obj
 * @param {number} angle
 * @return {Object3D}
 */
export var object3d_rotateY = (obj, angle) => {
  return object3d_rotateOnAxis(obj, vec3_Y, angle);
};

/**
 * @param {Object3D} obj
 * @param {number} angle
 * @return {Object3D}
 */
export var object3d_rotateZ = (obj, angle) => {
  return object3d_rotateOnAxis(obj, vec3_Z, angle);
};

/**
 * @param {Object3D} obj
 * @param {Vector3} axis
 * @param {number} distance
 * @return {Object3D}
 */
export var object3d_translateOnAxis = (obj, axis, distance) => {
  // translate object by distance along axis in object space
  // axis is assumed to be normalized
  vec3_applyQuaternion(Object.assign(_v1, axis), obj.quaternion);
  vec3_add(obj.position, vec3_multiplyScalar(_v1, distance));
  return obj;
};

/**
 * @param {Object3D} obj
 * @param {number} distance
 * @return {Object3D}
 */
export var object3d_translateX = (obj, distance) => {
  return object3d_translateOnAxis(obj, vec3_X, distance);
};

/**
 * @param {Object3D} obj
 * @param {number} distance
 * @return {Object3D}
 */
export var object3d_translateY = (obj, distance) => {
  return object3d_translateOnAxis(obj, vec3_Y, distance);
};

/**
 * @param {Object3D} obj
 * @param {number} distance
 * @return {Object3D}
 */
export var object3d_translateZ = (obj, distance) => {
  return object3d_translateOnAxis(obj, vec3_Z, distance);
};

/**
 * @callback TraverseCallback
 * @param {Object3D} child
 */

/**
 * @param {Object3D} obj
 * @param {TraverseCallback} callback
 */
export var object3d_traverse = (obj, callback) => {
  callback(obj);
  obj.children.map(child => object3d_traverse(child, callback));
};

/**
 * @param {Object3D} obj
 */
export var object3d_updateMatrix = obj => {
  mat4_compose(obj.matrix, obj.position, obj.quaternion, obj.scale);
};

/**
 * @param {Object3D} obj
 */
export var object3d_updateWorldMatrix = obj => {
  object3d_updateMatrix(obj);

  if (!obj.parent) {
    mat4_copy(obj.matrixWorld, obj.matrix);
  } else {
    mat4_multiplyMatrices(obj.matrixWorld, obj.parent.matrixWorld, obj.matrix);
  }

  obj.children.map(object3d_updateWorldMatrix);
};
