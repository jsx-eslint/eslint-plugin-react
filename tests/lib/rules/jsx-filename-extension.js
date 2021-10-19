/**
 * @fileoverview Restrict file extensions that may contain JSX
 * @author Joe Lencioni
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-filename-extension');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

const withJSXElement = 'module.exports = function MyComponent() { return <div>\n<div />\n</div>; }';
const withJSXFragment = 'module.exports = function MyComponent() { return <>\n</>; }';
const withoutJSX = 'module.exports = {}';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-filename-extension', rule, {
  valid: parsers.all([
    {
      filename: '<text>',
      code: withJSXElement,
    },
    {
      filename: 'MyComponent.jsx',
      code: withJSXElement,
    },
    {
      filename: 'MyComponent.js',
      code: withoutJSX,
      options: [{ allow: 'as-needed' }],
    },
    {
      filename: 'MyComponent.jsx',
      code: withJSXElement,
      options: [{ allow: 'as-needed' }],
    },
    {
      filename: 'MyComponent.js',
      options: [{ extensions: ['.js', '.jsx'] }],
      code: withJSXElement,
    },
    {
      filename: 'notAComponent.js',
      code: withoutJSX,
    },
    {
      filename: '<text>',
      code: withJSXFragment,
      features: ['fragment'],
    },
    {
      filename: 'MyComponent.jsx',
      code: withJSXFragment,
      features: ['fragment'],
    },
    {
      filename: 'MyComponent.js',
      options: [{ extensions: ['.js', '.jsx'] }],
      code: withJSXFragment,
      features: ['fragment'],
    },
  ]),

  invalid: parsers.all([
    {
      filename: 'MyComponent.js',
      code: withJSXElement,
      errors: [
        {
          messageId: 'noJSXWithExtension',
          data: { ext: '.js' },
        },
      ],
    },
    {
      filename: 'MyComponent.jsx',
      code: withoutJSX,
      options: [{ allow: 'as-needed' }],
      errors: [
        {
          messageId: 'extensionOnlyForJSX',
          data: { ext: '.jsx' },
        },
      ],
    },
    {
      filename: 'notAComponent.js',
      code: withJSXElement,
      options: [{ allow: 'as-needed' }],
      errors: [
        {
          messageId: 'noJSXWithExtension',
          data: { ext: '.js' },
        },
      ],
    },
    {
      filename: 'MyComponent.jsx',
      code: withJSXElement,
      options: [{ extensions: ['.js'] }],
      errors: [
        {
          messageId: 'noJSXWithExtension',
          data: { ext: '.jsx' },
        },
      ],
    },
    {
      filename: 'MyComponent.js',
      code: withJSXFragment,
      features: ['fragment'],
      errors: [
        {
          messageId: 'noJSXWithExtension',
          data: { ext: '.js' },
        },
      ],
    },
    {
      filename: 'MyComponent.jsx',
      code: withJSXFragment,
      features: ['fragment'],
      options: [{ extensions: ['.js'] }],
      errors: [
        {
          messageId: 'noJSXWithExtension',
          data: { ext: '.jsx' },
        },
      ],
    },
  ]),
});
