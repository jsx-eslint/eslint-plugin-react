'use strict';

const fromEntries = require('object.fromentries');
const entries = require('object.entries');

const allRules = require('./lib/rules');

function filterRules(rules, predicate) {
  return fromEntries(entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, 2>}
 */
function configureAsError(rules) {
  return fromEntries(Object.keys(rules).map((key) => [`react/${key}`, 2]));
}

const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

// for legacy config system
const plugins = [
  'react',
];

const plugin = {
  deprecatedRules,
  rules: allRules,
  configs: {
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
  },
};

plugin.configs.flat = {
  recommended: {
    plugins: { react: plugin },
    rules: plugin.configs.recommended.rules,
    languageOptions: { parserOptions: plugin.configs.recommended.parserOptions },
  },
  all: {
    plugins: { react: plugin },
    rules: plugin.configs.all.rules,
    languageOptions: { parserOptions: plugin.configs.all.parserOptions },
  },
  'jsx-runtime': {
    plugins: { react: plugin },
    rules: plugin.configs['jsx-runtime'].rules,
    languageOptions: { parserOptions: plugin.configs['jsx-runtime'].parserOptions },
  },
};

module.exports = plugin;
