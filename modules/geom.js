//  @flow

import type { Vector3 } from './vec3';
import type { Face3 } from './face3';

export type Geometry = {
  vertices: Array<Vector3>,
  faces: Array<Face3>,
};

import { face3_create } from './face3';

import {
  vec3_create,
  vec3_copy,
  vec3_cross,
  vec3_subVectors,
  vec3_normalize,
} from './vec3';

export function geom_create(): Geometry {
  return {
    vertices: [],
    faces: [],
  };
}

export function geom_push(geom: Geometry, vertices: Array<number>, faces: Array<number>) {
  var offset = geom.vertices.length;

  var i;
  for (i = 0; i < vertices.length; i += 3) {
    geom.vertices.push(
      vec3_create(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2]
      )
    );
  }

  for (i = 0; i < faces.length; i += 3) {
    geom.faces.push(
      face3_create(
        offset + faces[i],
        offset + faces[i + 1],
        offset + faces[i + 2]
      )
    );
  }

  return geom;
}
