export function vec3_create(x, y, z) {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0
  };
}

export function vec3_clone( v ) {
  return vec3_create(v.x, v.y, v.z);
}

export var vec3_X = vec3_create(1, 0, 0);
export var vec3_Y = vec3_create(0, 1, 0);
export var vec3_Z = vec3_create(0, 0, 1);
