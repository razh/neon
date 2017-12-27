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
    Promise: false,
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
    WeakMap: false,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'func-style': ['error', 'expression'],
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    'space-in-parens': ['error', 'never'],
  },
};
