// @flow

type BufferGeometry = {
  attrs: { [string]: Float32Array },
  buffers: { [string]: Float32Array },
};

export function bufferGeom_create(): BufferGeometry {
  return {
    attrs: {},
    buffers: {},
  };
}
