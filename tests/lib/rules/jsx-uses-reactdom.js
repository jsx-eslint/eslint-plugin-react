/**
 * @fileoverview Tests for jsx-uses-reactdom
 * @author Don Abrams
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslint.defineRule('jsx-uses-reactdom', require('../../../lib/rules/jsx-uses-reactdom'));
eslintTester.addRuleTest('node_modules/eslint/lib/rules/no-unused-vars', {
  valid: [
    {code: '/*eslint jsx-uses-reactdom:1*/ var ReactDOM; <div />;', ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-reactdom:1*/ var ReactDOM; (function () { <div /> })();', ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-reactdom:1*/ /** @jsx Foo */ var Foo; <div />;', ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-reactdom:[1,{"pragma":"Foo"}]*/ var Foo; <div />;', ecmaFeatures: {jsx: true}}
  ],
  invalid: [
    {code: '/*eslint jsx-uses-reactdom:1*/ var ReactDOM;',
     errors: [{message: 'ReactDOM is defined but never used'}], ecmaFeatures: {jsx: true}},
    {code: '/*eslint jsx-uses-reactdom:1*/ /** @jsx Foo */ var ReactDOM; <div />;',
     errors: [{message: 'ReactDOM is defined but never used'}], ecmaFeatures: {jsx: true}}
  ]
});
