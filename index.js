'use strict';

const fromEntries = require('object.fromentries');
const entries = require('object.entries');

const allRules = require('./lib/rules');

function filterRules(rules, predicate) {
  return fromEntries(entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, 2 | 'error'>}
 */
function configureAsError(rules) {
  return fromEntries(Object.keys(rules).map((key) => [`react/${key}`, 2]));
}

/** @type {Partial<typeof allRules>} */
const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
/** @type {Record<keyof typeof activeRules, 2 | 'error'>} */
const activeRulesConfig = configureAsError(activeRules);

/** @type {Partial<typeof allRules>} */
const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

/** @type {['react']} */
// for legacy config system
const plugins = [
  'react',
];

const configs = {
  recommended: {
    plugins,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      'react/display-name': 2,
      'react/jsx-key': 2,
      'react/jsx-no-comment-textnodes': 2,
      'react/jsx-no-duplicate-props': 2,
      'react/jsx-no-target-blank': 2,
      'react/jsx-no-undef': 2,
      'react/jsx-uses-react': 2,
      'react/jsx-uses-vars': 2,
      'react/no-children-prop': 2,
      'react/no-danger-with-children': 2,
      'react/no-deprecated': 2,
      'react/no-direct-mutation-state': 2,
      'react/no-find-dom-node': 2,
      'react/no-is-mounted': 2,
      'react/no-render-return-value': 2,
      'react/no-string-refs': 2,
      'react/no-unescaped-entities': 2,
      'react/no-unknown-property': 2,
      'react/no-unsafe': 0,
      'react/prop-types': 2,
      'react/react-in-jsx-scope': 2,
      'react/require-render-return': 2,
    },
  },
  all: {
    plugins,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: activeRulesConfig,
  },
  'jsx-runtime': {
    plugins,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      jsxPragma: null, // for @typescript/eslint-parser
    },
    rules: {
      'react/react-in-jsx-scope': 0,
      'react/jsx-uses-react': 0,
    },
  },
};

/** @typedef {{ plugins: { react: typeof plugin }, rules: import('eslint').Linter.RulesRecord, languageOptions: { parserOptions: import('eslint').Linter.ParserOptions } }} ReactFlatConfig */

/** @type {{ deprecatedRules: typeof deprecatedRules, rules: typeof allRules, configs: typeof configs & { flat?: Record<string, ReactFlatConfig> }}} */
const plugin = {
  deprecatedRules,
  rules: allRules,
  configs,
};

/** @type {Record<string, ReactFlatConfig>} */
configs.flat = {
  recommended: {
    plugins: { react: plugin },
    rules: configs.recommended.rules,
    languageOptions: { parserOptions: configs.recommended.parserOptions },
  },
  all: {
    plugins: { react: plugin },
    rules: configs.all.rules,
    languageOptions: { parserOptions: configs.all.parserOptions },
  },
  'jsx-runtime': {
    plugins: { react: plugin },
    rules: configs['jsx-runtime'].rules,
    languageOptions: { parserOptions: configs['jsx-runtime'].parserOptions },
  },
};

module.exports = plugin;
