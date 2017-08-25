// @flow

import type { BufferGeometry } from '../bufferGeom';
import type { Mesh } from '../mesh';

import { boxGeom_create } from '../boxGeom';
import { bufferGeom_fromGeom, bufferGeom_create } from '../bufferGeom';
import {
  camera_create,
  camera_lookAt,
  camera_updateProjectionMatrix,
} from '../camera';
import { light_create } from '../directionalLight';
import { mat4_getInverse, mat4_multiplyMatrices } from '../mat4';
import { material_create } from '../material';
import { mesh_create } from '../mesh';
import {
  object3d_add,
  object3d_create,
  object3d_traverse,
  object3d_updateMatrixWorld,
} from '../object3d';
import {
  createShaderProgram,
  createFloat32Buffer,
  setFloat32Attribute,
  setFloatUniform,
  setMat4Uniform,
  setVec3Uniform,
  getAttributeLocations,
  getUniformLocations,
} from '../shader';
import {
  vec3_create,
  vec3_multiplyScalar,
  vec3_set,
  vec3_setFromMatrixPosition,
  vec3_sub,
  vec3_transformDirection,
} from '../vec3';

import vert from '../shaders/phong_vert.glsl';
import frag from '../shaders/phong_frag.glsl';

declare var c: HTMLCanvasElement;

// Cast from ?WebGLRenderingContext.
var gl = ((c.getContext('webgl'): any): WebGLRenderingContext);

gl.clearColor(0, 0, 0, 0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.getExtension('OES_standard_derivatives');

var fogColor = vec3_create(1, 1, 1);
var fogNear = 1;
var fogFar = 1000;

var ambientLightColor = vec3_create(0.5, 0.5, 0.5);

var light = light_create(vec3_create(1, 1, 1));
vec3_set(light.position, 128, 48, 0);

var directionalLights = [
  light,
];

var program = createShaderProgram(
  gl,
  vert,
  frag.replace(/NUM_DIR_LIGHTS/g, ((directionalLights.length: any): string)),
);

gl.useProgram(program);

var attributes = getAttributeLocations(gl, program);
var uniforms = getUniformLocations(gl, program);

var scene = object3d_create();
var camera = camera_create(60);
vec3_set(camera.position, 64, 64, 64);
camera_lookAt(camera, vec3_create());

var cameraObject = object3d_create();
object3d_add(cameraObject, camera);
object3d_add(scene, cameraObject);
directionalLights.map(light => object3d_add(scene, light));

object3d_add(
  scene,
  mesh_create(
    boxGeom_create(8, 8, 8),
    material_create(),
  ),
);

var bufferGeomBuffers = new WeakMap();

var setFloat32AttributeBuffer = (
  name: string,
  location: number,
  bufferGeom: BufferGeometry,
  size: number
) => {
  var buffers = bufferGeomBuffers.get(bufferGeom);

  if (!buffers) {
    buffers = {};
    bufferGeomBuffers.set(bufferGeom, buffers);
  }

  var buffer = buffers[name];
  if (!buffer) {
    buffer = createFloat32Buffer(gl, bufferGeom.attrs[name]);
    buffers[name] = buffer;
  }

  setFloat32Attribute(gl, location, buffer, size);
};

var bufferGeoms = new WeakMap();

var renderMesh = (mesh: Mesh) => {
  var { geometry, material } = mesh;

  setVec3Uniform(gl, uniforms.fogColor, fogColor);
  setFloatUniform(gl, uniforms.fogNear, fogNear);
  setFloatUniform(gl, uniforms.floatFar, fogFar);

  setVec3Uniform(gl, uniforms.diffuse, material.color);
  setVec3Uniform(gl, uniforms.specular, material.specular);
  setFloatUniform(gl, uniforms.shininess, material.shininess);
  setVec3Uniform(gl, uniforms.emissive, material.emissive);

  mat4_multiplyMatrices(mesh.modelViewMatrix, camera.matrixWorldInverse, mesh.matrixWorld);

  setMat4Uniform(gl, uniforms.modelViewMatrix, mesh.modelViewMatrix);
  setMat4Uniform(gl, uniforms.projectionMatrix, camera.projectionMatrix);

  var bufferGeom = bufferGeoms.get(geometry);
  if (!bufferGeom) {
    bufferGeom = bufferGeom_fromGeom(bufferGeom_create(), geometry);
    bufferGeoms.set(geometry, bufferGeom);
  }

  setFloat32AttributeBuffer('position', attributes.position, bufferGeom, 3);
  setFloat32AttributeBuffer('color', attributes.color, bufferGeom, 3);

  gl.drawArrays(gl.TRIANGLES, 0, bufferGeom.attrs.position.length / 3);
};

var lightDirection = vec3_create();

var render = () => {
  object3d_updateMatrixWorld(scene);
  mat4_getInverse(camera.matrixWorldInverse, camera.matrixWorld);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  setVec3Uniform(gl, uniforms.ambientLightColor, ambientLightColor);

  directionalLights.map((light, index) => {
    var temp = vec3_create();

    var direction = vec3_setFromMatrixPosition(lightDirection, light.matrixWorld);
    vec3_setFromMatrixPosition(temp, light.target.matrixWorld);
    vec3_transformDirection(vec3_sub(direction, temp), camera.matrixWorldInverse);

    var color = vec3_multiplyScalar(Object.assign(temp, light.color), light.intensity);

    setVec3Uniform(gl, uniforms[`directionalLights[${index}].direction`], direction);
    setVec3Uniform(gl, uniforms[`directionalLights[${index}].color`], color);
  });

  object3d_traverse(scene, object => {
    if (object.visible && object.geometry && object.material) {
      renderMesh(((object: any): Mesh));
    }
  });
};

var setSize = (width, height) => {
  c.width = width;
  c.height = height;
  gl.viewport(0, 0, width, height);

  camera.aspect = width / height;
  camera_updateProjectionMatrix(camera);
};

setSize(window.innerWidth, window.innerHeight);
render();

window.addEventListener('resize', () => {
  setSize(window.innerWidth, window.innerHeight);
  render();
});
