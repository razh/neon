// @flow

import { camera_create } from './camera';
import { boxGeom_create } from './boxGeom';
import { render as renderBasic } from './examples/basic';

camera_create();
boxGeom_create(1, 1, 1);

declare var c: HTMLCanvasElement;

// Cast from ?WebGLRenderingContext.
var gl = ((c.getContext('webgl'): any): WebGLRenderingContext);

gl.clearColor(0, 0, 0, 0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.getExtension('OES_standard_derivatives');

var setSize = (width, height) => {
  c.width = width;
  c.height = height;
  gl.viewport(0, 0, width, height);
};

var render = renderBasic(gl);

setSize(window.innerWidth, window.innerHeight);
render();

window.addEventListener('resize', () => {
  setSize(window.innerWidth, window.innerHeight);
  render();
});
