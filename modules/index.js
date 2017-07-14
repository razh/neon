// @flow

import { camera_create } from './camera';
import { boxGeom_create } from './boxGeom';
import {
  createShaderProgram,
  createFloat32Buffer,
  setFloat32Attribute,
  setMat4Uniform,
  getAttributeLocations,
  getUniformLocations,
} from './shader';
import vert from './shaders/test_vert.glsl';
import frag from './shaders/test_frag.glsl';

camera_create();
boxGeom_create(1, 1, 1);

declare var c: HTMLCanvasElement;

// Cast from ?WebGLRenderingContext.
var gl = ((c.getContext('webgl'): any): WebGLRenderingContext);

gl.clearColor(0, 0, 0, 0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.getExtension('OES_standard_derivatives');

function setSize(width, height) {
  c.width = width;
  c.height = height;
  gl.viewport(0, 0, width, height)
}

setSize(window.innerWidth, window.innerHeight);
render();

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var program = createShaderProgram(gl, vert, frag);

  var attributes = getAttributeLocations(gl, program);
  var uniforms = getUniformLocations(gl, program);

  gl.useProgram(program);

  var position = [
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, 0.5, 0,
  ];

  var positionBuffer = createFloat32Buffer(gl, position);

  var color = createFloat32Buffer(gl, [
    1, 1, 1,
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ]);

  setMat4Uniform(gl, uniforms.M, [
    0.5, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0.25, 0, 0, 1,
  ]);

  setFloat32Attribute(gl, attributes.p, positionBuffer, 3);
  setFloat32Attribute(gl, attributes.c, color, 3);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
}

window.addEventListener('resize', () => {
  setSize(window.innerWidth, window.innerHeight);
  render();
});
