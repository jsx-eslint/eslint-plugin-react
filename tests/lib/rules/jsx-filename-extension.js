/**
 * @fileoverview Restrict file extensions that may contain JSX
 * @author Joe Lencioni
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-filename-extension');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

const withJSX = 'module.exports = function MyComponent() { return <div>\n<div />\n</div>; }';
const withoutJSX = 'module.exports = {}';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-filename-extension', rule, {

  valid: [
    {
      filename: '<text>',
      code: withJSX
    },
    {
      filename: 'MyComponent.jsx',
      code: withJSX
    }, {
      filename: 'MyComponent.js',
      options: [{extensions: ['.js', '.jsx']}],
      code: withJSX
    }, {
      filename: 'notAComponent.js',
      code: withoutJSX
    }
  ],

  invalid: [
    {
      filename: 'MyComponent.js',
      code: withJSX,
      errors: [{message: 'JSX not allowed in files with extension \'.js\''}]
    }, {
      filename: 'MyComponent.jsx',
      code: withJSX,
      options: [{extensions: ['.js']}],
      errors: [{message: 'JSX not allowed in files with extension \'.jsx\''}]
    }
  ]

});
