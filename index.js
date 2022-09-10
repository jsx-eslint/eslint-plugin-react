'use strict';

const fromEntries = require('object.fromentries');
const entries = require('object.entries');

const configAll = require('./configs/all');
const configRecommended = require('./configs/recommended');
const configRuntime = require('./configs/jsx-runtime');

const allRules = configAll.rules;

function filterRules(rules, predicate) {
  return fromEntries(entries(rules).filter((entry) => predicate(entry[1])));
}

function configureAsError(rules) {
  return fromEntries(Object.keys(rules).map((key) => [`react/${key}`, 2]));
}

const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

const eslintrcPlugins = [
  'react',
];

module.exports = {
  deprecatedRules,
  rules: allRules,
  configs: {
    recommended: Object.assign({}, configRecommended, {
      plugins: eslintrcPlugins,
    }),
    all: Object.assign({}, configAll, {
      plugins: eslintrcPlugins,
      rules: activeRulesConfig,
    }),
    'jsx-runtime': Object.assign({}, configRuntime, {
      plugins: eslintrcPlugins,
    }),
  },
};
