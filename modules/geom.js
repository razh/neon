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
  vec3_copy,
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

export var geom_translate = (function() {
  var vector = vec3_create();

  return function(geom: Geometry, x: number, y: number, z: number) {
    vec3_set(vector, x, y, z);

    geom.vertices.map(function(vertex) {
      vec3_add(vertex, vector);
    });

    return geom;
  };
}());

export var geom_scale = (function() {
  var vector = vec3_create();

  return function(geom: Geometry, x: number, y: number, z: number) {
    vec3_set(vector, x, y, z);

    geom.vertices.map(function(vertex) {
      vec3_multiply(vertex, vector);
    });

    return geom;
  };
}());

export function geom_merge(a: Geometry, b: Geometry) {
  var vertexOffset = a.vertices.length;

  var i;
  for (i = 0; i < b.vertices.length; i++) {
    a.vertices.push(vec3_clone(b.vertices[i]));
  }

  for (i = 0; i < b.faces.length; i++) {
    var face = b.faces[i];
    var faceCopy = face3_create(
      face.a + vertexOffset,
      face.b + vertexOffset,
      face.c + vertexOffset
    );

    vec3_copy(faceCopy.color, face.color);

    for (var j = 0; j < face.vertexColors.length; j++) {
      faceCopy.vertexColors.push(vec3_clone(face.vertexColors[j]));
    }

    a.faces.push(faceCopy);
  }

  return a;
}

export function geom_clone(geom: Geometry) {
  var clone = geom_create();
  clone.vertices = geom.vertices.map(vec3_clone);
  clone.faces = geom.faces.map(face3_clone);
  return clone;
}
