/* global c */
function createShaderProgram(gl, vs, fs) {
  var program = gl.createProgram();

  function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }

  createShader(gl.VERTEX_SHADER, vs);
  createShader(gl.FRAGMENT_SHADER, fs);

  gl.linkProgram(program);

  return program;
}

function setFloat32Attribute(gl, program, name, size, array) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);

  var location = gl.getAttribLocation(program, name);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function setMat4Uniform(gl, program, name, array) {
  var location = gl.getUniformLocation(program, name);
  gl.uniformMatrix4fv(location, false, array);
}

function render(el) {
  var gl = el.getContext('webgl');
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

  gl.useProgram(program);

  var position = [
    -0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0,
  ];

  var color = [
    1, 1, 1,
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ];

  setMat4Uniform(gl, program, 'M', new Float32Array([
    0.5, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0.25, 0, 0, 1,
  ]));

  setFloat32Attribute(gl, program, 'p', 3, position);
  setFloat32Attribute(gl, program, 'c', 3, color);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, position.length / 3);
}

c.width = window.innerWidth;
c.height = window.innerHeight;
render(c);
