import {
  createShaderProgram,
  createFloat32Buffer,
  setFloat32Attribute,
  setMat4Uniform,
  getAttributeLocations,
  getUniformLocations,
} from '../shader.js';

import vert from '../shaders/test_vert.glsl.js';
import frag from '../shaders/test_frag.glsl.js';

/* global c */
// prettier-ignore
var gl = /** @type {WebGLRenderingContext} */ (c.getContext('webgl'));
gl.clearColor(0, 0, 0, 0);

var program = createShaderProgram(gl, vert, frag);
gl.useProgram(program);

// Create buffers.
// prettier-ignore
var position = new Float32Array([
  -0.5, -0.5, 0,
  0.5, -0.5, 0,
  -0.5, 0.5, 0,
  0.5, 0.5, 0,
]);

var positionBuffer = createFloat32Buffer(gl, position);

// prettier-ignore
var color = createFloat32Buffer(gl, new Float32Array([
  1, 1, 1,
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
]));

// Set attributes and uniforms.
var attributes = getAttributeLocations(gl, program);
var uniforms = getUniformLocations(gl, program);

// prettier-ignore
setMat4Uniform(gl, uniforms.M, new Float32Array([
  0.5, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0.25, 0, 0, 1,
]));

setFloat32Attribute(gl, attributes.p, positionBuffer, 3);
setFloat32Attribute(gl, attributes.c, color, 3);

/**
 * @param {number} width
 * @param {number} height
 */
var setSize = (width, height) => {
  c.width = width;
  c.height = height;
  gl.viewport(0, 0, width, height);
};

var render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
};

setSize(window.innerWidth, window.innerHeight);
render();

window.addEventListener('resize', () => {
  setSize(window.innerWidth, window.innerHeight);
  render();
});
