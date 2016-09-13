/**
 * @fileoverview Forbid target='_blank' attribute
 * @author Kevin Miller
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-target-blank');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-no-target-blank', rule, {
  valid: [
    {code: '<a href="foobar"></a>', parserOptions: parserOptions},
    {code: '<a randomTag></a>', parserOptions: parserOptions},
    {code: '<a href="foobar" target="_blank" rel="noopener noreferrer"></a>', parserOptions: parserOptions},
    {code: '<a target="_blank" {...spreadProps} rel="noopener noreferrer"></a>', parserOptions: parserOptions},
    {code: '<a target="_blank" rel="noopener noreferrer" {...spreadProps}></a>', parserOptions: parserOptions},
    {code: '<p target="_blank"></p>', parserOptions: parserOptions},
    {code: '<a href="foobar" target="_BLANK" rel="NOOPENER noreferrer"></a>', parserOptions: parserOptions},
    {code: '<a target="_blank" rel={relValue}></a>', parserOptions: parserOptions},
    {code: '<a target={targetValue} rel="noopener noreferrer"></a>', parserOptions: parserOptions}
  ],
  invalid: [
    {code: '<a target="_blank"></a>', parserOptions: parserOptions,
     errors: [{message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'}]},
    {code: '<a target="_blank" rel=""></a>', parserOptions: parserOptions,
     errors: [{message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'}]},
    {code: '<a target="_blank" rel="noopenernoreferrer"></a>', parserOptions: parserOptions,
     errors: [{message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'}]},
    {code: '<a target="_BLANK"></a>', parserOptions: parserOptions,
     errors: [{message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'}]}
  ]
});
