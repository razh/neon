import { color_create } from './color';
import { vec3_create } from './vec3';

export function face3_create(a, b, c) {
  return {
    a: a,
    b: b,
    c: c,
    normal: vec3_create(),
    color: color_create(),
    vertexColors: [],
  };
}
