/**
 * @fileoverview Validate props indentation in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-indent-props');
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
ruleTester.run('jsx-indent-props', rule, {
  valid: [{
    code: [
      '<App foo',
      '/>'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '<App',
      'foo',
      '/>'
    ].join('\n'),
    options: [0]
  }, {
    code: [
      '  <App',
      'foo',
      '  />'
    ].join('\n'),
    options: [-2]
  }, {
    code: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab']
  }],

  invalid: [{
    code: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    errors: [{message: 'Expected indentation of 4 space characters but found 2.'}]
  }, {
    code: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    options: [2],
    errors: [{message: 'Expected indentation of 2 space characters but found 4.'}]
  }, {
    code: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab'],
    errors: [{message: 'Expected indentation of 1 tab character but found 0.'}]
  }, {
    code: [
      '<App',
      '\t\t\tfoo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab'],
    errors: [{message: 'Expected indentation of 1 tab character but found 3.'}]
  }]
});
