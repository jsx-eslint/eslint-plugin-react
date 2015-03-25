/**
 * @fileoverview Tests for jsx-quotes
 * @author Yannick Croissant
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
eslintTester.addRuleTest('lib/rules/jsx-quotes', {
    valid: [
        {code: '<App foo=\'bar\' />;', args: [1, 'single'], ecmaFeatures: {jsx: true}},
        {code: '<App foo="bar" />;', args: [1, 'double'], ecmaFeatures: {jsx: true}},
        {code: '<App foo="ba\'r" />;', args: [1, 'single', 'avoid-escape'], ecmaFeatures: {jsx: true}},
        {code: '<App foo=\'ba"r\' />;', args: [1, 'double', 'avoid-escape'], ecmaFeatures: {jsx: true}},
        {code: '<App>foo</App>;', args: [1, 'single'], ecmaFeatures: {jsx: true}}
    ],
    invalid: [
        {code: '<App foo="bar" />;',
         errors: [{message: 'JSX attributes must use singlequote.'}], args: [1, 'single'], ecmaFeatures: {jsx: true}},
        {code: '<App foo=\'bar\' />;',
         errors: [{message: 'JSX attributes must use doublequote.'}], args: [1, 'double'], ecmaFeatures: {jsx: true}}
    ]
});
