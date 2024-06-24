'use strict';

const reactRecommended = require('../../../../configs/recommended');

module.exports = [{
  files: ['**/*.jsx'],
  ...reactRecommended,
  languageOptions: {
    ...reactRecommended.languageOptions
  }
}];
