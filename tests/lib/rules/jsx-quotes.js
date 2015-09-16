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

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-quotes', rule, {
  valid: [
    {code: '<App foo=\'bar\' />;', options: ['single'], ecmaFeatures: {jsx: true}},
    {code: '<App foo="bar" />;', options: ['double'], ecmaFeatures: {jsx: true}},
    {code: '<App foo="ba\'r" />;', options: ['single', 'avoid-escape'], ecmaFeatures: {jsx: true}},
    {code: '<App foo=\'ba"r\' />;', options: ['double', 'avoid-escape'], ecmaFeatures: {jsx: true}},
    {code: '<App>foo</App>;', options: ['single'], ecmaFeatures: {jsx: true}}
  ],
  invalid: [
    {code: '<App foo="bar" />;',
     errors: [{message: 'JSX attributes must use singlequote.'}], options: ['single'], ecmaFeatures: {jsx: true}},
    {code: '<App foo=\'bar\' />;',
     errors: [{message: 'JSX attributes must use doublequote.'}], options: ['double'], ecmaFeatures: {jsx: true}}
  ]
});
