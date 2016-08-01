import { mat4_create } from './mat4';
import { vec3_clone, vec3_Y } from './mat4';

var DEG_TO_RAD = Math.PI / 180;

export function camera_create(fov, aspect, near, far) {
  return camera_updateProjectionMatrix({
    fov: fov || 60,
    near: near || 0.1,
    far: far || 2000,
    aspect: aspect || 1,
    up: vec3_clone(vec3_Y),
    matrixWorldInverse: mat4_create(),
    projectionMatrix: mat4_create()
  });
}

export function camera_updateProjectionMatrix(camera) {
  var near = camera.near;
  var far = camera.far;

  var top = near * Math.tan(camera.fov * 0.5 * DEG_TO_RAD);
  var bottom = -top;
  var left = bottom * this.aspect;
  var right = top * this.aspect;

  var x = 2 * near / (right - left);
  var y = 2 * near / (top - bottom);

  var a = (right + left) / (right - left);
  var b = (top + bottom) / (top - bottom);
  var c = -(far + near) / (far - near);
  var d = -2 * far * near / (far - near);

  camera.projectionMatrix.set([
    x, 0, 0, 0,
    0, y, 0, 0,
    a, b, c, -1,
    0, 0, d, 0
  ]);

  return camera;
}
