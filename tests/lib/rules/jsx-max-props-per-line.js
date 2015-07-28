/**
 * @fileoverview Limit maximum of props on a single line in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint').ESLintTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/jsx-max-props-per-line', {
  valid: [{
    code: '<App foo />',
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo bar />',
    options: [{maximum: 2}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App {...this.props} bar />',
    options: [{maximum: 2}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo',
      '  bar',
      '/>'
    ].join('\n'),
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    options: [{maximum: 2}],
    ecmaFeatures: {jsx: true}
  }],

  invalid: [{
    code: '<App foo bar baz />;',
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo bar baz />;',
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App {...this.props} bar />;',
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App bar {...this.props} />;',
    errors: [{message: 'Prop `this.props` must be placed on a new line'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo {...this.props}',
      '  baz',
      '/>'
    ].join('\n'),
    errors: [{message: 'Prop `this.props` must be placed on a new line'}],
    ecmaFeatures: {jsx: true}
  }]
});
