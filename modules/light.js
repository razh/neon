// @flow

import type { Object3D } from './object3d';
import type { Vector3 } from './vec3';

export type Light = Object3D & {
  color: Vector3,
  intensity: number,
};

import { object3d_create } from './object3d';
import { vec3_create } from './vec3';

export function light_create(): Light {
  return Object.assign(
    {},
    object3d_create(),
    {
      color: vec3_create(),
      intensity: 1,
    }
  );
}
