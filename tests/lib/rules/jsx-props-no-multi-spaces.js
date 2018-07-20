/**
 * @fileoverview Disallow multiple spaces between inline JSX props
 * @author Adrian Moennich
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-props-no-multi-spaces');
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
ruleTester.run('jsx-props-no-multi-spaces', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n')
  }, {
    code: [
      '<App foo />'
    ].join('\n')
  }, {
    code: [
      '<App foo bar />'
    ].join('\n')
  }, {
    code: [
      '<App foo="with  spaces   " bar />'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo bar />'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo',
      '  bar />'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo {...test}',
      '  bar />'
    ].join('\n')
  }, {
    code: '<Foo.Bar baz="quux" />'
  }, {
    code: '<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />'
  }],

  invalid: [{
    code: [
      '<App  foo />'
    ].join('\n'),
    output: [
      '<App foo />'
    ].join('\n'),
    errors: [{message: 'Expected only one space between "App" and "foo"'}]
  }, {
    code: [
      '<App foo="with  spaces   "   bar />'
    ].join('\n'),
    output: [
      '<App foo="with  spaces   " bar />'
    ].join('\n'),
    errors: [{message: 'Expected only one space between "foo" and "bar"'}]
  }, {
    code: [
      '<App foo  bar />'
    ].join('\n'),
    output: [
      '<App foo bar />'
    ].join('\n'),
    errors: [{message: 'Expected only one space between "foo" and "bar"'}]
  }, {
    code: [
      '<App  foo   bar />'
    ].join('\n'),
    output: [
      '<App foo bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected only one space between "App" and "foo"'},
      {message: 'Expected only one space between "foo" and "bar"'}
    ]
  }, {
    code: [
      '<App foo  {...test}  bar />'
    ].join('\n'),
    output: [
      '<App foo {...test} bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected only one space between "foo" and "test"'},
      {message: 'Expected only one space between "test" and "bar"'}
    ]
  }, {
    code: '<Foo.Bar  baz="quux" />',
    output: '<Foo.Bar baz="quux" />',
    errors: [
      {message: 'Expected only one space between "Foo.Bar" and "baz"'}
    ]
  }, {
    code: '<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh  xyzzy="thud" />',
    output: '<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />',
    errors: [
      {message: 'Expected only one space between "Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh" and "xyzzy"'}
    ]
  }]
});
