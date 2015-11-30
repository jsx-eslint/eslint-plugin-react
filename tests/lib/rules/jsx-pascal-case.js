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
    code: [
      'var TestComponent;',
      '<TestComponent />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var CSSTransitionGroup;',
      '<CSSTransitionGroup />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var BetterThanCSS;',
      '<BetterThanCSS />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var TestComponent;',
      '<TestComponent>',
      '  <div />',
      '</TestComponent>'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Test1Component;',
      '<Test1Component />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var TestComponent1;',
      '<TestComponent1 />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var T3stComp0nent;',
      '<T3stComp0nent />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var testComponent;',
      '<testComponent />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Imported JSX component testComponent must be in PascalCase'}]
  }, {
    code: [
      'var test_component;',
      '<test_component />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Imported JSX component test_component must be in PascalCase'}]
  }, {
    code: [
      'var YELLING;',
      '<YELLING />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Imported JSX component YELLING must be in PascalCase'}]
  }, {
    code: [
      'var testComponent;',
      '<testComponent>',
      '  <div />',
      '</testComponent>'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Imported JSX component testComponent must be in PascalCase'}]
  }]
});
