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

var features = {
  jsx: true
};

ruleTester.run('jsx-no-duplicate-props', rule, {
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
    {code: '<App A a />;', options: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App a b c A />;', options: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features},
    {code: '<App A="a" b="b" B="B" />;', options: ignoreCaseArgs, errors: [expectedError], ecmaFeatures: features}
  ]
});
