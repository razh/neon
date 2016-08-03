import { face3_create } from './face3';

import {
  vec3_create,
  vec3_copy,
  vec3_cross,
  vec3_subVectors,
  vec3_normalize,
} from './vec3';

export function geom_create() {
  return {
    vertices: [],
    faces: [],
  };
}

export function geom_push(geom, vertices, faces) {
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

export var geom_computeFaceNormals = (function() {
  var cb = vec3_create();
  var ab = vec3_create();

  return function(geom) {
    var faces = geom.faces;

    for (var f = 0; f < faces.length; f++) {
      var face = faces[f];

      var vA = geom.vertices[face.a];
      var vB = geom.vertices[face.b];
      var vC = geom.vertices[face.c];

      vec3_subVectors(cb, vC, vB);
      vec3_subVectors(ab, vA, vB);
      vec3_cross(cb, ab);

      vec3_normalize(cb);

      vec3_copy(face.normal);
    }

    return geom;
  };
}());
