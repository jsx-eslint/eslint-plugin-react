/**
 * @fileoverview Enforce props alphabetical sorting
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);

var expectedError = {
  message: 'Props should be sorted alphabetically',
  type: 'JSXAttribute'
};
var ignoreCaseArgs = [1, {
  ignoreCase: true
}];
var features = {
  jsx: true
};

eslintTester.addRuleTest('lib/rules/jsx-sort-props', {
  valid: [
    {code: '<App />;', ecmaFeatures: features},
    {code: '<App {...this.props} />;', ecmaFeatures: features},
    {code: '<App a b c />;', ecmaFeatures: features},
    {code: '<App {...this.props} a b c />;', ecmaFeatures: features},
    {code: '<App a="c" b="b" c="a" />;', ecmaFeatures: features},
    {code: '<App {...this.props} a="c" b="b" c="a" />;', ecmaFeatures: features},
    {code: '<App A a />;', ecmaFeatures: features},
    {code: '<App a A />;', args: ignoreCaseArgs, ecmaFeatures: features},
    {code: '<App a B c />;', args: ignoreCaseArgs, ecmaFeatures: features},
    {code: '<App A b C />;', args: ignoreCaseArgs, ecmaFeatures: features}
  ],
  invalid: [
    {code: '<App b a />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App {...this.props} b a />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App a A />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App B a />;', args: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App B A c />;', args: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App c="a" a="c" b="b" />;', errors: 2, ecmaFeatures: features},
    {code: '<App {...this.props} c="a" a="c" b="b" />;', errors: 2, ecmaFeatures: features}
  ]
});
