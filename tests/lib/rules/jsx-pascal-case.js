/**
 * @fileoverview Tests for jsx-pascal-case
 * @author Jake Marsh
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-pascal-case');

const parsers = require('../../helpers/parsers');

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
    code: '<T3StComp0Nent />'
  }, {
    code: '<Éurströmming />'
  }, {
    code: '<Año />'
  }, {
    code: '<Søknad />'
  }, {
    code: '<T />',
    parser: parsers.BABEL_ESLINT
  }, {
    code: '<YMCA />',
    options: [{allowAllCaps: true}]
  }, {
    code: '<TEST_COMPONENT />',
    options: [{allowAllCaps: true}]
  }, {
    code: '<Modal.Header />'
  }, {
    code: '<qualification.T3StComp0Nent />'
  }, {
    code: '<__this.TestComponent />'
  }, {
    code: '<Modal:Header />'
  }, {
    code: '<layout:Header />'
  }, {
    code: '<__ns:TestComponent />'
  }, {
    code: '<$ />'
  }, {
    code: '<_ />'
  }, {
    code: '<div />'
  }, {
    code: '<IGNORED />',
    options: [{ignore: ['IGNORED']}]
  }],

  invalid: [{
    code: '<testComponent />',
    errors: [{message: 'Imported JSX component testComponent must be in PascalCase'}]
  }, {
    code: '<Test_component />',
    errors: [{message: 'Imported JSX component Test_component must be in PascalCase'}]
  }, {
    code: '<TEST_COMPONENT />',
    errors: [{message: 'Imported JSX component TEST_COMPONENT must be in PascalCase'}]
  }, {
    code: '<YMCA />',
    errors: [{message: 'Imported JSX component YMCA must be in PascalCase'}]
  }, {
    code: '<$a />',
    errors: [{message: 'Imported JSX component $a must be in PascalCase'}]
  }, {
    code: '<foo.bar />',
    errors: [{message: 'Imported JSX component bar must be in PascalCase'}]
  }, {
    code: '<object.testComponent />',
    errors: [{message: 'Imported JSX component testComponent must be in PascalCase'}]
  }, {
    code: '<Module.testComponent />',
    errors: [{message: 'Imported JSX component testComponent must be in PascalCase'}]
  }, {
    code: '<__this.testComponent />',
    errors: [{message: 'Imported JSX component testComponent must be in PascalCase'}]
  }, {
    code: '<svg:path />',
    errors: [{message: 'Imported JSX component svg:path must be in PascalCase'}]
  }, {
    code: '<ns:testComponent />',
    errors: [{message: 'Imported JSX component ns:testComponent must be in PascalCase'}]
  }, {
    code: '<Ns:testComponent />',
    errors: [{message: 'Imported JSX component Ns:testComponent must be in PascalCase'}]
  }, {
    code: '<__ns:testComponent />',
    errors: [{message: 'Imported JSX component __ns:testComponent must be in PascalCase'}]
  }, {
    code: '<_TEST_COMPONENT />',
    options: [{allowAllCaps: true}],
    errors: [{message: 'Imported JSX component _TEST_COMPONENT must be in PascalCase or SCREAMING_SNAKE_CASE'}]
  }, {
    code: '<TEST_COMPONENT_ />',
    options: [{allowAllCaps: true}],
    errors: [{message: 'Imported JSX component TEST_COMPONENT_ must be in PascalCase or SCREAMING_SNAKE_CASE'}]
  }, {
    code: '<__ />',
    options: [{allowAllCaps: true}],
    errors: [{message: 'Imported JSX component __ must be in PascalCase or SCREAMING_SNAKE_CASE'}]
  }]
});
