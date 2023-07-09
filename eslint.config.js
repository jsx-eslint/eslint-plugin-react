'use strict';

const globals = require('globals');
const eslintPluginRecommended = require('eslint-plugin-eslint-plugin/configs/recommended');

const FlatCompat = require('@eslint/eslintrc').FlatCompat;

const eslintrc = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      'coverage/',
      '.nyc_output/',
    ],
  },
  ...eslintrc.extends('airbnb-base'),
  eslintPluginRecommended,
  {
    languageOptions: {
      ecmaVersion: 6,
      sourceType: 'commonjs',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.node,
    },
    rules: {
      'comma-dangle': [2, 'always-multiline'],
      'object-shorthand': [2, 'always', {
        ignoreConstructors: false,
        avoidQuotes: false, // this is the override vs airbnb
      }],
      'max-len': [2, 120, {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
      'consistent-return': 0,

      'prefer-destructuring': [2, { array: false, object: false }, { enforceForRenamedProperties: false }],
      'prefer-object-spread': 0, // until node 8 is required
      'prefer-rest-params': 0, // until node 6 is required
      'prefer-spread': 0, // until node 6 is required
      'function-call-argument-newline': 1, // TODO: enable
      'function-paren-newline': 0,
      'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
      'no-param-reassign': 1,
      'no-restricted-syntax': [2, {
        selector: 'ObjectPattern',
        message: 'Object destructuring is not compatible with Node v4',
      }],
      strict: [2, 'safe'],
      'valid-jsdoc': [2, {
        requireReturn: false,
        requireParamDescription: false,
        requireReturnDescription: false,
      }],

      'eslint-plugin/consistent-output': 0,
      'eslint-plugin/require-meta-docs-description': [2, { pattern: '^(Enforce|Require|Disallow)' }],
      'eslint-plugin/require-meta-schema': 0,
      'eslint-plugin/require-meta-type': 0,

      // overrides airbnb config to add `eslint.config.js` to `devDependencies`
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'test/**',
            'tests/**',
            'spec/**',
            '**/__tests__/**',
            '**/__mocks__/**',
            'test.{js,jsx}',
            'test-*.{js,jsx}',
            '**/*{.,_}{test,spec}.{js,jsx}',
            '**/jest.config.js',
            '**/jest.setup.js',
            '**/vue.config.js',
            '**/webpack.config.js',
            '**/webpack.config.*.js',
            '**/rollup.config.js',
            '**/rollup.config.*.js',
            '**/gulpfile.js',
            '**/gulpfile.*.js',
            '**/Gruntfile{,.js}',
            '**/protractor.conf.js',
            '**/protractor.conf.*.js',
            '**/karma.conf.js',
            '**/.eslintrc.js',
            'eslint.config.js',
          ],
          optionalDependencies: false,
        },
      ],
    },
  },
  {
    files: ['tests/**'],
    languageOptions: {
      globals: globals.mocha,
    },
    rules: {
      'no-template-curly-in-string': 1,
    },
  },
  {
    files: ['markdown.config.js'],
    rules: {
      'no-console': 0,
    },
  },
  {
    files: ['.github/workflows/*.js'],
    languageOptions: {
      ecmaVersion: 2019,
    },
    rules: {
      camelcase: 0,
      'no-console': 0,
      'no-restricted-syntax': 0,
    },
  },

];
