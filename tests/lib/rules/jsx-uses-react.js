/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('eslint/lib/rules/no-unused-vars');
const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-react:1*/ var React; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();'},
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;', settings: settings},
    {code: '/*eslint jsx-uses-react:1*/ var React; <></>;', parser: 'babel-eslint'}
  ],
  invalid: [{
    code: '/*eslint jsx-uses-react:1*/ var React;',
    errors: [{message: '\'React\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
    errors: [{message: '\'React\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <div />;',
    errors: [{message: '\'React\' is defined but never used.'}],
    settings: settings
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
    parser: 'babel-eslint',
    errors: [{message: '\'React\' is defined but never used.'}],
    settings: settings
  }]
});
