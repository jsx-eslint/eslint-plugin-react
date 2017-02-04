/**
 * @fileoverview Report attempt to use `ref` prop in custom component JSX tags.
 * @author John Lianoglou
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-ref');
var RuleTester = require('eslint').RuleTester;

var expectedErrorMessage = 'Use of "ref" prop considered smell of non-declarative design';

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run('jsx-no-ref', rule, {
  valid: [
    {code: '<App />', parserOptions: parserOptions},
    {code: '<App reference={value}/>', parserOptions: parserOptions},
    {code: '<App someProp={ref}/>', parserOptions: parserOptions},
    {code: '<App foo="ref"/>;', parserOptions: parserOptions},
    {code: '<input ref={value}/>', parserOptions: parserOptions}
  ],
  invalid: [
    {
      code: '<App ref={something}/>',
      errors: [{message: expectedErrorMessage}],
      parserOptions: parserOptions
    },
    {
      code: '<App otherProp={value} ref={something}/>',
      errors: [{message: expectedErrorMessage}],
      parserOptions: parserOptions
    }
  ]
});
