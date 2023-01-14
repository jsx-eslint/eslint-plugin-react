'use strict';

const configAll = require('./configs/all');
const configRecommended = require('./configs/recommended');
const configRuntime = require('./configs/jsx-runtime');

const allRules = require('./lib/rules');

// for legacy config system
const plugins = [
  'react',
];

module.exports = {
  deprecatedRules: configAll.plugins.react.deprecatedRules,
  rules: allRules,
  configs: {
    recommended: Object.assign({}, configRecommended, {
      plugins,
    }),
    all: Object.assign({}, configAll, {
      plugins,
    }),
    'jsx-runtime': Object.assign({}, configRuntime, {
      plugins,
    }),
  },
};
