// @flow

import type { Vector3 } from './vec3';

export type Face3 = {
  a: number,
  b: number,
  c: number,
  normal: Vector3,
  color: Vector3,
  vertexColors: Array<Vector3>,
};

import { vec3_create } from './vec3';

export function face3_create(a: number, b: number, c: number): Face3 {
  return {
    a: a,
    b: b,
    c: c,
    normal: vec3_create(),
    color: vec3_create(),
    vertexColors: [],
  };
}
