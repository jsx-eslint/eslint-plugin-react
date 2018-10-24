/**
 * @fileoverview Ensure proper position of the first property in JSX
 * @author Joachim Seminck
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-first-prop-new-line');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-first-prop-new-line', rule, {

  valid: [
    {
      code: '<Foo />',
      options: ['never'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo prop="bar" />',
      options: ['never'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo {...this.props} />',
      options: ['never'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo a a a />',
      options: ['never'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo a',
        '  b ',
        '/>'
      ].join('\n'),
      options: ['never'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo />',
      options: ['multiline'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo prop="one" />',
      options: ['multiline'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo {...this.props} />',
      options: ['multiline'],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo a a a />',
      options: ['multiline'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['multiline'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo',
        '  {...this.props}',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['multiline'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo bar />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo bar baz />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo prop={{',
        '}} />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: 'babel-eslint'
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
      parser: 'babel-eslint'
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
      parser: 'typescript-eslint-parser'
    },
    {
      code: '<Foo />',
      options: ['always'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo',
        '  {...this.props}',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: '<Foo propOne="one" propTwo="two" />',
      output: [
        '<Foo',
        'propOne="one" propTwo="two" />'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'babel-eslint'
    },
    {
      code: '<Foo propOne="one" propTwo="two" />',
      output: [
        '<Foo',
        'propOne="one" propTwo="two" />'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'typescript-eslint-parser'
    },
    {
      code: [
        '<Foo propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      output: [
        '<Foo',
        'propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      output: [
        '<Foo',
        'propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'typescript-eslint-parser'
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      output: [
        '<Foo propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['never'],
      errors: [{message: 'Property should be placed on the same line as the component declaration'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      output: [
        '<Foo propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['never'],
      errors: [{message: 'Property should be placed on the same line as the component declaration'}],
      parser: 'typescript-eslint-parser'
    },
    {
      code: [
        '<Foo prop={{',
        '}} />'
      ].join('\n'),
      output: [
        '<Foo',
        'prop={{',
        '}} />'
      ].join('\n'),
      options: ['multiline'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo prop={{',
        '}} />'
      ].join('\n'),
      output: [
        '<Foo',
        'prop={{',
        '}} />'
      ].join('\n'),
      options: ['multiline'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'typescript-eslint-parser'
    },
    {
      code: [
        '<Foo bar={{',
        '}} baz />'
      ].join('\n'),
      output: [
        '<Foo',
        'bar={{',
        '}} baz />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        '<Foo bar={{',
        '}} baz />'
      ].join('\n'),
      output: [
        '<Foo',
        'bar={{',
        '}} baz />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: 'typescript-eslint-parser'
    }
  ]
});
