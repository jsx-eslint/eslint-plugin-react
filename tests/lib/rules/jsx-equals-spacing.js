/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-equals-spacing');
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
ruleTester.run('jsx-equals-spacing', rule, {
  valid: [{
    code: '<App />',
    parserOptions: parserOptions
  }, {
    code: '<App foo />',
    parserOptions: parserOptions
  }, {
    code: '<App foo="bar" />',
    parserOptions: parserOptions
  }, {
    code: '<App foo={e => bar(e)} />',
    parserOptions: parserOptions
  }, {
    code: '<App {...props} />',
    parserOptions: parserOptions
  }, {
    code: '<App />',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo />',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo="bar" />',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={e => bar(e)} />',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App {...props} />',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App />',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App foo />',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App foo = "bar" />',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App foo = {e => bar(e)} />',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App {...props} />',
    options: ['always'],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: '<App foo = {bar} />',
    parserOptions: parserOptions,
    errors: [
      {message: 'There should be no space before \'=\''},
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo = {bar} />',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'There should be no space before \'=\''},
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo ={bar} />',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'There should be no space before \'=\''}
    ]
  }, {
    code: '<App foo= {bar} />',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo= {bar} bar = {baz} />',
    options: ['never'],
    parserOptions: parserOptions,
    errors: [
      {message: 'There should be no space after \'=\''},
      {message: 'There should be no space before \'=\''},
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo={bar} />',
    options: ['always'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'=\''},
      {message: 'A space is required after \'=\''}
    ]
  }, {
    code: '<App foo ={bar} />',
    options: ['always'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required after \'=\''}
    ]
  }, {
    code: '<App foo= {bar} />',
    options: ['always'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'=\''}
    ]
  }, {
    code: '<App foo={bar} bar ={baz} />',
    options: ['always'],
    parserOptions: parserOptions,
    errors: [
      {message: 'A space is required before \'=\''},
      {message: 'A space is required after \'=\''},
      {message: 'A space is required after \'=\''}
    ]
  }]
});
