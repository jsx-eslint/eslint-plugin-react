/* eslint-env mocha */
'use strict';

var plugin = require('..');

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var ruleFiles = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map(function(f) {
    return path.basename(f, '.js');
  });

describe('all rule files should be exported by the plugin', function() {
  ruleFiles.forEach(function(ruleName) {
    it('should export ' + ruleName, function() {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName))
      );
    });
  });
});

describe('configurations', function() {
  it('should export a \'recommended\' configuration', function() {
    assert(plugin.configs.recommended);
    Object.keys(plugin.configs.recommended.rules).forEach(function (configName) {
      assert.equal(configName.indexOf('react/'), 0);
      var ruleName = configName.substring('react/'.length);
      assert(plugin.rules[ruleName]);
    });
  });
  it('should export a \'all\' configuration', function() {
    assert(plugin.configs.all);
    Object.keys(plugin.configs.all.rules).forEach(function(configName) {
      assert.equal(configName.indexOf('react/'), 0);
      assert.equal(plugin.configs.all.rules[configName], 2);
    });
    ruleFiles.forEach(function(ruleName) {
      var inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      var inAllConfig = Boolean(plugin.configs.all.rules['react/' + ruleName]);
      assert(inDeprecatedRules ^ inAllConfig);
    });
  });
});
