// @flow

import type { Vector3 } from './vec3';

export type Face3 = {
  a: number,
  b: number,
  c: number,
  color: Vector3,
  vertexColors: Array<Vector3>,
};

import { vec3_create, vec3_clone } from './vec3';

export function face3_create(a: number, b: number, c: number): Face3 {
  return {
    a: a,
    b: b,
    c: c,
    color: vec3_create(),
    vertexColors: [],
  };
}

export function face3_clone(face: Face3) {
  return {
    a: face.a,
    b: face.b,
    c: face.c,
    color: vec3_clone(face.color),
    vertexColors: face.vertexColors.map(vec3_clone),
  };
}
