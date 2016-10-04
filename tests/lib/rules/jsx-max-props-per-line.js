/**
 * @fileoverview Limit maximum of props on a single line in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-max-props-per-line');
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
ruleTester.run('jsx-max-props-per-line', rule, {
  valid: [{
    code: '<App />',
    parserOptions: parserOptions
  }, {
    code: '<App foo />',
    parserOptions: parserOptions
  }, {
    code: '<App foo bar />',
    options: [{maximum: 2}],
    parserOptions: parserOptions
  }, {
    code: '<App foo bar />',
    options: [{when: 'multiline'}],
    parserOptions: parserOptions
  }, {
    code: '<App foo {...this.props} />',
    options: [{when: 'multiline'}],
    parserOptions: parserOptions
  }, {
    code: '<App foo bar baz />',
    options: [{maximum: 2, when: 'multiline'}],
    parserOptions: parserOptions
  }, {
    code: '<App {...this.props} bar />',
    options: [{maximum: 2}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo',
      '  bar',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    options: [{maximum: 2}],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: '<App foo bar baz />;',
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: '<App foo bar baz />;',
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: '<App {...this.props} bar />;',
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: '<App bar {...this.props} />;',
    errors: [{message: 'Prop `this.props` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo {...this.props}',
      '  baz',
      '/>'
    ].join('\n'),
    errors: [{message: 'Prop `this.props` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={{',
      '  }} bar',
      '/>'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={{',
      '}} bar />'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo bar={{',
      '}} baz />'
    ].join('\n'),
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={{',
      '}} {...rest} />'
    ].join('\n'),
    errors: [{message: 'Prop `rest` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '  ...this.props',
      '} bar />'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '  ...this.props',
      '} {',
      '  ...rest',
      '} />'
    ].join('\n'),
    errors: [{message: 'Prop `rest` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={{',
      '  }} bar baz',
      '/>'
    ].join('\n'),
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}],
    parserOptions: parserOptions
  }]
});
