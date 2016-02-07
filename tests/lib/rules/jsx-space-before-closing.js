/**
 * @fileoverview Validate spacing before closing bracket in JSX.
 * @author ryym
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-space-before-closing');
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
ruleTester.run('jsx-space-before-closing', rule, {
  valid: [{
    code: '<App />',
    parserOptions: parserOptions
  }, {
    code: '<App foo />',
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} />',
    parserOptions: parserOptions
  }, {
    code: '<App {...props} />',
    parserOptions: parserOptions
  }, {
    code: '<App></App>',
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={bar}',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: '<App/>',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo/>',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar}/>',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App {...props}/>',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App></App>',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={bar}',
      '/>'
    ].join('\n'),
    options: ['never'],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: '<App/>',
    output: '<App />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App foo/>',
    output: '<App foo />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App foo={bar}/>',
    output: '<App foo={bar} />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App {...props}/>',
    output: '<App {...props} />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App />',
    output: '<App/>',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App foo />',
    output: '<App foo/>',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App foo={bar} />',
    output: '<App foo={bar}/>',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App {...props} />',
    output: '<App {...props}/>',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }]
});
