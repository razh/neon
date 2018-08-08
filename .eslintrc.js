module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:flowtype/recommended',
    'plugin:prettier/recommended',
    'prettier/flowtype',
  ],
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  plugins: ['flowtype', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'func-style': ['error', 'expression'],
    'object-shorthand': ['error', 'always'],
  },
};
