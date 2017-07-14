module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:flowtype/recommended',
  ],
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  plugins: [
    'flowtype',
  ],
  parserOptions: {
    ecmaVersion: 2017,
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
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
  },
};
