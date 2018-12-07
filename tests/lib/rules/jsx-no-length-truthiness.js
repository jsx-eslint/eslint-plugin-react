/**
 * @fileoverview Tests for jsx-no-length-truthiness
 * @author Carl Mäsak & David Waller
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-length-truthiness');
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

const expectedError = {
  message: 'Don\'t check .length truthiness in JSX, might render 0'
};

ruleTester.run('jsx-no-length-truthiness', rule, {
  valid: [
    {code: 'arr.length > 0 && <Foo />'},
    {code: 'arr.length > 1 && <Foo />'},
    {code: 'arr.length && "foobar"'}, // ok since we can't tell if this is a JSX expression at all
    {code: 'arr.longth && <Foo />'},
    {code: '(arr.length || flag) && <Foo />'},
    {code: '<Foo>Number of posts: {arr.length}</Foo>'},
    {code: '<Foo>Number of posts: {flag && arr.length}</Foo>'},
    {code: '<Foo>You have {arr.length || "no"} posts</Foo>'}
  ],
  invalid: [
    {
      code: 'arr.length && <Foo />',
      errors: [expectedError],
      output: 'arr.length > 0 && <Foo />'
    },
    {
      code: 'arr.foo.length && <Foo />',
      errors: [expectedError],
      output: 'arr.foo.length > 0 && <Foo />'
    },
    {
      code: 'arr && arr.length && <Foo />',
      errors: [expectedError],
      output: 'arr && arr.length > 0 && <Foo />'
    },
    {
      code: 'arr && arr.length && somethingElse && <Foo />',
      errors: [expectedError],
      output: 'arr && arr.length > 0 && somethingElse && <Foo />'
    },
    {
      code: 'flag || arr.length && <Foo />',
      errors: [expectedError],
      output: 'flag || arr.length > 0 && <Foo />'
    },
    {
      code: '<Foo><Bar/>{arr.length && "you have posts!"}</Foo>',
      errors: [expectedError],
      output: '<Foo><Bar/>{arr.length > 0 && "you have posts!"}</Foo>'
    },
    {
      code: '<Foo><Bar/>{flag && arr.length && "you have posts!"}</Foo>',
      errors: [expectedError],
      output: '<Foo><Bar/>{flag && arr.length > 0 && "you have posts!"}</Foo>'
    }
  ]
});
