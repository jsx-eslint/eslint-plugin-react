/* eslint-env mocha */
'use strict';

var plugin = require('..');

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var rules = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map(function(f) {
    return path.basename(f, '.js');
  });

describe('all rule files should be exported by the plugin', function() {
  rules.forEach(function(ruleName) {
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
  });
});
