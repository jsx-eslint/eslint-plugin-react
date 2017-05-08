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
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

var withJSX = 'module.exports = function MyComponent() { return <div>\n<div />\n</div>; }';
var withoutJSX = 'module.exports = {}';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
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
