export function quat_create(x, y, z, w) {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0,
    w: w !== undefined ? w : 1,
  };
}

export function quat_multiply(a, b) {
  // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
  var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
  var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

  a.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
  a.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
  a.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
  a.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

  return a;
}

export function quat_setFromAxisAngle(q, axis, angle) {
  var halfAngle = angle / 2;
  var s = Math.sin(halfAngle);

  q.x = axis.x * s;
  q.y = axis.y * s;
  q.z = axis.z * s;
  q.w = Math.cos(halfAngle);

  return q;
}

export function quat_setFromRotationMatrix(q, m) {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

  var m11 = m[0], m12 = m[4], m13 = m[8];
  var m21 = m[1], m22 = m[5], m23 = m[9];
  var m31 = m[2], m32 = m[6], m33 = m[10];

  var trace = m11 + m22 + m33;
  var s;

  if (trace > 0) {
    s = 0.5 / Math.sqrt(trace + 1);

    q.w = 0.25 / s;
    q.x = (m32 - m23) * s;
    q.y = (m13 - m31) * s;
    q.z = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    s = 2 * Math.sqrt(1 + m11 - m22 - m33);

    q.w = (m32 - m23) / s;
    q.x = 0.25 * s;
    q.y = (m12 + m21) / s;
    q.z = (m13 + m31) / s;
  } else if (m22 > m33) {
    s = 2 * Math.sqrt(1 + m22 - m11 - m33);

    q.w = (m13 - m31) / s;
    q.x = (m12 + m21) / s;
    q.y = 0.25 * s;
    q.z = (m23 + m32) / s;
  } else {
    s = 2 * Math.sqrt(1 + m33 - m11 - m22);

    q.w = (m21 - m12) / s;
    q.x = (m13 + m31) / s;
    q.y = (m23 + m32) / s;
    q.z = 0.25 * s;
  }

  return q;
}
