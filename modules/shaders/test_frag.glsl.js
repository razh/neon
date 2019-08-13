export default `
varying lowp vec3 vc;

void main() {
  gl_FragColor = vec4(vc, 1.0);
}
`.trim();
