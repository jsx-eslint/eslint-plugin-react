/**
 * @fileoverview have all the JSX props aligned with the first one
 * @author Quentin Cuvillier
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-align-first-prop');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-align-first-prop', rule, {
  valid: [{
    code: '<App foo />',
    parserOptions: parserOptions
  }, {
    code: '<App foo bar />',
    parserOptions: parserOptions
  }, {
    code: '<App {...this.props} bar />',
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo',
      '  bar',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '    foo',
      '  bar',
      'biz',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo bar',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={',
      '   "this is a a string"',
      '  }',
      '  biz',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      '<App foo',
      '  bar',
      '/>'
    ].join('\n'),
    errors: [{message: 'unaligned prop'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    errors: [{message: 'unaligned prop'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo',
      '  baz {...this.props}',
      '/>'
    ].join('\n'),
    errors: [{message: 'unaligned prop'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      '   "this is a a string"',
      '  }',
      '  biz',
      '/>'
    ].join('\n'),
    errors: [{message: 'unaligned prop'}],
    parserOptions: parserOptions
  }]
});
