'use strict';

const react = require('../../../..');
const reactRecommended = require('../../../../configs/recommended');

module.exports = [
  {
    files: ['**/*.jsx'],
    plugins: { react }
  },
  {
    files: ['**/*.jsx'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions
    }
  }
];
