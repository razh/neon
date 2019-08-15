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
  plugins: ['jsdoc', 'prettier'],
  parserOptions: {
    ecmaVersion: 2019,
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
      preferredTypes: { object: 'Object' },
      tagNamePreference: { returns: 'return' },
    },
  },
};
