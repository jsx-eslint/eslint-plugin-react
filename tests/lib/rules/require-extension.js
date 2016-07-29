/**
 * @fileoverview Restrict file extensions that may be required
 * @author Scott Andrews
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/require-extension');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

var REQUIRE_PACKAGE = 'require(\'eslint\')';

var REQUIRE_PACKAGE_JS = 'require(\'headroom.js\')';

var REQUIRE_JS = 'require(\'./index.js\')';

var REQUIRE_JSX = 'require(\'./index.jsx\')';

var REQUIRE_JSON = 'require(\'./index.json\')';

var REQUIRE_EMPTY = 'require()';

var REQUIRE_OBJECT = 'require({})';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('require-extension', rule, {

  valid: [
    {
      code: REQUIRE_PACKAGE
    }, {
      code: REQUIRE_JS
    }, {
      code: REQUIRE_JSON
    }, {
      code: REQUIRE_EMPTY
    }, {
      code: REQUIRE_OBJECT
    }, {
      code: REQUIRE_PACKAGE,
      args: [1]
    }, {
      code: REQUIRE_JS,
      args: [1]
    }, {
      code: REQUIRE_JSON,
      args: [1]
    }, {
      code: REQUIRE_EMPTY,
      args: [1]
    }, {
      code: REQUIRE_OBJECT,
      args: [1]
    }, {
      code: REQUIRE_JSON,
      options: [{extensions: ['.js']}]
    }, {
      code: REQUIRE_JSX,
      options: [{extensions: ['.js']}]
    }, {
      code: REQUIRE_PACKAGE_JS,
      options: [{extensions: ['.js']}]
    }
  ],

  invalid: [
    {
      code: REQUIRE_JSX,
      errors: [{message: 'Unable to require module with extension \'.jsx\''}]
    }, {
      code: REQUIRE_JSX,
      args: [1],
      errors: [{message: 'Unable to require module with extension \'.jsx\''}]
    }, {
      code: REQUIRE_JS,
      options: [{extensions: ['.js']}],
      errors: [{message: 'Unable to require module with extension \'.js\''}]
    }, {
      code: REQUIRE_JS,
      options: [{extensions: ['.js', '.jsx']}],
      errors: [{message: 'Unable to require module with extension \'.js\''}]
    }, {
      code: REQUIRE_JSX,
      options: [{extensions: ['.js', '.jsx']}],
      errors: [{message: 'Unable to require module with extension \'.jsx\''}]
    }
  ]

});
