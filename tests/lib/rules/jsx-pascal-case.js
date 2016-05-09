/**
 * @fileoverview Tests for jsx-pascal-case
 * @author Jake Marsh
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-pascal-case');
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
ruleTester.run('jsx-pascal-case', rule, {
  valid: [{
    code: '<testComponent />',
    parserOptions: parserOptions
  }, {
    code: '<test_component />',
    parserOptions: parserOptions
  }, {
    code: '<TestComponent />',
    parserOptions: parserOptions
  }, {
    code: '<CSSTransitionGroup />',
    parserOptions: parserOptions
  }, {
    code: '<BetterThanCSS />',
    parserOptions: parserOptions
  }, {
    code: '<TestComponent><div /></TestComponent>',
    parserOptions: parserOptions
  }, {
    code: '<Test1Component />',
    parserOptions: parserOptions
  }, {
    code: '<TestComponent1 />',
    parserOptions: parserOptions
  }, {
    code: '<T3stComp0nent />',
    parserOptions: parserOptions
  }, {
    code: '<T />',
    parserOptions: parserOptions
  }, {
    code: '<YMCA />',
    parserOptions: parserOptions,
    options: [{allowAllCaps: true}]
  }, {
    code: '<IGNORED />',
    parserOptions: parserOptions,
    options: [{ignore: ['IGNORED']}]
  }],

  invalid: [{
    code: '<Test_component />',
    parserOptions: parserOptions,
    errors: [{message: 'Imported JSX component Test_component must be in PascalCase'}]
  }, {
    code: '<TEST_COMPONENT />',
    parserOptions: parserOptions,
    errors: [{message: 'Imported JSX component TEST_COMPONENT must be in PascalCase'}]
  }, {
    code: '<YMCA />',
    parserOptions: parserOptions,
    errors: [{message: 'Imported JSX component YMCA must be in PascalCase'}]
  }]
});
