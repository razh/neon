/**
 * @typedef {import('./vec3').Vector3} Vector3
 */

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} vs
 * @param {string} fs
 * @return {WebGLProgram}
 */
export var createShaderProgram = (gl, vs, fs) => {
  var program = gl.createProgram();

  /**
   * @param {number} type
   * @param {string} source
   */
  var createShader = (type, source) => {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  };

  createShader(gl.VERTEX_SHADER, vs);
  createShader(gl.FRAGMENT_SHADER, fs);

  gl.linkProgram(program);

  return program;
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {Float32Array} array
 * @return {WebGLBuffer}
 */
export var createFloat32Buffer = (gl, array) => {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  return buffer;
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} location
 * @param {WebGLBuffer} buffer
 * @param {number} size
 */
export var setFloat32Attribute = (gl, location, buffer, size) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} location
 * @param {number} value
 */
export var setFloatUniform = (gl, location, value) => {
  gl.uniform1f(location, value);
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} location
 * @param {Float32Array} array
 */
export var setMat4Uniform = (gl, location, array) => {
  gl.uniformMatrix4fv(location, false, array);
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} location
 * @param {Vector3} vector
 */
export var setVec3Uniform = (gl, location, vector) => {
  gl.uniform3f(location, vector.x, vector.y, vector.z);
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @return {Object.<string, number>}
 */
export var getAttributeLocations = (gl, program) => {
  /** @type {Object.<string, number>} */
  var locations = {};

  var count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  for (var i = 0; i < count; i++) {
    var attribute = gl.getActiveAttrib(program, i);
    var { name } = attribute;
    locations[name] = gl.getAttribLocation(program, name);
  }

  return locations;
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @return {Object.<string, WebGLUniformLocation>}
 */
export var getUniformLocations = (gl, program) => {
  /** @type {Object.<string, WebGLUniformLocation>} */
  var locations = {};

  var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (var i = 0; i < count; i++) {
    var uniform = gl.getActiveUniform(program, i);
    var { name } = uniform;
    locations[name] = gl.getUniformLocation(program, name);
  }

  return locations;
};
