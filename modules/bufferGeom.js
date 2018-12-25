/**
 * @typedef {import('./directGeom').DirectGeometry} DirectGeometry
 * @typedef {import('./geom').Geometry} Geometry
 */

/**
 * @typedef BufferGeometry
 * @property {Object.<string, Float32Array>} attrs
 */

import { bufferAttr_copyVector3sArray } from './bufferAttr.js';
import { directGeom_fromGeom } from './directGeom.js';

/**
 * @return {BufferGeometry}
 */
export var bufferGeom_create = () => {
  return {
    attrs: {},
  };
};

/**
 * @param {BufferGeometry} bufferGeom
 * @param {Geometry} geom
 * @return {BufferGeometry}
 */
export var bufferGeom_fromGeom = (bufferGeom, geom) =>
  bufferGeom_fromDirectGeom(bufferGeom, directGeom_fromGeom(geom));

/**
 * @param {BufferGeometry} bufferGeom
 * @param {DirectGeometry} geom
 * @return {BufferGeometry}
 */
export var bufferGeom_fromDirectGeom = (bufferGeom, geom) => {
  var positions = new Float32Array(geom.vertices.length * 3);
  bufferGeom.attrs.position = bufferAttr_copyVector3sArray(
    positions,
    geom.vertices,
  );

  var colors = new Float32Array(geom.colors.length * 3);
  bufferGeom.attrs.color = bufferAttr_copyVector3sArray(colors, geom.colors);

  return bufferGeom;
};
