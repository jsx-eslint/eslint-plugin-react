/**
 * @fileoverview Enforce props alphabetical sorting
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-sort-props');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();

var expectedError = {
  message: 'Props should be sorted alphabetically',
  type: 'JSXAttribute'
};
var ignoreCaseArgs = [{
  ignoreCase: true
}];
var features = {
  jsx: true
};

ruleTester.run('jsx-sort-props', rule, {
  valid: [
    {code: '<App />;', ecmaFeatures: features},
    {code: '<App {...this.props} />;', ecmaFeatures: features},
    {code: '<App a b c />;', ecmaFeatures: features},
    {code: '<App {...this.props} a b c />;', ecmaFeatures: features},
    {code: '<App c {...this.props} a b />;', ecmaFeatures: features},
    {code: '<App a="c" b="b" c="a" />;', ecmaFeatures: features},
    {code: '<App {...this.props} a="c" b="b" c="a" />;', ecmaFeatures: features},
    {code: '<App c="a" {...this.props} a="c" b="b" />;', ecmaFeatures: features},
    {code: '<App A a />;', ecmaFeatures: features},
    {code: '<App a A />;', options: ignoreCaseArgs, ecmaFeatures: features},
    {code: '<App a B c />;', options: ignoreCaseArgs, ecmaFeatures: features},
    {code: '<App A b C />;', options: ignoreCaseArgs, ecmaFeatures: features}
  ],
  invalid: [
    {code: '<App b a />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App {...this.props} b a />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App c {...this.props} b a />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App a A />;', errors: [expectedError], ecmaFeatures: features},
    {code: '<App B a />;', options: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App B A c />;', options: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App c="a" a="c" b="b" />;', errors: 2, ecmaFeatures: features},
    {code: '<App {...this.props} c="a" a="c" b="b" />;', errors: 2, ecmaFeatures: features},
    {code: '<App d="d" b="b" {...this.props} c="a" a="c" />;', errors: 2, ecmaFeatures: features}
  ]
});
