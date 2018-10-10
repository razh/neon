// @flow

import type { Vector3 } from './vec3';

export type Face3 = {
  a: number,
  b: number,
  c: number,
  color: Vector3,
  vertexColors: Vector3[],
};

import { vec3_create, vec3_clone } from './vec3.js';

export var face3_create = (a: number, b: number, c: number): Face3 => {
  return {
    a,
    b,
    c,
    color: vec3_create(1, 1, 1),
    vertexColors: [],
  };
};

export var face3_clone = (face: Face3): Face3 => {
  return {
    a: face.a,
    b: face.b,
    c: face.c,
    color: vec3_clone(face.color),
    vertexColors: face.vertexColors.map(vec3_clone),
  };
};
