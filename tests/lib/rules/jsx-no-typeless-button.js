/**
 * @fileoverview Forbid "button" element without an explicit "type" attribute
 * @author Filipp Riabchun
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-typeless-button');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
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

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-no-typeless-button', rule, {
  valid: [
    {code: '<span/>'},
    {code: '<button type="button"/>'},
    {code: '<button type="submit"/>'},
    {code: '<button type="reset"/>'}
  ],
  invalid: [{
    code: '<button/>',
    errors: [{
      message: 'Missing an explicit "type" attribute for button'
    }]
  }]
});
