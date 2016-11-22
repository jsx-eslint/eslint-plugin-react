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
      assert.equal(configName.indexOf('react-filenames/'), 0);
      var ruleName = configName.substring('react-filenames/'.length);
      assert(plugin.rules[ruleName]);
    });

    ruleFiles.forEach(function(ruleName) {
      var inRecommendedConfig = Boolean(plugin.configs.recommended.rules['react-filenames/' + ruleName]);
      var isRecommended = plugin.rules[ruleName].meta.docs.recommended;
      if (inRecommendedConfig) {
        assert(isRecommended, ruleName + ' metadata should mark it as recommended');
      } else {
        assert(!isRecommended, ruleName + ' metadata should not mark it as recommended');
      }
    });
  });
});
