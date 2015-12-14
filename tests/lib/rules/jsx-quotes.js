/**
 * @fileoverview Tests for jsx-quotes
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-quotes');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-quotes', rule, {
  valid: [
    {code: '<App foo=\'bar\' />;', options: ['single'], parserOptions: parserOptions},
    {code: '<App foo="bar" />;', options: ['double'], parserOptions: parserOptions},
    {code: '<App foo="ba\'r" />;', options: ['single', 'avoid-escape'], parserOptions: parserOptions},
    {code: '<App foo=\'ba"r\' />;', options: ['double', 'avoid-escape'], parserOptions: parserOptions},
    {code: '<App>foo</App>;', options: ['single'], parserOptions: parserOptions}
  ],
  invalid: [
    {code: '<App foo="bar" />;',
     errors: [{message: 'JSX attributes must use singlequote.'}], options: ['single'], parserOptions: parserOptions},
    {code: '<App foo=\'bar\' />;',
     errors: [{message: 'JSX attributes must use doublequote.'}], options: ['double'], parserOptions: parserOptions}
  ]
});
