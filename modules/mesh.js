// @flow

import type { Geometry } from './geom';
import type { Material } from './material';
import type { Object3D } from './object3d';

export type Mesh = Object3D & {
  geometry: Geometry,
  material: Material,
};

import { object3d_create } from './object3d';

export var mesh_create = (geometry: Geometry, material: Material): Mesh => {
  return {
    ...object3d_create(),
    geometry,
    material,
  };
};
