/**
 * @fileoverview Ensure proper position of the first property in JSX
 * @author Joachim Seminck
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-first-prop-new-line');
var RuleTester = require('eslint').RuleTester;

var parserOptions = 'babel-eslint';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-first-prop-new-line', rule, {

  valid: [
    {
      code: '<Foo />',
      options: ['never'],
      parser: parserOptions
    },
    {
      code: '<Foo prop="bar" />',
      options: ['never'],
      parser: parserOptions
    },
    {
      code: '<Foo {...this.props} />',
      options: ['never'],
      parser: parserOptions
    },
    {
      code: '<Foo a a a />',
      options: ['never'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo a',
        '  b ',
        '/>'
      ].join('\n'),
      options: ['never'],
      parser: parserOptions
    },
    {
      code: '<Foo />',
      options: ['multiline'],
      parser: parserOptions
    },
    {
      code: '<Foo prop="one" />',
      options: ['multiline'],
      parser: parserOptions
    },
    {
      code: '<Foo {...this.props} />',
      options: ['multiline'],
      parser: parserOptions
    },
    {
      code: '<Foo a a a />',
      options: ['multiline'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['multiline'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo',
        '  {...this.props}',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['multiline'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo bar />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo bar baz />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo prop={{',
        '}} />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo ',
        '  foo={{',
        '  }}',
        '  bar',
        '/>'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: parserOptions
    },
    {
      code: '<Foo />',
      options: ['always'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      parser: parserOptions
    },
    {
      code: [
        '<Foo',
        '  {...this.props}',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      parser: parserOptions
    }
  ],

  invalid: [
    {
      code: '<Foo prop="one" />',
      output: [
        '<Foo',
        ' prop="one" />'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: parserOptions
    },
    {
      code: [
        '<Foo propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      output: [
        '<Foo',
        ' propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: parserOptions
    },
    {
      code: [
        '<Foo',
        ' propOne="one"',
        ' propTwo="two"',
        '/>'
      ].join('\n'),
      output: [
        '<Foo propOne="one"',
        ' propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['never'],
      errors: [{message: 'Property should be placed on the same line as the component declaration'}],
      parser: parserOptions
    },
    {
      code: [
        '<Foo prop={{',
        '}} />'
      ].join('\n'),
      options: ['multiline'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: parserOptions
    },
    {
      code: [
        '<Foo bar={{',
        '}} baz />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: parserOptions
    }
  ]
});
