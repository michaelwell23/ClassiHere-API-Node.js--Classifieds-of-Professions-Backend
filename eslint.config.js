const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.yarn/**',
      '.pnp.cjs',
      '.pnp.loader.mjs',
      'coverage/**',
      'dist/**',
    ],
  },

  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',

      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
