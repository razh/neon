module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  plugins: ['jsdoc', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'func-style': ['error', 'expression'],
    'object-shorthand': ['error', 'always'],
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off',
  },
  settings: {
    jsdoc: {
      definedTypes: ['void'],
      preferredTypes: { object: 'Object' },
      tagNamePreference: { returns: 'return' },
    },
  },
};
