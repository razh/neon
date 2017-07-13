// @flow

import type { DirectGeometry } from './directGeom';
import type { Geometry } from './geom';

type BufferGeometry = {
  attrs: { [string]: Float32Array },
  buffers: { [string]: Float32Array },
};

import { bufferAttr_copyVector3sArray } from './bufferAttr';
import { directGeom_fromGeom } from './directGeom';

export function bufferGeom_create(): BufferGeometry {
  return {
    attrs: {},
    buffers: {},
  };
}

export function bufferGeom_fromGeom(bufferGeom: BufferGeometry, geom: Geometry) {
  return bufferGeom_fromDirectGeom(bufferGeom, directGeom_fromGeom(geom));
}

export function bufferGeom_fromDirectGeom(
  bufferGeom: BufferGeometry,
  geom: DirectGeometry,
): BufferGeometry {
  var positions = new Float32Array(geom.vertices.length * 3);
  bufferGeom.attrs.position = bufferAttr_copyVector3sArray(positions, geom.vertices);

  var colors = new Float32Array(geom.colors.length * 3);
  bufferGeom.attrs.color = bufferAttr_copyVector3sArray(colors, geom.colors);

  return bufferGeom;
}
