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

const {BABEL_ESLINT, TYPESCRIPT_ESLINT} = require('../../helpers/parsers');

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
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo prop="bar" />',
      options: ['never'],
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo {...this.props} />',
      options: ['never'],
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo a a a />',
      options: ['never'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo a',
        '  b ',
        '/>'
      ].join('\n'),
      options: ['never'],
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo />',
      options: ['multiline'],
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo prop="one" />',
      options: ['multiline'],
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo {...this.props} />',
      options: ['multiline'],
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo a a a />',
      options: ['multiline'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['multiline'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo',
        '  {...this.props}',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['multiline'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo bar />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo bar baz />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo prop={{',
        '}} />'
      ].join('\n'),
      options: ['multiline-multiprop'],
      parser: BABEL_ESLINT
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
      parser: BABEL_ESLINT
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
      parser: TYPESCRIPT_ESLINT
    },
    {
      code: '<Foo />',
      options: ['always'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo',
        '  propOne="one"',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      parser: BABEL_ESLINT
    },
    {
      code: [
        '<Foo',
        '  {...this.props}',
        '  propTwo="two"',
        '/>'
      ].join('\n'),
      options: ['always'],
      parser: BABEL_ESLINT
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
      parser: BABEL_ESLINT
    },
    {
      code: '<Foo propOne="one" propTwo="two" />',
      output: [
        '<Foo',
        'propOne="one" propTwo="two" />'
      ].join('\n'),
      options: ['always'],
      errors: [{message: 'Property should be placed on a new line'}],
      parser: TYPESCRIPT_ESLINT
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
      parser: BABEL_ESLINT
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
      parser: TYPESCRIPT_ESLINT
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
      parser: BABEL_ESLINT
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
      parser: TYPESCRIPT_ESLINT
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
      parser: BABEL_ESLINT
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
      parser: TYPESCRIPT_ESLINT
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
      parser: BABEL_ESLINT
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
      parser: TYPESCRIPT_ESLINT
    }
  ]
});
