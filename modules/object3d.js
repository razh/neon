import { mat4_create } from './mat4';
import { quat_create, quat_multiply, quat_setFromAxisAngle } from './quat';

import {
  vec3_create,
  vec3_copy,
  vec3_add,
  vec3_multiplyScalar,
  vec3_applyQuaternion,
  vec3_X,
  vec3_Y,
  vec3_Z
} from './vec3';

export function object3d_create() {
  return {
    children: [],
    position: vec3_create(),
    quaternion: quat_create(),
    scale: vec3_create(1, 1, 1),
    matrix: mat4_create(),
    matrixWorld: mat4_create(),
  };
}

export var object3d_rotateOnAxis = (function() {
  var q1 = quat_create();

  return function rotateOnAxis(obj, axis, angle) {
    quat_setFromAxisAngle(q1, axis, angle);
    quat_multiply(obj.quaternion, q1);
    return obj;
  };
}());

export function object3d_rotateX(obj, angle) {
  return object3d_rotateOnAxis(obj, vec3_X, angle);
}

export function object3d_rotateY(obj, angle) {
  return object3d_rotateOnAxis(obj, vec3_Y, angle);
}

export function object3d_rotateZ(obj, angle) {
  return object3d_rotateOnAxis(obj, vec3_Z, angle);
}

export var object3d_translateOnAxis = (function() {
  var v1 = vec3_create();

  return function(obj, axis, distance) {
    vec3_applyQuaternion(vec3_copy(v1, axis), obj.quaternion);
    vec3_add(obj.position, vec3_multiplyScalar(v1, distance));
    return obj;
  };
}());

export function object3d_translateX(distance) {
  return object3d_translateOnAxis(vec3_X, distance);
}

export function object3d_translateY(distance) {
  return object3d_translateOnAxis(vec3_Y, distance);
}

export function object3d_translateZ(distance) {
  return object3d_translateOnAxis(vec3_Z, distance);
}
