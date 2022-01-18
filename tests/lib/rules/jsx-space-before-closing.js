/**
 * @fileoverview Validate spacing before closing bracket in JSX.
 * @author ryym
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-space-before-closing');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-space-before-closing', rule, {
  valid: parsers.all([
    {
      code: '<App />',
    },
    {
      code: '<App foo />',
    },
    {
      code: '<App foo={bar} />',
    },
    {
      code: '<App {...props} />',
    },
    {
      code: '<App></App>',
    },
    {
      code: `
        <App
          foo={bar}
        />
      `,
    },
    {
      code: '<App/>',
      options: ['never'],
    },
    {
      code: '<App foo/>',
      options: ['never'],
    },
    {
      code: '<App foo={bar}/>',
      options: ['never'],
    },
    {
      code: '<App {...props}/>',
      options: ['never'],
    },
    {
      code: '<App></App>',
      options: ['never'],
    },
    {
      code: `
        <App
          foo={bar}
        />
      `,
      options: ['never'],
    },
  ]),

  invalid: parsers.all([
    {
      code: '<App/>',
      output: '<App />',
      errors: [{ messageId: 'needSpaceBeforeClose' }],
    },
    {
      code: '<App foo/>',
      output: '<App foo />',
      errors: [{ messageId: 'needSpaceBeforeClose' }],
    },
    {
      code: '<App foo={bar}/>',
      output: '<App foo={bar} />',
      errors: [{ messageId: 'needSpaceBeforeClose' }],
    },
    {
      code: '<App {...props}/>',
      output: '<App {...props} />',
      errors: [{ messageId: 'needSpaceBeforeClose' }],
    },
    {
      code: '<App />',
      output: '<App/>',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBeforeClose' }],
    },
    {
      code: '<App foo />',
      output: '<App foo/>',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBeforeClose' }],
    },
    {
      code: '<App foo={bar} />',
      output: '<App foo={bar}/>',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBeforeClose' }],
    },
    {
      code: '<App {...props} />',
      output: '<App {...props}/>',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBeforeClose' }],
    },
  ]),
});
