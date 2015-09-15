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

var DEPRECATION_WARNING = 'The react/jsx-quotes rule is deprecated. Please use the jsx-quotes rule instead.';
var SINGLEQUOTE_WARNING = 'JSX attributes must use singlequote.';
var DOUBLEQUOTE_WARNING = 'JSX attributes must use doublequote.';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-quotes', rule, {
  valid: [
    // None, should always trigger at least the deprecation warning
  ],
  invalid: [
    {code: '<App />;',
     errors: [{message: DEPRECATION_WARNING}], ecmaFeatures: {jsx: true}},
    {code: '<App foo=\'bar\' />;',
     errors: [{message: DEPRECATION_WARNING}], options: ['single'], ecmaFeatures: {jsx: true}},
    {code: '<App foo="bar" />;',
     errors: [{message: DEPRECATION_WARNING}], options: ['double'], ecmaFeatures: {jsx: true}},
    {code: '<App foo="ba\'r" />;',
     errors: [{message: DEPRECATION_WARNING}], options: ['single', 'avoid-escape'], ecmaFeatures: {jsx: true}},
    {code: '<App foo=\'ba"r\' />;',
     errors: [{message: DEPRECATION_WARNING}], options: ['double', 'avoid-escape'], ecmaFeatures: {jsx: true}},
    {code: '<App>foo</App>;',
     errors: [{message: DEPRECATION_WARNING}], options: ['single'], ecmaFeatures: {jsx: true}},
    {code: '<App foo="bar" />;',
     errors: [
      {message: DEPRECATION_WARNING},
      {message: SINGLEQUOTE_WARNING}
     ], options: ['single'], ecmaFeatures: {jsx: true}},
    {code: '<App foo=\'bar\' />;',
     errors: [
      {message: DEPRECATION_WARNING},
      {message: DOUBLEQUOTE_WARNING}
     ], options: ['double'], ecmaFeatures: {jsx: true}}
  ]
});
