// @flow

import type { Vector3 } from './vec3';

export var createShaderProgram = (gl: WebGLRenderingContext, vs: string, fs: string) => {
  var program = gl.createProgram();

  var createShader = (type, source) => {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);

    // var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    // console.log('Shader compiled successfully: ' + compiled);
    // var compilationLog = gl.getShaderInfoLog(shader);
    // console.log('Shader compiler log: ' + compilationLog);
    // console.log(type, source)
  };

  createShader(gl.VERTEX_SHADER, vs);
  createShader(gl.FRAGMENT_SHADER, fs);

  gl.linkProgram(program);

  return program;
};

export var createFloat32Buffer = (gl: WebGLRenderingContext, array: Float32Array): WebGLBuffer => {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  return buffer;
};

export var setFloat32Attribute = (gl: WebGLRenderingContext, location: number, buffer: WebGLBuffer, size: number) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
};

export var setFloatUniform = (gl: WebGLRenderingContext, location: number, value: number) => {
  gl.uniform1f(location, value);
};

export var setMat4Uniform = (gl: WebGLRenderingContext, location: number, array: Float32Array) => {
  gl.uniformMatrix4fv(location, false, array);
};

export var setVec3Uniform = (gl: WebGLRenderingContext, location: number, vector: Vector3) => {
  gl.uniform3f(location, vector.x, vector.y, vector.z);
};

export var getAttributeLocations = (gl: WebGLRenderingContext, program: WebGLProgram): { [string]: number } => {
  var locations = {};

  var count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  for (var i = 0; i < count; i++) {
    var attribute = ((gl.getActiveAttrib(program, i): any): WebGLActiveInfo);
    var { name } = attribute;
    locations[name] = gl.getAttribLocation(program, name);
  }

  return locations;
};

export var getUniformLocations = (gl: WebGLRenderingContext, program: WebGLProgram): { [string]: number } => {
  var locations = {};

  var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (var i = 0; i < count; i++) {
    var uniform = ((gl.getActiveUniform(program, i): any): WebGLActiveInfo);
    var { name } = uniform;
    locations[name] = gl.getUniformLocation(program, name);
  }

  return locations;
};
