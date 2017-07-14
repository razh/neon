// @flow

import type { Vector3 } from './vec3';

export type Material = {
  color: Vector3,
  specular: Vector3,
  shininess: number,
  emissive: Vector3,
};

import { vec3_create } from './vec3';

// MeshPhongMaterial.
export var material_create = (): Material => {
  return {
    color: vec3_create(1, 1, 1),
    // 0x111111
    specular: vec3_create(1 / 15, 1 / 15, 1 / 15),
    shininess: 30,
    emissive: vec3_create(),
  };
};
