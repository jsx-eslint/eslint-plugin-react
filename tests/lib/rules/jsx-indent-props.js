/**
 * @fileoverview Validate props indentation in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-indent-props');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-indent-props', rule, {
  valid: [{
    code: [
      '<App foo',
      '/>'
    ].join('\n'),
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    options: [2],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      'foo',
      '/>'
    ].join('\n'),
    options: [0],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '  <App',
      'foo',
      '  />'
    ].join('\n'),
    options: [-2],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab'],
    ecmaFeatures: {jsx: true}
  }],

  invalid: [{
    code: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    ecmaFeatures: {jsx: true},
    errors: [{message: 'Expected indentation of 4 space characters but found 2.'}]
  }, {
    code: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    options: [2],
    ecmaFeatures: {jsx: true},
    errors: [{message: 'Expected indentation of 2 space characters but found 4.'}]
  }, {
    code: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    options: ['tab'],
    ecmaFeatures: {jsx: true},
    errors: [{message: 'Expected indentation of 1 tab character but found 0.'}]
  }]
});
