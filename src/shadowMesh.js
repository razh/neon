/**
 * @typedef {import('./face3').Face3} Face3
 * @typedef {import('./mesh').Mesh} Mesh
 * @typedef {import('./vec3').Vector3} Vector3
 */

import { mat4_create } from './mat4.js';
import { material_create } from './material.js';
import { mesh_create } from './mesh.js';
import { vec3_clone, vec3_setScalar, vec3_Y } from './vec3.js';

var shadowMatrix = mat4_create();
var normal = vec3_clone(vec3_Y);

var shadowMaterial = material_create();
vec3_setScalar(shadowMaterial.color, 0);
vec3_setScalar(shadowMaterial.specular, 0);
shadowMaterial.shininess = 0;

/**
 * @param {Mesh} mesh
 * @return {Mesh}
 */
export var shadowMesh = mesh => {
  return mesh_create(mesh.geometry, shadowMaterial);
};

// amount of light-ray divergence. Ranging from:
// 0.001 = sunlight(min divergence) to 1.0 = pointlight(max divergence)
// must be slightly greater than 0, due to 0 causing matrixInverse errors
/**
 * @param {Mesh} shadowMesh
 * @param {Vector3} lightPosition
 * @param {number} w
 */
export var shadowMesh_update = (shadowMesh, lightPosition, w = 0.001) => {};
