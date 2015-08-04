/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var rule = require('eslint/lib/rules/no-unused-vars');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
eslint.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-react:1*/ var React; <div />;', ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();', ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;', ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-react:[1,{"pragma":"Foo"}]*/ var Foo; <div />;', ecmaFeatures: {jsx: true}}
  ],
  invalid: [
    {code: '/*eslint jsx-uses-react:1*/ var React;',
     errors: [{message: 'React is defined but never used'}], ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
     errors: [{message: 'React is defined but never used'}], ecmaFeatures: {jsx: true}}
  ]
});
