// @flow

import {
  createShaderProgram,
  createFloat32Buffer,
  setFloat32Attribute,
  setMat4Uniform,
  getAttributeLocations,
  getUniformLocations,
} from '../shader';

import vert from '../shaders/test_vert.glsl';
import frag from '../shaders/test_frag.glsl';

export var render = (gl: WebGLRenderingContext) => () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var program = createShaderProgram(gl, vert, frag);

  var attributes = getAttributeLocations(gl, program);
  var uniforms = getUniformLocations(gl, program);

  gl.useProgram(program);

  var position = new Float32Array([
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, 0.5, 0,
  ]);

  var positionBuffer = createFloat32Buffer(gl, position);

  var color = createFloat32Buffer(gl, new Float32Array([
    1, 1, 1,
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ]));

  setMat4Uniform(gl, uniforms.M, new Float32Array([
    0.5, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0.25, 0, 0, 1,
  ]));

  setFloat32Attribute(gl, attributes.p, positionBuffer, 3);
  setFloat32Attribute(gl, attributes.c, color, 3);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
};
