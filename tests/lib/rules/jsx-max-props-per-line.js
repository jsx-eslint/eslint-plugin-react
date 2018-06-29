/**
 * @fileoverview Limit maximum of props on a single line in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-max-props-per-line');
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
ruleTester.run('jsx-max-props-per-line', rule, {
  valid: [{
    code: '<App />'
  }, {
    code: '<App foo />'
  }, {
    code: '<App foo bar />',
    options: [{maximum: 2}]
  }, {
    code: '<App foo bar />',
    options: [{when: 'multiline'}]
  }, {
    code: '<App foo {...this.props} />',
    options: [{when: 'multiline'}]
  }, {
    code: '<App foo bar baz />',
    options: [{maximum: 2, when: 'multiline'}]
  }, {
    code: '<App {...this.props} bar />',
    options: [{maximum: 2}]
  }, {
    code: [
      '<App',
      '  foo',
      '  bar',
      '/>'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    options: [{maximum: 2}]
  }],

  invalid: [{
    code: '<App foo bar baz />;',
    output: [
      '<App foo',
      'bar',
      'baz />;'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: '<App foo bar baz />;',
    output: [
      '<App foo bar',
      'baz />;'
    ].join('\n'),
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}]
  }, {
    code: '<App {...this.props} bar />;',
    output: [
      '<App {...this.props}',
      'bar />;'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: '<App bar {...this.props} />;',
    output: [
      '<App bar',
      '{...this.props} />;'
    ].join('\n'),
    errors: [{message: 'Prop `this.props` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo bar',
      '  baz',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '  foo',
      'bar',
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
    output: [
      '<App',
      '  foo',
      '{...this.props}',
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
    output: [
      '<App',
      '  foo={{',
      '  }}',
      'bar',
      '/>'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={{',
      '}} bar />'
    ].join('\n'),
    output: [
      '<App foo={{',
      '}}',
      'bar />'
    ].join('\n'),
    errors: [{message: 'Prop `bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo bar={{',
      '}} baz />'
    ].join('\n'),
    output: [
      '<App foo bar={{',
      '}}',
      'baz />'
    ].join('\n'),
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}]
  }, {
    code: [
      '<App foo={{',
      '}} {...rest} />'
    ].join('\n'),
    output: [
      '<App foo={{',
      '}}',
      '{...rest} />'
    ].join('\n'),
    errors: [{message: 'Prop `rest` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '  ...this.props',
      '} bar />'
    ].join('\n'),
    output: [
      '<App {',
      '  ...this.props',
      '}',
      'bar />'
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
    output: [
      '<App {',
      '  ...this.props',
      '}',
      '{',
      '  ...rest',
      '} />'
    ].join('\n'),
    errors: [{message: 'Prop `rest` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={{',
      '  }} bar baz bor',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '  foo={{',
      '  }} bar',
      'baz bor',
      '/>'
    ].join('\n'),
    options: [{maximum: 2}],
    errors: [{message: 'Prop `baz` must be placed on a new line'}]
  }]
});
