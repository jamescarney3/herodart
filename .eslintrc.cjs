const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['~', path.resolve(__dirname, './src')]],
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    semi: ['warn'],
    quotes: ['warn', 'single'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'sibling',
          'parent',
          'index',
        ],
      },
    ],
    'import/newline-after-import': [
      'error',
      { count: 1, exactCount: true, considerComments: true },
    ],
  },
};
