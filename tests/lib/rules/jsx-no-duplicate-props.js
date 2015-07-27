/**
 * @fileoverview Enforce no duplicate props
 * @author Markus Ånöstam
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

var expectedError = {
  message: 'No duplicate props allowed',
  type: 'JSXAttribute'
};

var ignoreCaseArgs = [1, {
  ignoreCase: true
}];

var features = {
  jsx: true
};

eslintTester.addRuleTest('lib/rules/jsx-no-duplicate-props', {
  valid: [
    {code: '<App />;', ecmaFeatures: features},
    {code: '<App {...this.props} />;', ecmaFeatures: features},
    {code: '<App a b c />;', ecmaFeatures: features},
    {code: '<App a b c A />;', ecmaFeatures: features},
    {code: '<App {...this.props} a b c />;', ecmaFeatures: features},
    {code: '<App c {...this.props} a b />;', ecmaFeatures: features},
    {code: '<App a="c" b="b" c="a" />;', ecmaFeatures: features},
    {code: '<App {...this.props} a="c" b="b" c="a" />;', ecmaFeatures: features},
    {code: '<App c="a" {...this.props} a="c" b="b" />;', ecmaFeatures: features},
    {code: '<App A a />;', ecmaFeatures: features},
    {code: '<App A b a />;', ecmaFeatures: features},
    {code: '<App A="a" b="b" B="B" />;', ecmaFeatures: features}
  ],
  invalid: [
    {code: '<App a a />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App A b c A />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App a="a" b="b" a="a" />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App A a />;', args: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App a b c A />;', args: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App A="a" b="b" B="B" />;', args: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features}
  ]
});
