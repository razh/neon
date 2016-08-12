module.exports = {
  extends: 'eslint:recommended',
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  plugins: [
    'flowtype',
  ],
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
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],

    'flowtype/define-flow-type': 'warning',
    "flowtype/require-parameter-type": 'warning',
    'flowtype/require-return-type': [
      'warning',
      'always',
      {
        annotateUndefined: 'never'
      }
    ],
    'flowtype/space-after-type-colon': ['warning', 'always'],
    'flowtype/space-before-type-colon': ['warning', 'never'],
    'flowtype/type-id-match': ['warning', '^([A-Z][a-z0-9]+)+Type$'],
    'flowtype/use-flow-type': 'warning',
    'flowtype/valid-syntax': 'warning',
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    }
  },
};
