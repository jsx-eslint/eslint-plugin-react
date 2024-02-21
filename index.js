'use strict';

const configAll = require('./configs/all');
const configRecommended = require('./configs/recommended');
const configRuntime = require('./configs/jsx-runtime');

const allRules = require('./lib/rules');

// for legacy config system
const plugins = [
  'react',
];

const plugin = {
  deprecatedRules: configAll.plugins.react.deprecatedRules,
  rules: allRules,
  configs: {
    recommended: Object.assign({}, configRecommended, {
      parserOptions: configRecommended.languageOptions.parserOptions,
      plugins,
    }),
    all: Object.assign({}, configAll, {
      parserOptions: configAll.languageOptions.parserOptions,
      plugins,
    }),
    'jsx-runtime': Object.assign({}, configRuntime, {
      parserOptions: configRuntime.languageOptions.parserOptions,
      plugins,
    }),

    'flat/recommended': Object.assign({}, configRecommended),
    'flat/all': Object.assign({}, configAll),
    'flat/jsx-runtime': Object.assign({}, configRuntime),
  },
};

// need to ensure the flat configs reference the same plugin identity
plugin.configs['flat/recommended'].plugins.react = plugin;
plugin.configs['flat/all'].plugins.react = plugin;
plugin.configs['flat/recommended'].plugins.react = plugin;

module.exports = plugin;
