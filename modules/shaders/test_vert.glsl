uniform mat4 M;
attribute vec3 p;
attribute vec3 c;
varying vec3 vc;

void main() {
  vc = c;
  gl_Position = M * vec4(p, 1.0);
}
