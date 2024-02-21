'use strict';

const reactAll = require('../../../../configs/all');

module.exports = [{
  files: ['**/*.jsx'],
  ...reactAll,
  languageOptions: {
    ...reactAll.languageOptions
  }
}];
