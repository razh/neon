module.exports = {
  extends: 'eslint:recommended',
  env: {
    browser: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  globals: {
    ArrayBuffer: false,
    DataView: false,
    Float32Array: false,
    Float64Array: false,
    Int16Array: false,
    Int32Array: false,
    Int8Array: false,
    Uint16Array: false,
    Uint32Array: false,
    Uint8Array: false,
    Uint8ClampedArray: false,
  },
};
