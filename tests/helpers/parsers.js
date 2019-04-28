'use strict';

const path = require('path');

const NODE_MODULES = '../../node_modules';

module.exports = {
  BABEL_ESLINT: path.join(__dirname, NODE_MODULES, 'babel-eslint'),
  TYPESCRIPT_ESLINT: path.join(__dirname, NODE_MODULES, '@typescript-eslint/parser')
};
