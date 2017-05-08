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
ruleTester.run('jsx-no-target-blank', rule, {
  valid: [
    {code: '<a href="foobar"></a>'},
    {code: '<a randomTag></a>'},
    {code: '<a href="foobar" target="_blank" rel="noopener noreferrer"></a>'},
    {code: '<a target="_blank" {...spreadProps} rel="noopener noreferrer"></a>'},
    {code: '<a target="_blank" rel="noopener noreferrer" {...spreadProps}></a>'},
    {code: '<p target="_blank"></p>'},
    {code: '<a href="foobar" target="_BLANK" rel="NOOPENER noreferrer"></a>'},
    {code: '<a target="_blank" rel={relValue}></a>'},
    {code: '<a target={targetValue} rel="noopener noreferrer"></a>'}
  ],
  invalid: [{
    code: '<a target="_blank"></a>',
    errors: [{
      message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'
    }]
  }, {
    code: '<a target="_blank" rel=""></a>',
    errors: [{
      message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'
    }]
  }, {
    code: '<a target="_blank" rel="noopenernoreferrer"></a>',
    errors: [{
      message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'
    }]
  }, {
    code: '<a target="_BLANK"></a>',
    errors: [{
      message: 'Using target="_blank" without rel="noopener noreferrer" is a security risk:' +
      ' see https://mathiasbynens.github.io/rel-noopener'
    }]}
  ]
});
