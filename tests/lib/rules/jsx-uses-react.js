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
var dot = require('../../eslint-compat').dot;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
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

var ruleTester = new RuleTester();
eslint.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-react:1*/ var React; <div />;', parserOptions: parserOptions},
    {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();', parserOptions: parserOptions},
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;', parserOptions: parserOptions},
    {code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;', settings: settings, parserOptions: parserOptions}
  ],
  invalid: [{
    code: '/*eslint jsx-uses-react:1*/ var React;',
    errors: [{message: dot('\'React\' is defined but never used')}], parserOptions: parserOptions
  }, {
    code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
    errors: [{message: dot('\'React\' is defined but never used')}], parserOptions: parserOptions
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <div />;',
    errors: [{message: dot('\'React\' is defined but never used')}], settings: settings, parserOptions: parserOptions
  }]
});
