'use strict';

const ESLintRuleTester = require('eslint').RuleTester;
const semver = require('semver');
const eslintPkg = require('eslint/package.json');

const eslintMajor = semver.major(eslintPkg.version);

// `item` can be a config passed to the constructor, or a test case object/string
function convertToFlat(item, plugins) {
  if (typeof item === 'string') {
    return item;
  }

  if (typeof item !== 'object' || item === null) {
    throw new TypeError('Invalid value for "item" option. Expected an object or a string.');
  }

  const newItem = Object.assign({}, item, { languageOptions: {} });

  if (newItem.parserOptions) {
    newItem.languageOptions.parserOptions = newItem.parserOptions;

    if (newItem.parserOptions.ecmaVersion) {
      newItem.languageOptions.ecmaVersion = newItem.parserOptions.ecmaVersion;
    }

    if (newItem.parserOptions.sourceType) {
      newItem.languageOptions.sourceType = newItem.parserOptions.sourceType;
    }

    delete newItem.parserOptions;
  }

  if (newItem.parser) {
    newItem.languageOptions.parser = require(newItem.parser); // eslint-disable-line global-require, import/no-dynamic-require
    delete newItem.parser;
  }

  if (newItem.globals) {
    newItem.languageOptions.globals = newItem.globals;
    delete newItem.globals;
  }

  if (plugins) {
    newItem.plugins = plugins;
  }

  return newItem;
}

function convertInvalidTest(item, plugins) {
  const newItem = convertToFlat(item, plugins);

  if (eslintMajor >= 10 && Array.isArray(newItem.errors)) {
    newItem.errors = newItem.errors.map((error) => {
      if (!error || typeof error !== 'object' || !Object.prototype.hasOwnProperty.call(error, 'type')) {
        return error;
      }

      const newError = Object.assign({}, error);
      delete newError.type;
      return newError;
    });
  }

  return newItem;
}

function convertValidTest(item, plugins) {
  const newItem = convertToFlat(item, plugins);

  if (eslintMajor >= 10 && newItem && typeof newItem === 'object') {
    delete newItem.errors;
    delete newItem.output;
  }

  return newItem;
}

let RuleTester = ESLintRuleTester;

if (eslintMajor >= 9) {
  const PLUGINS = Symbol('eslint-plugin-react plugins');
  const RULE_DEFINER = Symbol.for('react.RuleTester.RuleDefiner');

  RuleTester = class extends ESLintRuleTester {
    constructor(config) {
      if ((typeof config !== 'object' && typeof config !== 'undefined') || config === null) {
        throw new TypeError('Invalid value for "config" option. Expected an object or undefined.');
      }

      const newConfig = convertToFlat(config || {});

      if (!newConfig.languageOptions.ecmaVersion) {
        newConfig.languageOptions.ecmaVersion = 5; // old default
      }

      if (!newConfig.languageOptions.sourceType) {
        newConfig.languageOptions.sourceType = 'script'; // old default
      }

      super(newConfig);

      this[RULE_DEFINER] = {
        defineRule: (ruleId, rule) => {
          if (!this[PLUGINS]) {
            this[PLUGINS] = {};
          }

          const ruleIdSplit = ruleId.split('/');

          if (ruleIdSplit.length !== 2) {
            throw new Error('ruleId should be in the format: plugin-name/rule-name');
          }

          const pluginName = ruleIdSplit[0];
          const ruleName = ruleIdSplit[1];

          if (!this[PLUGINS][pluginName]) {
            this[PLUGINS][pluginName] = { rules: {} };
          }

          this[PLUGINS][pluginName].rules[ruleName] = rule;
        },
      };
    }

    run(ruleName, rule, tests) {
      const newTests = {
        valid: tests.valid.map((test) => convertValidTest(test, this[PLUGINS])),
        invalid: tests.invalid.map((test) => convertInvalidTest(test, this[PLUGINS])),
      };

      super.run(ruleName, rule, newTests);
    }
  };
}

module.exports = RuleTester;
