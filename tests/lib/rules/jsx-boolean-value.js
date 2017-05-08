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

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-boolean-value', rule, {
  valid: [
    {code: '<App foo />;', options: ['never']},
    {code: '<App foo />;'},
    {code: '<App foo={true} />;', options: ['always']}
  ],
  invalid: [{
    code: '<App foo={true} />;', output: '<App foo />;', options: ['never'],
    errors: [{message: 'Value must be omitted for boolean attributes'}]
  }, {
    code: '<App foo={true} />;', output: '<App foo />;',
    errors: [{message: 'Value must be omitted for boolean attributes'}]
  }, {
    code: '<App foo = {true} />;', output: '<App foo />;',
    errors: [{message: 'Value must be omitted for boolean attributes'}]
  }, {
    code: '<App foo />;', output: '<App foo={true} />;', options: ['always'],
    errors: [{message: 'Value must be set for boolean attributes'}]
  }]
});
