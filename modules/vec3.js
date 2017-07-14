// @flow

import type { Matrix4 } from './mat4';
import type { Quaternion } from './quat';

export type Vector3 = {
  x: number,
  y: number,
  z: number,
};

export var vec3_create = (x: number = 0, y: number = 0, z: number = 0) => {
  return {
    x,
    y,
    z,
  };
};

export var vec3_set = (v: Vector3, x: number, y: number, z: number) => {
  v.x = x;
  v.y = y;
  v.z = z;
  return v;
};

export var vec3_setScalar = (v: Vector3, scalar: number) => {
  v.x = scalar;
  v.y = scalar;
  v.z = scalar;
  return v;
};

export var vec3_clone = (v: Vector3) => {
  return vec3_create(v.x, v.y, v.z);
};

export var vec3_copy = (a: Vector3, b: Vector3) => {
  a.x = b.x;
  a.y = b.y;
  a.z = b.z;
  return a;
};

export var vec3_add = (a: Vector3, b: Vector3) => {
  a.x += b.x;
  a.y += b.y;
  a.z += b.z;
  return a;
};

export var vec3_addVectors = (v: Vector3, a: Vector3, b: Vector3) => {
  v.x = a.x + b.x;
  v.y = a.y + b.y;
  v.z = a.z + b.z;
  return v;
};

export var vec3_subVectors = (v: Vector3, a: Vector3, b: Vector3) => {
  v.x = a.x - b.x;
  v.y = a.y - b.y;
  v.z = a.z - b.z;
  return v;
};

export var vec3_multiply = (a: Vector3, b: Vector3) => {
  a.x *= b.x;
  a.y *= b.y;
  a.z *= b.z;
  return a;
};

export var vec3_multiplyScalar = (v: Vector3, scalar: number) => {
  v.x *= scalar;
  v.y *= scalar;
  v.z *= scalar;
  return v;
};

export var vec3_transformDirection = (v: Vector3, m: Matrix4) => {
  // input: THREE.Matrix4 affine matrix
  // vector interpreted as a direction

  var { x, y, z } = v;

  v.x = m[0] * x + m[4] * y + m[8] * z;
  v.y = m[1] * x + m[5] * y + m[9] * z;
  v.z = m[2] * x + m[6] * y + m[10] * z;

  return vec3_normalize(v);
};

export var vec3_divideScalar = (v: Vector3, scalar: number) => {
  return vec3_multiplyScalar(v, 1 / scalar);
};

export var vec3_min = (a: Vector3, b: Vector3) => {
  a.x = Math.min(a.x, b.x);
  a.y = Math.min(a.y, b.y);
  a.z = Math.min(a.z, b.z);
  return a;
};

export var vec3_max = (a: Vector3, b: Vector3) => {
  a.x = Math.max(a.x, b.x);
  a.y = Math.max(a.y, b.y);
  a.z = Math.max(a.z, b.z);
  return a;
};

export var vec3_cross = (a: Vector3, b: Vector3) => {
  var { x, y, z } = a;

  a.x = y * b.z - z * b.y;
  a.y = z * b.x - x * b.z;
  a.z = x * b.y - y * b.x;

  return a;
};

export var vec3_crossVectors = (v: Vector3, a: Vector3, b: Vector3) => {
  var ax = a.x;
  var ay = a.y;
  var az = a.z;

  var bx = b.x;
  var by = b.y;
  var bz = b.z;

  v.x = ay * bz - az * by;
  v.y = az * bx - ax * bz;
  v.z = ax * by - ay * bx;

  return v;
};

export var vec3_length = (v: Vector3) => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

export var vec3_normalize = (v: Vector3) => {
  return vec3_divideScalar(v, vec3_length(v));
};

export var vec3_applyMatrix4 = (v: Vector3, m: Matrix4) => {
  var { x, y, z } = v;

  v.x = m[0] * x + m[4] * y + m[8] * z + m[12];
  v.y = m[1] * x + m[5] * y + m[9] * z + m[13];
  v.z = m[2] * x + m[6] * y + m[10] * z + m[14];

  return v;
};

export var vec3_applyQuaternion = (v: Vector3, q: Quaternion) => {
  var { x, y, z } = v;
  var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // calculate quat * vector

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat

  v.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  v.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  v.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return v;
};

export var vec3_distanceTo = (a: Vector3, b: Vector3) => {
  return Math.sqrt(vec3_distanceToSquared(a, b));
};

export var vec3_distanceToSquared = (a: Vector3, b: Vector3) => {
  var dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
};

export var vec3_setFromMatrixPosition = (v: Vector3, m: Matrix4) => {
  v.x = m[12];
  v.y = m[13];
  v.z = m[14];
  return v;
};

export var vec3_X = vec3_create(1, 0, 0);
export var vec3_Y = vec3_create(0, 1, 0);
export var vec3_Z = vec3_create(0, 0, 1);
