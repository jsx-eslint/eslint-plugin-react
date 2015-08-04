/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var rule = require('../../../lib/rules/jsx-no-undef');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
eslint.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
ruleTester.run('jsx-no-undef', rule, {
  valid: [{
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    ecmaFeatures: {modules: true, jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    ecmaFeatures: {jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<img />);',
    ecmaFeatures: {jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);',
    ecmaFeatures: {jsx: true}
  }],
  invalid: [{
    code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
    errors: [{
      message: '\'App\' is not defined.'
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Appp.Foo />);',
    errors: [{
      message: '\'Appp\' is not defined.'
    }],
    ecmaFeatures: {jsx: true}
  }]
});
