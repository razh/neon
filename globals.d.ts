interface Document {
  readonly pointerLockElement: Element;
}

interface Element {
  requestPointerLock(): void;
}

// Force non-null return values.
interface WebGLRenderingContext {
  createBuffer(): WebGLBuffer;
  createProgram(): WebGLProgram;
  createShader(type: number): WebGLShader;
  getActiveAttrib(program: WebGLProgram, index: number): WebGLActiveInfo;
  getActiveUniform(program: WebGLProgram, index: number): WebGLActiveInfo;
  getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation;
}
