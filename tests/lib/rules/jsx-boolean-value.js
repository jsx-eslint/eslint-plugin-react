/**
 * @fileoverview Enforce boolean attributes notation in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-boolean-value');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-boolean-value', rule, {
  valid: [
    {code: '<App foo />;', options: ['never'], ecmaFeatures: {jsx: true}},
    {code: '<App foo={true} />;', options: ['always'], ecmaFeatures: {jsx: true}}
  ],
  invalid: [
    {code: '<App foo={true} />;', options: ['never'],
     errors: [{message: 'Value must be omitted for boolean attributes'}], ecmaFeatures: {jsx: true}},
    {code: '<App foo />;', options: ['always'],
     errors: [{message: 'Value must be set for boolean attributes'}], ecmaFeatures: {jsx: true}}
  ]
});
