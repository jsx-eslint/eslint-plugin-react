/**
 * @fileoverview Tests for jsx-pascal-case
 * @author Jake Marsh
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-pascal-case');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-pascal-case', rule, {
  valid: [{
    code: '<testComponent />'
  }, {
    code: '<test_component />'
  }, {
    code: '<TestComponent />'
  }, {
    code: '<CSSTransitionGroup />'
  }, {
    code: '<BetterThanCSS />'
  }, {
    code: '<TestComponent><div /></TestComponent>'
  }, {
    code: '<Test1Component />'
  }, {
    code: '<TestComponent1 />'
  }, {
    code: '<T3stComp0nent />'
  }, {
    code: '<T />'
  }, {
    code: '<YMCA />',
    options: [{allowAllCaps: true}]
  }, {
    code: '<Modal.Header />'
  }, {
    code: '<Modal:Header />'
  }, {
    code: '<IGNORED />',
    options: [{ignore: ['IGNORED']}]
  }],

  invalid: [{
    code: '<Test_component />',
    errors: [{message: 'Imported JSX component Test_component must be in PascalCase'}]
  }, {
    code: '<TEST_COMPONENT />',
    errors: [{message: 'Imported JSX component TEST_COMPONENT must be in PascalCase'}]
  }, {
    code: '<YMCA />',
    errors: [{message: 'Imported JSX component YMCA must be in PascalCase'}]
  }]
});
