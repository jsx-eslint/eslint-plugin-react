/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Yannick Croissant
 * @author Erik Wendel
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-unnecessary-curly-brace');
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
ruleTester.run('jsx-curly-spacing', rule, {
  valid: [
    { code: "<App>foo</App>" },
    { code: "<App prop='bar'>foo</App>" },
    {
      code: "<MyComponent>{'foo'}</MyComponent>",
      options: [{ children: 'never' }]
    },
    {
      code: "<MyComponent prop={'bar'}>foo</MyComponent>",
      options: [{ props: 'never' }]
    },
    { code: "<App prop='bar'>{'foo \\n bar'}</App>" },
    { code: "<App prop={'foo \\u00b7 bar'}>foo</App>" }
  ],

  invalid: [
    {
      code: "<MyComponent>{'foo'}</MyComponent>",
      output: "<MyComponent>foo</MyComponent>",
      errors: [{ message: 'Curly braces are unnecessary here.' }]
    },
    {
      code: "<MyComponent prop={'bar'}>foo</MyComponent>",
      output: '<MyComponent prop="bar">foo</MyComponent>',
      errors: [{ message: 'Curly braces are unnecessary here.' }]
    },
  ]
})
