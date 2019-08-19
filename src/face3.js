/**
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @typedef Face3
 * @property {number} a
 * @property {number} b
 * @property {number} c
 * @property {Vector3} color
 * @property {Vector3[]} vertexColors
 */

import { vec3_clone, vec3_create } from './vec3.js';

/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {Face3}
 */
export var face3_create = (a, b, c) => {
  return {
    a,
    b,
    c,
    color: vec3_create(1, 1, 1),
    vertexColors: [],
  };
};

/**
 * @param {Face3} face
 * @return {Face3}
 */
export var face3_clone = face => {
  return {
    a: face.a,
    b: face.b,
    c: face.c,
    color: vec3_clone(face.color),
    vertexColors: face.vertexColors.map(vec3_clone),
  };
};
