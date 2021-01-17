/**
 * @fileoverview Disallow unused React elements
 * @author Duncan Beevers
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unused-elements');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
});

const tests = {
  valid: [
    {
      code: 'const partial = <div />'
    },
    {
      code: 'const partial = React.createElement(\'div\', {}, \'\')'
    },
    {
      code: '() => <div />'
    },
    {
      code: '() => condition ? <div /> : <span />'
    },
    {
      code: 'function MyComponent() { return condition ? <div /> : <span /> }'
    }
  ],
  invalid: [
    {
      code: '<div />',
      errors: [{
        message: 'Unused React element'
      }]
    },
    {
      code: 'React.createElement(\'div\', {}, \'\')',
      errors: [{
        message: 'Unused React element'
      }]
    },
    {
      code: 'condition ? <div /> : <span />',
      errors: [{
        message: 'Unused React element',
        line: 1,
        column: 13
      },
      {
        message: 'Unused React element',
        line: 1,
        column: 23
      }]
    },
    {
      code: 'condition ? React.createElement(\'div\', {}, \'\') : React.createElement(\'span\', {}, \'\')',
      errors: [{
        message: 'Unused React element',
        line: 1,
        column: 13
      },
      {
        message: 'Unused React element',
        line: 1,
        column: 50
      }]
    },
    {
      code: 'if (condition) { <div /> }',
      errors: [{
        message: 'Unused React element'
      }]
    }
  ]
};

ruleTester.run('no-unused-elements', rule, tests);
