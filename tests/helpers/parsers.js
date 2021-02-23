'use strict';

const path = require('path');
const semver = require('semver');
const version = require('eslint/package.json').version;

const NODE_MODULES = '../../node_modules';

module.exports = {
  BABEL_ESLINT: path.join(__dirname, NODE_MODULES, 'babel-eslint'),
  TYPESCRIPT_ESLINT: path.join(__dirname, NODE_MODULES, 'typescript-eslint-parser'),
  '@TYPESCRIPT_ESLINT': path.join(__dirname, NODE_MODULES, '@typescript-eslint/parser'),
  TS: function TS(tests) {
    if (!Array.isArray(tests) || arguments.length > 1) {
      throw new SyntaxError('parsers.TS() takes a single array argument');
    }
    if (semver.satisfies(version, '>= 5')) {
      return tests;
    }
    return [];
  },
  ES2020: function ES2020(tests) {
    if (semver.satisfies(version, '>= 6')) {
      return tests;
    }
    return [];
  }
};
