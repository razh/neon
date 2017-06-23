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

camera_create();
boxGeom_create(1, 1, 1);

declare var c: HTMLCanvasElement;

function render(el) {
  var gl = el.getContext('webgl');
  if (!gl) {
    return;
  }

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = createShaderProgram(
    gl,

    'uniform mat4 M;' +
    'attribute vec3 p;' +
    'attribute vec3 c;' +
    'varying vec3 vc;' +
    'void main() {' +
      'vc = c;' +
      'gl_Position = M * vec4(p, 1.0);' +
    '}',

    'varying lowp vec3 vc;' +
    'void main() {' +
      'gl_FragColor = vec4(vc, 1.0);' +
    '}'
  );

  var attributes = getAttributeLocations(gl, program);
  var uniforms = getUniformLocations(gl, program);

  gl.useProgram(program);

  var position = [
    -0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, -0.5, 0,
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

c.width = window.innerWidth;
c.height = window.innerHeight;
render(c);
