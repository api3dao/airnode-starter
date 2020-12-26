module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    // ESLint
    'comma-dangle': [2, 'only-multiline'],
    indent: 'off',
    'no-console': 0,
    'no-useless-escape': 0,
    semi: 2,
  },
};
