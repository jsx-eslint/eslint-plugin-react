/**
 * @fileoverview Disallow multiple spaces between inline JSX props
 * @author Adrian Moennich
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-props-no-multi-spaces');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-props-no-multi-spaces', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n')
  }, {
    code: [
      '<App foo />'
    ].join('\n')
  }, {
    code: [
      '<App foo bar />'
    ].join('\n')
  }, {
    code: [
      '<App foo="with  spaces   " bar />'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo bar />'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo',
      '  bar />'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo {...test}',
      '  bar />'
    ].join('\n')
  }],

  invalid: [{
    code: [
      '<App  foo />'
    ].join('\n'),
    output: [
      '<App foo />'
    ].join('\n'),
    errors: [{message: 'Expected only one space between "App" and "foo"'}]
  }, {
    code: [
      '<App foo="with  spaces   "   bar />'
    ].join('\n'),
    output: [
      '<App foo="with  spaces   " bar />'
    ].join('\n'),
    errors: [{message: 'Expected only one space between "foo" and "bar"'}]
  }, {
    code: [
      '<App foo  bar />'
    ].join('\n'),
    output: [
      '<App foo bar />'
    ].join('\n'),
    errors: [{message: 'Expected only one space between "foo" and "bar"'}]
  }, {
    code: [
      '<App  foo   bar />'
    ].join('\n'),
    output: [
      '<App foo bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected only one space between "App" and "foo"'},
      {message: 'Expected only one space between "foo" and "bar"'}
    ]
  }, {
    code: [
      '<App foo  {...test}  bar />'
    ].join('\n'),
    output: [
      '<App foo {...test} bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected only one space between "foo" and "test"'},
      {message: 'Expected only one space between "test" and "bar"'}
    ]
  }]
});
