'use strict';

const reactRecommended = require('../../../../configs/recommended');
const reactJSXRuntime = require('../../../../configs/jsx-runtime');

module.exports = [
  {
    files: ['**/*.jsx'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions
    }
  },
  reactJSXRuntime
];
