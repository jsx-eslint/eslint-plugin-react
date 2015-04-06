/**
 * @fileoverview Enforce boolean attributes notation in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/jsx-boolean-value', {
    valid: [
        {code: '<App foo />;', args: [1, 'never'], ecmaFeatures: {jsx: true}},
        {code: '<App foo={true} />;', args: [1, 'always'], ecmaFeatures: {jsx: true}}
    ],
    invalid: [
        {code: '<App foo={true} />;', args: [1, 'never'],
         errors: [{message: 'Value must be omitted for boolean attributes'}], ecmaFeatures: {jsx: true}},
        {code: '<App foo />;', args: [1, 'always'],
         errors: [{message: 'Value must be set for boolean attributes'}], ecmaFeatures: {jsx: true}}
    ]
});
