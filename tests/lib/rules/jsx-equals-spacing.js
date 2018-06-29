/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-equals-spacing');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-equals-spacing', rule, {
  valid: [{
    code: '<App />'
  }, {
    code: '<App foo />'
  }, {
    code: '<App foo="bar" />'
  }, {
    code: '<App foo={e => bar(e)} />'
  }, {
    code: '<App {...props} />'
  }, {
    code: '<App />',
    options: ['never']
  }, {
    code: '<App foo />',
    options: ['never']
  }, {
    code: '<App foo="bar" />',
    options: ['never']
  }, {
    code: '<App foo={e => bar(e)} />',
    options: ['never']
  }, {
    code: '<App {...props} />',
    options: ['never']
  }, {
    code: '<App />',
    options: ['always']
  }, {
    code: '<App foo />',
    options: ['always']
  }, {
    code: '<App foo = "bar" />',
    options: ['always']
  }, {
    code: '<App foo = {e => bar(e)} />',
    options: ['always']
  }, {
    code: '<App {...props} />',
    options: ['always']
  }],

  invalid: [{
    code: '<App foo = {bar} />',
    output: '<App foo={bar} />',
    errors: [
      {message: 'There should be no space before \'=\''},
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo = {bar} />',
    output: '<App foo={bar} />',
    options: ['never'],
    errors: [
      {message: 'There should be no space before \'=\''},
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo ={bar} />',
    output: '<App foo={bar} />',
    options: ['never'],
    errors: [
      {message: 'There should be no space before \'=\''}
    ]
  }, {
    code: '<App foo= {bar} />',
    output: '<App foo={bar} />',
    options: ['never'],
    errors: [
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo= {bar} bar = {baz} />',
    output: '<App foo={bar} bar={baz} />',
    options: ['never'],
    errors: [
      {message: 'There should be no space after \'=\''},
      {message: 'There should be no space before \'=\''},
      {message: 'There should be no space after \'=\''}
    ]
  }, {
    code: '<App foo={bar} />',
    output: '<App foo = {bar} />',
    options: ['always'],
    errors: [
      {message: 'A space is required before \'=\''},
      {message: 'A space is required after \'=\''}
    ]
  }, {
    code: '<App foo ={bar} />',
    output: '<App foo = {bar} />',
    options: ['always'],
    errors: [
      {message: 'A space is required after \'=\''}
    ]
  }, {
    code: '<App foo= {bar} />',
    output: '<App foo = {bar} />',
    options: ['always'],
    errors: [
      {message: 'A space is required before \'=\''}
    ]
  }, {
    code: '<App foo={bar} bar ={baz} />',
    output: '<App foo = {bar} bar = {baz} />',
    options: ['always'],
    errors: [
      {message: 'A space is required before \'=\''},
      {message: 'A space is required after \'=\''},
      {message: 'A space is required after \'=\''}
    ]
  }]
});
