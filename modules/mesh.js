/**
 * @typedef {import('./geom').Geometry} Geometry
 * @typedef {import('./material').Material} Material
 * @typedef {import('./object3d').Object3D} Object3D
 */

/**
 * @typedef MeshSubclass
 * @property {Geometry} geometry
 * @property {Material} material
 */

/**
 * @typedef {Object3D & MeshSubclass} Mesh
 */

import { object3d_create } from './object3d.js';

/**
 * @param {Geometry} geometry
 * @param {Material} material
 * @return {Mesh}
 */
export var mesh_create = (geometry, material) => {
  return {
    ...object3d_create(),
    geometry,
    material,
  };
};
