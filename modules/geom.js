/**
 * @typedef {import('./vec3').Vector3} Vector3
 * @typedef {import('./face3').Face3} Face3
 */

/**
 * @typedef Geometry
 * @property {Vector3[]} vertices
 * @property {Face3[]} faces
 */

import {
  vec3_create,
  vec3_set,
  vec3_clone,
  vec3_add,
  vec3_multiply,
} from './vec3.js';
import { face3_create, face3_clone } from './face3.js';

var _vector = vec3_create();

/**
 * @return {Geometry}
 */
export var geom_create = () => {
  return {
    vertices: [],
    faces: [],
  };
};

/**
 * @param {Geometry} geom
 * @param {number[]} vertices
 * @param {number[]} faces
 * @return {Geometry}
 */
export var geom_push = (geom, vertices, faces) => {
  var offset = geom.vertices.length;

  var i;
  for (i = 0; i < vertices.length; i += 3) {
    geom.vertices.push(
      vec3_create(vertices[i], vertices[i + 1], vertices[i + 2]),
    );
  }

  for (i = 0; i < faces.length; i += 3) {
    geom.faces.push(
      face3_create(
        offset + faces[i],
        offset + faces[i + 1],
        offset + faces[i + 2],
      ),
    );
  }

  return geom;
};

/**
 * @param {Geometry} geom
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {Geometry}
 */
export var geom_translate = (geom, x, y, z) => {
  vec3_set(_vector, x, y, z);
  geom.vertices.map(vertex => vec3_add(vertex, _vector));
  return geom;
};

/**
 * @param {Geometry} geom
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {Geometry}
 */
export var geom_scale = (geom, x, y, z) => {
  vec3_set(_vector, x, y, z);
  geom.vertices.map(vertex => vec3_multiply(vertex, _vector));
  return geom;
};

/**
 * @param {Geometry} a
 * @param {Geometry} b
 * @return {Geometry}
 */
export var geom_merge = (a, b) => {
  var vertexOffset = a.vertices.length;

  a.vertices.push(...b.vertices.map(vec3_clone));

  a.faces.push(
    ...b.faces.map(face => {
      var faceCopy = face3_clone(face);
      faceCopy.a += vertexOffset;
      faceCopy.b += vertexOffset;
      faceCopy.c += vertexOffset;
      return faceCopy;
    }),
  );

  return a;
};

/**
 * @param {Geometry} geom
 * @return {Geometry}
 */
export var geom_clone = geom => {
  var clone = geom_create();
  clone.vertices = geom.vertices.map(vec3_clone);
  clone.faces = geom.faces.map(face3_clone);
  return clone;
};
