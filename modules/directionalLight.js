// @flow

import type { Object3D } from './object3d';
import type { Vector3 } from './vec3';

export type DirectionalLight = Object3D & {
  color: Vector3,
  intensity: number,
  target: Object3D,
};

import { object3d_create } from './object3d';
import { vec3_create } from './vec3';

export var light_create = (
  color: Vector3 = vec3_create(),
  intensity: number = 1,
): DirectionalLight => {
  return {
    ...object3d_create(),
    color,
    intensity,
    target: object3d_create(),
  };
};
