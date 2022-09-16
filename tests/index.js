/* eslint-env mocha */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const arrayIncludes = require('array-includes');

const plugin = require('..');

const ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map((f) => path.basename(f, '.js'));

describe('all rule files should be exported by the plugin', () => {
  ruleFiles.forEach((ruleName) => {
    it(`should export ${ruleName}`, () => {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName)) // eslint-disable-line global-require, import/no-dynamic-require
      );
    });
  });
});

describe('rule documentation files have the correct content', () => {
  const MESSAGES = {
    configs: '💼 This rule is enabled in the following [configs](https://github.com/jsx-eslint/eslint-plugin-react#shareable-configurations):',
    configsOff: 'This rule is disabled in the following configs:',
    deprecated: '❌ This rule is deprecated.',
    fixable: '🔧 This rule is automatically fixable using the `--fix` [flag](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) on the command line.',
    hasSuggestions: '💡 This rule provides editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).',
  };

  function getConfigsForRule(ruleName, checkForEnabled) {
    const configNames = [];
    Object.keys(plugin.configs).forEach((configName) => {
      const value = plugin.configs[configName].rules[`react/${ruleName}`];
      const isOn = arrayIncludes([2, 'error'], value);
      const isOff = arrayIncludes([0, 'off'], value);
      if (value !== undefined && ((checkForEnabled && isOn) || (!checkForEnabled && isOff))) {
        configNames.push(configName);
      }
    });
    return configNames.sort();
  }

  function configNamesToList(configNames) {
    return `\`${configNames.join('`, `')}\``;
  }

  ruleFiles.forEach((ruleName) => {
    it(ruleName, () => {
      const rule = plugin.rules[ruleName];
      const documentPath = path.join('docs', 'rules', `${ruleName}.md`);
      const documentContents = fs.readFileSync(documentPath, 'utf8');
      const documentLines = documentContents.split('\n');

      // Check title.
      const expectedTitle = `# ${rule.meta.docs.description} (react/${ruleName})`;
      assert.strictEqual(documentLines[0], expectedTitle, 'includes the rule description and name in title');

      // Decide which notices should be shown at the top of the doc.
      const expectedNotices = [];
      const unexpectedNotices = [];
      if (rule.meta.deprecated) {
        expectedNotices.push('deprecated');
        unexpectedNotices.push('configs');
      } else {
        unexpectedNotices.push('deprecated');
        expectedNotices.push('configs');
      }
      if (rule.meta.fixable) {
        expectedNotices.push('fixable');
      } else {
        unexpectedNotices.push('fixable');
      }
      if (rule.meta.hasSuggestions) {
        expectedNotices.push('hasSuggestions');
      } else {
        unexpectedNotices.push('hasSuggestions');
      }

      // Ensure that expected notices are present in the correct order.
      let currentLineNumber = 1;
      expectedNotices.forEach((expectedNotice) => {
        assert.strictEqual(documentLines[currentLineNumber], '', `includes blank line ahead of ${expectedNotice} notice`);
        if (expectedNotice === 'deprecated' && documentLines[currentLineNumber + 1] !== MESSAGES[expectedNotice] && documentLines[currentLineNumber + 1].startsWith(MESSAGES[expectedNotice])) {
          // Allow additional rule-specific information at the end of the deprecation notice line.
          assert.ok(true, `includes ${expectedNotice} notice`);
        } else if (expectedNotice === 'configs') {
          // Check that the rule specifies its configs.
          const configsOn = getConfigsForRule(ruleName, true);
          let expectedMessage = `${MESSAGES.configs} ${configNamesToList(configsOn)}.`;
          const configsOff = getConfigsForRule(ruleName, false);
          if (configsOff.length > 0) {
            expectedMessage += ` ${MESSAGES.configsOff} ${configNamesToList(configsOff)}.`;
          }
          assert.strictEqual(documentLines[currentLineNumber + 1], expectedMessage, 'includes configs notice');
        } else {
          // Otherwise, just check the whole line.
          assert.strictEqual(documentLines[currentLineNumber + 1], MESSAGES[expectedNotice], `includes ${expectedNotice} notice`);
        }
        currentLineNumber += 2;
      });

      // Ensure that unexpected notices are not present.
      unexpectedNotices.forEach((unexpectedNotice) => {
        assert.ok(!documentContents.includes(MESSAGES[unexpectedNotice]), `does not include unexpected ${unexpectedNotice} notice`);
      });

      // Check for Rule Details section.
      assert.ok(documentContents.includes('## Rule Details'), 'should have a "## Rule Details" section');

      // Check if the rule has configuration options.
      if (
        (Array.isArray(rule.meta.schema) && rule.meta.schema.length > 0)
        || (typeof rule.meta.schema === 'object' && Object.keys(rule.meta.schema).length > 0)
      ) {
        // Should have an options section header:
        assert.ok(documentContents.includes('## Rule Options'), 'should have a "## Rule Options" section');
      } else {
        // Should NOT have any options section header:
        assert.ok(!documentContents.includes('## Rule Options'), 'should not have a "## Rule Options" section');
      }
    });
  });
});

describe('deprecated rules', () => {
  it('marks all deprecated rules as deprecated', () => {
    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const isDeprecated = plugin.rules[ruleName].meta.deprecated;
      if (inDeprecatedRules) {
        assert(isDeprecated, `${ruleName} metadata should mark it as deprecated`);
      } else {
        assert(!isDeprecated, `${ruleName} metadata should not mark it as deprecated`);
      }
    });
  });
});

describe('configurations', () => {
  it('should export a ‘recommended’ configuration', () => {
    const configName = 'recommended';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      const subRuleName = ruleName.slice('react/'.length);
      assert(plugin.rules[subRuleName]);
    });

    ruleFiles.forEach((ruleName) => {
      const inRecommendedConfig = !!plugin.configs[configName].rules[`react/${ruleName}`];
      const isRecommended = plugin.rules[ruleName].meta.docs[configName];
      if (inRecommendedConfig) {
        assert(isRecommended, `${ruleName} metadata should mark it as recommended`);
      } else {
        assert(!isRecommended, `${ruleName} metadata should not mark it as recommended`);
      }
    });
  });

  it('should export an ‘all’ configuration', () => {
    const configName = 'all';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      assert.equal(plugin.configs[configName].rules[ruleName], 2);
    });

    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inConfig = typeof plugin.configs[configName].rules[`react/${ruleName}`] !== 'undefined';
      assert(inDeprecatedRules ^ inConfig); // eslint-disable-line no-bitwise
    });
  });

  it('should export a \'jsx-runtime\' configuration', () => {
    const configName = 'jsx-runtime';
    assert(plugin.configs[configName]);

    Object.keys(plugin.configs[configName].rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      assert.equal(plugin.configs[configName].rules[ruleName], 0);

      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inConfig = typeof plugin.configs[configName].rules[ruleName] !== 'undefined';
      assert(inDeprecatedRules ^ inConfig); // eslint-disable-line no-bitwise
    });
  });
});
