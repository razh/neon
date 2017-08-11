// @flow

import type { BufferGeometry } from '../bufferGeom';
import type { Camera } from '../camera';
import type { Mesh } from '../mesh';
import type { Object3D } from '../object3d';

import { bufferGeom_fromGeom, bufferGeom_create } from '../bufferGeom';
import { mat4_multiplyMatrices } from '../mat4';
import { object3d_traverse } from '../object3d';
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
import { vec3_create } from '../vec3';

import vert from '../shaders/phong_vert.glsl';
import frag from '../shaders/phong_frag.glsl';

var fogColor = vec3_create(1, 1, 1);
var fogNear = 1;
var fogFar = 1000;

export var render = (gl: WebGLRenderingContext) => {
  var program = createShaderProgram(gl, vert, frag);

  var attributes = getAttributeLocations(gl, program);
  var uniforms = getUniformLocations(gl, program);

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
      buffers.set(bufferGeom, buffers);
    }

    var buffer = buffers[name];
    if (!buffer) {
      buffer = createFloat32Buffer(gl, bufferGeom.attrs[name]);
      buffers[name] = buffer;
    }

    setFloat32Attribute(gl, location, buffer, size);
  };

  var bufferGeoms = new WeakMap();

  var renderMesh = (mesh: Mesh, camera: Camera) => {
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

  return (scene: Object3D, camera: Camera) => {
    object3d_traverse(scene, object => {
      if (object.visible && object.geometry && object.material) {
        renderMesh(((object: any): Mesh), camera);
      }
    });
  };
};
