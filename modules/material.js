/**
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @typedef {Object} Material
 * @property {Vector3} color
 * @property {Vector3} specular
 * @property {number} shininess
 * @property {Vector3} emissive
 */

import { vec3_create } from './vec3.js';

// MeshPhongMaterial.
/**
 * @return {Material}
 */
export var material_create = () => {
  return {
    color: vec3_create(1, 1, 1),
    // 0x111111
    specular: vec3_create(1 / 15, 1 / 15, 1 / 15),
    shininess: 30,
    emissive: vec3_create(),
  };
};
