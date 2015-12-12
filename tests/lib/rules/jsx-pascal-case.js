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

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-pascal-case', rule, {
  valid: [{
    code: '<testComponent />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<test_component />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<TestComponent />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<CSSTransitionGroup />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<BetterThanCSS />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<TestComponent><div /></TestComponent>',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<Test1Component />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<TestComponent1 />',
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: '<T3stComp0nent />',
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: '<Test_component />',
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Imported JSX component Test_component must be in PascalCase'}]
  }, {
    code: '<TEST_COMPONENT />',
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Imported JSX component TEST_COMPONENT must be in PascalCase'}]
  }]
});
