// @flow

import type { Color } from './color';
import type { Vector3 } from './vec3';

export type Face3 = {
  a: number,
  b: number,
  c: number,
  normal: Vector3,
  color: Color,
  vertexColors: Array<Color>,
};

import { color_create } from './color';
import { vec3_create } from './vec3';

export function face3_create(a: number, b: number, c: number): Face3 {
  return {
    a: a,
    b: b,
    c: c,
    normal: vec3_create(),
    color: color_create(),
    vertexColors: [],
  };
}
