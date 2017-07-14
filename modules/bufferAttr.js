// @flow

import type { Vector3 } from './vec3';

export var bufferAttr_copyVector3sArray = (array: Float32Array, vectors: Array<Vector3>) => {
  var offset = 0;

  vectors.map(vector => {
    array[offset++] = vector.x;
    array[offset++] = vector.y;
    array[offset++] = vector.z;
  });

  return array;
};
