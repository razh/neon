// @flow

import type { Quaternion } from './quat';
import type { Vector3 } from './vec3';

export type Matrix4 = Float32Array;

import {
  vec3_create,
  vec3_crossVectors,
  vec3_length,
  vec3_normalize,
  vec3_subVectors,
} from './vec3';

export var mat4_create = () => {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
};

export var mat4_makeRotationFromQuaternion = (m: Matrix4, q: Quaternion) => {
  var { x, y, z, w } = q;
  var x2 = x + x, y2 = y + y, z2 = z + z;
  var xx = x * x2, xy = x * y2, xz = x * z2;
  var yy = y * y2, yz = y * z2, zz = z * z2;
  var wx = w * x2, wy = w * y2, wz = w * z2;

  m[0] = 1 - (yy + zz);
  m[4] = xy - wz;
  m[8] = xz + wy;

  m[1] = xy + wz;
  m[5] = 1 - (xx + zz);
  m[9] = yz - wx;

  m[2] = xz - wy;
  m[6] = yz + wx;
  m[10] = 1 - (xx + yy);

  // last column
  m[3] = 0;
  m[7] = 0;
  m[11] = 0;

  // bottom row
  m[12] = 0;
  m[13] = 0;
  m[14] = 0;
  m[15] = 1;

  return m;
};

export var mat4_lookAt = (() => {
  var x = vec3_create();
  var y = vec3_create();
  var z = vec3_create();

  return (m: Matrix4, eye: Vector3, target: Vector3, up: Vector3) => {
    vec3_normalize(vec3_subVectors(z, eye, target));

    if (!vec3_length(z)) {
      z.z = 1;
    }

    vec3_normalize(vec3_crossVectors(x, up, z));

    if (!vec3_length(x)) {
      z.z += 0.0001;
      vec3_normalize(vec3_crossVectors(x, up, z));
    }

    vec3_crossVectors(y, z, x);

    m[0] = x.x;
    m[4] = y.x;
    m[8] = z.x;

    m[1] = x.y;
    m[5] = y.y;
    m[9] = z.y;

    m[2] = x.z;
    m[6] = y.z;
    m[10] = z.z;

    return m;
  };
})();

export var mat4_identity = (m: Matrix4) => {
  m.set([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);

  return m;
};

export var mat4_copy = (a: Matrix4, b: Matrix4) => {
  a.set(b);
  return a;
};

export var mat4_multiplyMatrices = (m: Matrix4, a: Matrix4, b: Matrix4) => {
  var a11 = a[0], a12 = a[4], a13 = a[8], a14 = a[12];
  var a21 = a[1], a22 = a[5], a23 = a[9], a24 = a[13];
  var a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14];
  var a41 = a[3], a42 = a[7], a43 = a[11], a44 = a[15];

  var b11 = b[0], b12 = b[4], b13 = b[8], b14 = b[12];
  var b21 = b[1], b22 = b[5], b23 = b[9], b24 = b[13];
  var b31 = b[2], b32 = b[6], b33 = b[10], b34 = b[14];
  var b41 = b[3], b42 = b[7], b43 = b[11], b44 = b[15];

  m[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
  m[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
  m[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
  m[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

  m[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
  m[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
  m[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
  m[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

  m[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
  m[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
  m[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
  m[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

  m[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
  m[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
  m[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
  m[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

  return m;
};

export var mat4_setPosition = (m: Matrix4, v: Vector3) => {
  m[12] = v.x;
  m[13] = v.y;
  m[14] = v.z;

  return m;
};

export var mat4_getInverse = (a: Matrix4, b: Matrix4) => {
  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  var n11 = b[0], n21 = b[1], n31 = b[2], n41 = b[3];
  var n12 = b[4], n22 = b[5], n32 = b[6], n42 = b[7];
  var n13 = b[8], n23 = b[9], n33 = b[10], n43 = b[11];
  var n14 = b[12], n24 = b[13], n34 = b[14], n44 = b[15];

  var t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
  var t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
  var t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
  var t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

  var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

  if (det === 0) {
    return mat4_identity(a);
  }

  var detInv = 1 / det;

  a[0] = t11 * detInv;
  a[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
  a[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
  a[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

  a[4] = t12 * detInv;
  a[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
  a[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
  a[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

  a[8] = t13 * detInv;
  a[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
  a[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
  a[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

  a[12] = t14 * detInv;
  a[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
  a[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
  a[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

  return a;
};

export var mat4_scale = (m: Matrix4, v: Vector3) => {
  var { x, y, z } = v;

  m[0] *= x; m[4] *= y; m[8] *= z;
  m[1] *= x; m[5] *= y; m[9] *= z;
  m[2] *= x; m[6] *= y; m[10] *= z;
  m[3] *= x; m[7] *= y; m[11] *= z;

  return m;
};

export var mat4_compose = (m: Matrix4, position: Vector3, quaternion: Quaternion, scale: Vector3) => {
  mat4_makeRotationFromQuaternion(m, quaternion);
  mat4_scale(m, scale);
  mat4_setPosition(m, position);
  return m;
};
