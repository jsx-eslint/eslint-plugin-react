/**
 * @fileoverview Tests for no-danger
 * @author Scott Andrews
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint').ESLintTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/no-danger', {
  valid: [
    {code: '<App />;', ecmaFeatures: {jsx: true}},
    {code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;', ecmaFeatures: {jsx: true}},
    {code: '<div className="bar"></div>;', ecmaFeatures: {jsx: true}}
  ],
  invalid: [{
    code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
    errors: [{message: 'Dangerous property \'dangerouslySetInnerHTML\' found'}],
    ecmaFeatures: {jsx: true}
  }]
});
