/**
 * @fileoverview Tests for no-array-index-key
 * @author Joe Lencioni
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-array-index-key');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-array-index-key', rule, {
  valid: [
    {code: '<Foo key="foo" />;', parserOptions: parserOptions},
    {code: '<Foo key={i} />;', parserOptions: parserOptions},
    {code: '<Foo key={`foo-${i}`} />;', parserOptions: parserOptions},
    {code: '<Foo key={\'foo-\' + i} />;', parserOptions: parserOptions},

    {
      code: 'foo.bar((baz, i) => <Foo key={i} />)',
      parserOptions: parserOptions
    },

    {
      code: 'foo.bar((bar, i) => <Foo key={`foo-${i}`} />)',
      parserOptions: parserOptions
    },

    {
      code: 'foo.bar((bar, i) => <Foo key={\'foo-\' + i} />)',
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((baz) => <Foo key={baz.id} />)',
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((baz, i) => <Foo key={baz.id} />)',
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((baz, i) => <Foo key={\'foo\' + baz.id} />)',
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: 'foo.map((bar, i) => <Foo key={i} />)',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, anything) => <Foo key={anything} />)',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => <Foo key={`foo-${i}`} />)',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => <Foo key={\'foo-\' + i} />)',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => <Foo key={\'foo-\' + i + \'-bar\'} />)',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => React.createElement(\'Foo\', { key: i }))',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => React.createElement(\'Foo\', { key: `foo-${i}` }))',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => React.createElement(\'Foo\', { key: \'foo-\' + i }))',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    },

    {
      code: 'foo.map((bar, i) => React.createElement(\'Foo\', { key: \'foo-\' + i + \'-bar\' }))',
      errors: [{message: 'Do not use Array index in keys'}],
      parserOptions: parserOptions
    }
  ]
});
