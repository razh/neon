// @flow

import type { Vector3 } from './vec3';

export type Matrix4 = Float32Array;

import {
  vec3_create,
  vec3_crossVectors,
  vec3_length,
  vec3_normalize,
  vec3_subVectors,
} from './vec3';

export function mat4_create() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

export var mat4_lookAt = (function() {
  var x = vec3_create();
  var y = vec3_create();
  var z = vec3_create();

  return function(m: Matrix4, eye: Vector3, target: Vector3, up: Vector3) {
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
}())
