'use strict';

const reactPlugin = require('../../../..');

module.exports = [
  {
    files: ['**/*.jsx'],
    ...reactPlugin.configs['flat/recommended']
  },
  reactPlugin.configs['flat/jsx-runtime']
];
