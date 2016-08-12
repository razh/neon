// @flow

import type { Color } from './color';
import type { Object3D } from './object3d';

export type Light = Object3D & {
  color: Color,
  intensity: number,
};

import { color_create } from './color';
import { object3d_create } from './object3d';

export function light_create(): Light {
  return Object.assign(
    {},
    object3d_create(),
    {
      color: color_create(),
      intensity: 1,
    }
  );
}
