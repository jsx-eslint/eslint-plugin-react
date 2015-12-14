/**
 * @fileoverview Enforce no duplicate props
 * @author Markus Ånöstam
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-duplicate-props');
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

var expectedError = {
  message: 'No duplicate props allowed',
  type: 'JSXAttribute'
};

var ignoreCaseArgs = [{
  ignoreCase: true
}];

ruleTester.run('jsx-no-duplicate-props', rule, {
  valid: [
    {code: '<App />;', parserOptions: parserOptions},
    {code: '<App {...this.props} />;', parserOptions: parserOptions},
    {code: '<App a b c />;', parserOptions: parserOptions},
    {code: '<App a b c A />;', parserOptions: parserOptions},
    {code: '<App {...this.props} a b c />;', parserOptions: parserOptions},
    {code: '<App c {...this.props} a b />;', parserOptions: parserOptions},
    {code: '<App a="c" b="b" c="a" />;', parserOptions: parserOptions},
    {code: '<App {...this.props} a="c" b="b" c="a" />;', parserOptions: parserOptions},
    {code: '<App c="a" {...this.props} a="c" b="b" />;', parserOptions: parserOptions},
    {code: '<App A a />;', parserOptions: parserOptions},
    {code: '<App A b a />;', parserOptions: parserOptions},
    {code: '<App A="a" b="b" B="B" />;', parserOptions: parserOptions}
  ],
  invalid: [
    {code: '<App a a />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App A b c A />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App a="a" b="b" a="a" />;', errors: [expectedError], parserOptions: parserOptions},
    {code: '<App A a />;', options: ignoreCaseArgs, errors: [expectedError], parserOptions: parserOptions},
    {code: '<App a b c A />;', options: ignoreCaseArgs, errors: [expectedError], parserOptions: parserOptions},
    {code: '<App A="a" b="b" B="B" />;', options: ignoreCaseArgs, errors: [expectedError], parserOptions: parserOptions}
  ]
});
