//  @flow

import type { Vector3 } from './vec3';
import type { Face3 } from './face3';

export type Geometry = {
  vertices: Array<Vector3>,
  faces: Array<Face3>,
};

import {
  vec3_create,
  vec3_set,
  vec3_clone,
  vec3_add,
  vec3_multiply,
} from './vec3';
import { face3_create, face3_clone } from './face3';

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

export var geom_translate = (() => {
  var vector = vec3_create();

  return (geom: Geometry, x: number, y: number, z: number) => {
    vec3_set(vector, x, y, z);
    geom.vertices.map(vertex => vec3_add(vertex, vector));
    return geom;
  };
})();

export var geom_scale = (() => {
  var vector = vec3_create();

  return (geom: Geometry, x: number, y: number, z: number) => {
    vec3_set(vector, x, y, z);
    geom.vertices.map(vertex => vec3_multiply(vertex, vector));
    return geom;
  };
})();

export function geom_merge(a: Geometry, b: Geometry) {
  var vertexOffset = a.vertices.length;

  a.vertices.push(...b.vertices.map(vec3_clone));

  a.faces.push(...b.faces.map(face => {
    var faceCopy = face3_clone(face);
    faceCopy.a += vertexOffset;
    faceCopy.b += vertexOffset;
    faceCopy.c += vertexOffset;
    return faceCopy;
  }))

  return a;
}

export function geom_clone(geom: Geometry) {
  var clone = geom_create();
  clone.vertices = geom.vertices.map(vec3_clone);
  clone.faces = geom.faces.map(face3_clone);
  return clone;
}
