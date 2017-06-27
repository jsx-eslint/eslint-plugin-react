/* eslint-env mocha */
'use strict';

const plugin = require('..');

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map(function(f) {
    return path.basename(f, '.js');
  });

describe('all rule files should be exported by the plugin', function() {
  ruleFiles.forEach(function(ruleName) {
    it(`should export ${ruleName}`, function() {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName))
      );
    });
  });
});

describe('deprecated rules', function() {
  it('marks all deprecated rules as deprecated', function() {
    ruleFiles.forEach(function(ruleName) {
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

describe('configurations', function() {
  it('should export a \'recommended\' configuration', function() {
    assert(plugin.configs.recommended);
    Object.keys(plugin.configs.recommended.rules).forEach(function (configName) {
      assert.equal(configName.indexOf('react/'), 0);
      const ruleName = configName.substring('react/'.length);
      assert(plugin.rules[ruleName]);
    });

    ruleFiles.forEach(function(ruleName) {
      const inRecommendedConfig = Boolean(plugin.configs.recommended.rules[`react/${ruleName}`]);
      const isRecommended = plugin.rules[ruleName].meta.docs.recommended;
      if (inRecommendedConfig) {
        assert(isRecommended, `${ruleName} metadata should mark it as recommended`);
      } else {
        assert(!isRecommended, `${ruleName} metadata should not mark it as recommended`);
      }
    });
  });
  it('should export a \'all\' configuration', function() {
    assert(plugin.configs.all);
    Object.keys(plugin.configs.all.rules).forEach(function(configName) {
      assert.equal(configName.indexOf('react/'), 0);
      assert.equal(plugin.configs.all.rules[configName], 2);
    });
    ruleFiles.forEach(function(ruleName) {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inAllConfig = Boolean(plugin.configs.all.rules[`react/${ruleName}`]);
      assert(inDeprecatedRules ^ inAllConfig);
    });
  });
});
