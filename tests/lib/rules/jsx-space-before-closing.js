/**
 * @fileoverview Validate spacing before closing bracket in JSX.
 * @author ryym
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-space-before-closing');
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
ruleTester.run('jsx-space-before-closing', rule, {
  valid: [{
    code: '<App />'
  }, {
    code: '<App foo />'
  }, {
    code: '<App foo={bar} />'
  }, {
    code: '<App {...props} />'
  }, {
    code: '<App></App>'
  }, {
    code: `
      <App
        foo={bar}
      />
    `
  }, {
    code: '<App/>',
    options: ['never']
  }, {
    code: '<App foo/>',
    options: ['never']
  }, {
    code: '<App foo={bar}/>',
    options: ['never']
  }, {
    code: '<App {...props}/>',
    options: ['never']
  }, {
    code: '<App></App>',
    options: ['never']
  }, {
    code: `
      <App
        foo={bar}
      />
    `,
    options: ['never']
  }],

  invalid: [{
    code: '<App/>',
    output: '<App />',
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App foo/>',
    output: '<App foo />',
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App foo={bar}/>',
    output: '<App foo={bar} />',
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App {...props}/>',
    output: '<App {...props} />',
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App />',
    output: '<App/>',
    options: ['never'],
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App foo />',
    output: '<App foo/>',
    options: ['never'],
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App foo={bar} />',
    output: '<App foo={bar}/>',
    options: ['never'],
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App {...props} />',
    output: '<App {...props}/>',
    options: ['never'],
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }]
});
