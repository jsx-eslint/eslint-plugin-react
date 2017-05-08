/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var rule = require('eslint/lib/rules/no-unused-vars');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var settings = {
  react: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
eslint.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-react:1*/ var React; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();'},
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;', settings: settings}
  ],
  invalid: [{
    code: '/*eslint jsx-uses-react:1*/ var React;',
    errors: [{message: '\'React\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
    errors: [{message: '\'React\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <div />;',
    errors: [{message: '\'React\' is defined but never used.'}], settings: settings
  }]
});
