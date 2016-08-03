export function vec3_create(x, y, z) {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0
  };
}

export function vec3_clone(v) {
  return vec3_create(v.x, v.y, v.z);
}

export function vec3_copy(a, b) {
  a.x = b.x;
  a.y = b.y;
  a.z = b.z;
  return a;
}

export function vec3_add(a, b) {
  a.x += b.x;
  a.y += b.y;
  a.z += b.z;
  return a;
}

export function vec3_multiplyScalar(v, scalar) {
  v.x *= scalar;
  v.y *= scalar;
  v.z *= scalar;
  return v;
}

export function vec3_applyQuaternion(v, q) {
  var x = v.x, y = v.y, z = v.z;
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
}

export var vec3_X = vec3_create(1, 0, 0);
export var vec3_Y = vec3_create(0, 1, 0);
export var vec3_Z = vec3_create(0, 0, 1);
