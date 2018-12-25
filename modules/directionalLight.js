/**
 * @typedef {import('./object3d').Object3D } Object3D
 * @typedef {import('./vec3').Vector3 } Vector3
 */

/**
 * @typedef DirectionalLightSubclass
 * @property {Vector3} color
 * @property {number} intensity
 * @property {Object3D} target
 */

/**
 * @typedef {Object3D & DirectionalLightSubclass} DirectionalLight
 */

import { object3d_create } from './object3d.js';
import { vec3_create } from './vec3.js';

/**
 * @return {DirectionalLight}
 */
export var light_create = (color = vec3_create(), intensity = 1) => {
  return {
    ...object3d_create(),
    color,
    intensity,
    target: object3d_create(),
  };
};
