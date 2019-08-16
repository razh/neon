/**
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @param {Float32Array} array
 * @param {Vector3[]} vectors
 * @return {Float32Array}
 */
export var bufferAttr_copyVector3sArray = (array, vectors) => {
  var offset = 0;

  vectors.map(vector => {
    array[offset++] = vector.x;
    array[offset++] = vector.y;
    array[offset++] = vector.z;
  });

  return array;
};
