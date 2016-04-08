/**
* @fileoverview Enforce the location of the spread operator
* @author Joachim Seminck
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-spread-operator-position');
var RuleTester = require('eslint').RuleTester;

var parserOptions = 'babel-eslint';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-spread-operator-position', rule, {

  valid: [
    {
      code: '<Foo {...this.props} a b />',
      options: ['begin'],
      parser: parserOptions
    },
    {
      code: '<Foo a b {...this.props} />',
      options: ['end'],
      parser: parserOptions
    },
    {
      code: '<Foo a b />',
      options: ['begin'],
      parser: parserOptions
    },
    {
      code: '<Foo a b />',
      options: ['end'],
      parser: parserOptions
    },
    {
      code: '<Foo {...this.props} />',
      options: ['begin'],
      parser: parserOptions
    },
    {
      code: '<Foo {...this.props} />',
      options: ['end'],
      parser: parserOptions
    }
  ],

  invalid: [
    {
      code: '<Foo {...this.props} a b />',
      options: ['end'],
      errors: [{message: 'Last property should be the spread operator'}],
      parser: parserOptions
    },
    {
      code: '<Foo a b {...this.props} />',
      options: ['begin'],
      errors: [{message: 'First property should be the spread operator'}],
      parser: parserOptions
    }
  ]
});
