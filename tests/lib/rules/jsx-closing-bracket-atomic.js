/**
 * @fileoverview Tests for jsx-closing-bracket-atomic
 * @author Diogo Franco (Kovensky)
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-closing-bracket-atomic');
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
ruleTester.run('jsx-closing-bracket-atomic', rule, {
  valid: [
    {code: '<App/>;', parserOptions: parserOptions},
    {code: '<App />;', parserOptions: parserOptions},
    {code: '<div className="bar"></div>;', parserOptions: parserOptions},
    {code: '<div className="bar"></ div>;', parserOptions: parserOptions}
  ],
  invalid: [{
    code: '<App/ >;',
    errors: [{message: 'Self-closing JSX elements must not have whitespace between the `/` and the `>`'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App/',
      '>'
    ].join('\n'),
    errors: [{message: 'Self-closing JSX elements must not have whitespace between the `/` and the `>`'}],
    parserOptions: parserOptions
  }, {
    code: '<div className="bar">< /div>;',
    errors: [{message: 'JSX closing tags must not have whitespace between the `<` and the `/`'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div className="bar"><',
      '/div>;'
    ].join('\n'),
    errors: [{message: 'JSX closing tags must not have whitespace between the `<` and the `/`'}],
    parserOptions: parserOptions
  }]
});
