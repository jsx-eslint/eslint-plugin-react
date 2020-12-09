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
      code: '() => <div />'
    },
    {
      code: 'const partial = React.createElement(\'div\', {}, \'\')'
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
      code: 'if (condition) { <div /> }',
      errors: [{
        message: 'Unused React element'
      }]
    }
  ]
};

ruleTester.run('no-unused-elements', rule, tests);
