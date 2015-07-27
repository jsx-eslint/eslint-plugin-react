/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint').ESLintTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslint.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
eslintTester.addRuleTest('lib/rules/jsx-no-undef', {
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
  }]
});
