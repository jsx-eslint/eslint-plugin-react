'use strict';

const ESLintRuleTester = require('eslint').RuleTester;
const semver = require('semver');
const eslintPkg = require('eslint/package.json');

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
    const parser = require(newItem.parser); // eslint-disable-line global-require, import/no-dynamic-require
    if (parser && parser.parseForESLint) {
      newItem.languageOptions.parser = {
        parseForESLint(code, options) {
          const result = parser.parseForESLint(code, options);
          if (result && result.scopeManager && typeof result.scopeManager.addGlobals !== 'function') {
            result.scopeManager.addGlobals = function addGlobals(globalNames) {
              const globalScope = this.scopes[0]; // eslint-disable-line no-invalid-this
              if (!globalScope || !globalScope.set) { return; }
              for (let i = 0; i < globalNames.length; i++) {
                if (!globalScope.set.has(globalNames[i])) {
                  globalScope.set.set(globalNames[i], {
                    name: globalNames[i],
                    identifiers: [],
                    references: [],
                    defs: [],
                    scope: globalScope,
                  });
                }
              }
            };
          }
          return result;
        },
        parse(code, options) {
          if (parser.parse) {
            return parser.parse(code, options);
          }
          return undefined; // satisfy consistent-return
        },
        meta: parser.meta,
      };
    } else {
      newItem.languageOptions.parser = parser;
    }
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

const eslintMajor = semver.major(eslintPkg.version);

function stripTypeOnEslint10(test) {
  if (eslintMajor < 10 || !test || typeof test !== 'object' || !Array.isArray(test.errors)) {
    return test;
  }
  return Object.assign({}, test, {
    errors: test.errors.map((err) => {
      if (!err || typeof err !== 'object' || !('type' in err)) {
        return err;
      }
      const next = Object.assign({}, err);
      delete next.type;
      return next;
    }),
  });
}

let RuleTester = ESLintRuleTester;

if (semver.major(eslintPkg.version) >= 9) {
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
        valid: tests.valid.map((test) => convertToFlat(test, this[PLUGINS])),
        invalid: tests.invalid
          .map(stripTypeOnEslint10)
          .map((test) => convertToFlat(test, this[PLUGINS])),
      };

      super.run(ruleName, rule, newTests);
    }
  };
}

module.exports = RuleTester;
