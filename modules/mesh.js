// @flow

import type { Geometry } from './geom';
import type { Material } from './material';
import type { Object3D } from './object3d';

import { object3d_create } from './object3d';

export function mesh_create(geometry: Geometry, material: Material) {
  return Object.assign(
    {},
    object3d_create(),
    {
      geometry: geometry,
      material: material,
    }
  );
}
