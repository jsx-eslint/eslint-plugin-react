/**
 * @fileoverview Restrict file extensions that may contain JSX
 * @author Joe Lencioni
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-filename-extension');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

var withJSX = 'module.exports = function MyComponent() { return <div />; }';
var withoutJSX = 'module.exports = {}';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-filename-extension', rule, {

  valid: [
    {
      filename: 'MyComponent.jsx',
      code: withJSX,
      parserOptions: parserOptions
    }, {
      filename: 'MyComponent.js',
      options: [{extensions: ['.js', '.jsx']}],
      code: withJSX,
      parserOptions: parserOptions
    }, {
      filename: 'notAComponent.js',
      code: withoutJSX
    }
  ],

  invalid: [
    {
      filename: 'MyComponent.js',
      code: withJSX,
      parserOptions: parserOptions,
      errors: [{message: 'JSX not allowed in files with extension \'.js\''}]
    }, {
      filename: 'MyComponent.jsx',
      code: withJSX,
      parserOptions: parserOptions,
      options: [{extensions: ['.js']}],
      errors: [{message: 'JSX not allowed in files with extension \'.jsx\''}]
    }
  ]

});
