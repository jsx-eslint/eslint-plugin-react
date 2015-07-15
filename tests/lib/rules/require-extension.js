/**
 * @fileoverview Restrict file extensions that may be required
 * @author Scott Andrews
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

var REQUIRE_PACKAGE = 'require(\'eslint\')';

var REQUIRE_JS = 'require(\'./index.js\')';

var REQUIRE_JSX = 'require(\'./index.jsx\')';

var REQUIRE_JSON = 'require(\'./index.json\')';

var REQUIRE_EMPTY = 'require()';

var REQUIRE_OBJECT = 'require({})';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/require-extension', {

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
      args: [1, {extensions: ['.js']}]
    }, {
      code: REQUIRE_JSX,
      args: [1, {extensions: ['.js']}]
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
      args: [1, {extensions: ['.js']}],
      errors: [{message: 'Unable to require module with extension \'.js\''}]
    }, {
      code: REQUIRE_JS,
      args: [1, {extensions: ['.js', '.jsx']}],
      errors: [{message: 'Unable to require module with extension \'.js\''}]
    }, {
      code: REQUIRE_JSX,
      args: [1, {extensions: ['.js', '.jsx']}],
      errors: [{message: 'Unable to require module with extension \'.jsx\''}]
    }
  ]

});
