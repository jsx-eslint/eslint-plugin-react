/**
 * @fileoverview Disallow prop value as `undefined`.
 * @author Ethan Cohen
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-undef-props');
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
ruleTester.run('jsx-no-undef-props', rule, {
  valid: [
    {code: '<div foo="bar" />', parserOptions: parserOptions},
    {code: '<div foo />', parserOptions: parserOptions},
    {code: '<div foo={"bar"} />', parserOptions: parserOptions},
    {code: '<div foo={bar} />', parserOptions: parserOptions},
    {code: '<div foo={42} />', parserOptions: parserOptions},
    {code: '<div foo={obj.prop} />', parserOptions: parserOptions},
    {code: '<div foo={bar ? baz : undefined} />', parserOptions: parserOptions},
    {code: '<div foo={false && undefined} />', parserOptions: parserOptions},
    {code: '<div {...otherProps} foo={undefined} />', parserOptions: parserOptions}
  ],
  invalid: [
    {
      code: '[<div foo={undefined} />];',
      errors: [{message: 'Leave off the prop `foo` instead of passing undefined as its value.'}],
      parserOptions: parserOptions
    },
    {
      code: '[<Foo bar={undefined} />];',
      errors: [{message: 'Leave off the prop `bar` instead of passing undefined as its value.'}],
      parserOptions: parserOptions
    },
    {
      code: '[<Foo baz={false ? foo : undefined} />];',
      errors: [{message: 'Leave off the prop `baz` instead of passing undefined as its value.'}],
      parserOptions: parserOptions
    },
    {
      code: '[<Foo baz={void 0} />];',
      errors: [{message: 'Leave off the prop `baz` instead of passing undefined as its value.'}],
      parserOptions: parserOptions
    },
    {
      code: '[<Foo baz={false || undefined} />];',
      errors: [{message: 'Leave off the prop `baz` instead of passing undefined as its value.'}],
      parserOptions: parserOptions
    },
    {
      code: '[<Foo baz={true && undefined} />];',
      errors: [{message: 'Leave off the prop `baz` instead of passing undefined as its value.'}],
      parserOptions: parserOptions
    }
  ]
});
