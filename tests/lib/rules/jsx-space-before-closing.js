/**
 * @fileoverview Enforce a space before closing bracket of self-closing JSX elements.
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
  }],

  invalid: [{
    code: '<App/>',
    output: '<App />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'/>\''}
    ]
  }, {
    code: '<App foo/>',
    output: '<App foo />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'/>\''}
    ]
  }, {
    code: '<App foo={bar}/>',
    output: '<App foo={bar} />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'/>\''}
    ]
  }, {
    code: '<App {...props}/>',
    output: '<App {...props} />',
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'/>\''}
    ]
  }]
});

