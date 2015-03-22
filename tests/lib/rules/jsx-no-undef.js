/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslint.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
eslintTester.addRuleTest('lib/rules/jsx-no-undef', {
  valid: [{
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    args: [1, {vars: 'all'}],
    ecmaFeatures: {modules: true, jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    args: [1, {vars: 'all'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<img />);',
    args: [1, {vars: 'all'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);',
    args: [1, {vars: 'all'}],
    ecmaFeatures: {jsx: true}
  }],
  invalid: [{
    code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
    args: [1, {vars: 'all'}],
    errors: [{
      message: '\'App\' is not defined.'
    }],
    ecmaFeatures: {jsx: true}
  }]
});
