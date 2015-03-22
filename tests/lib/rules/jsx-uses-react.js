/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
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
eslint.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));
eslintTester.addRuleTest('node_modules/eslint/lib/rules/no-unused-vars', {
    valid: [
        {code: '/*eslint jsx-uses-react:1*/ var React; <div />;', ecmaFeatures: {jsx: true}},
        {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();', ecmaFeatures: {jsx: true}},
        {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;', ecmaFeatures: {jsx: true}}
    ],
    invalid: [
        {code: '/*eslint jsx-uses-react:1*/ var React;',
         errors: [{message: 'React is defined but never used'}], ecmaFeatures: {jsx: true}},
        {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
         errors: [{message: 'React is defined but never used'}], ecmaFeatures: {jsx: true}}
    ]
});
