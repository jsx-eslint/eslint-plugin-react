/**
 * @fileoverview Enforce no duplicate props
 * @author Markus Ånöstam
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-duplicate-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

const expectedError = {
  messageId: 'noDuplicateProps',
  type: 'JSXAttribute',
};

const ignoreCaseArgs = [{
  ignoreCase: true,
}];

ruleTester.run('jsx-no-duplicate-props', rule, {
  valid: parsers.all([
    { code: '<App />;' },
    { code: '<App {...this.props} />;' },
    { code: '<App a b c />;' },
    { code: '<App a b c A />;' },
    { code: '<App {...this.props} a b c />;' },
    { code: '<App c {...this.props} a b />;' },
    { code: '<App a="c" b="b" c="a" />;' },
    { code: '<App {...this.props} a="c" b="b" c="a" />;' },
    { code: '<App c="a" {...this.props} a="c" b="b" />;' },
    { code: '<App A a />;' },
    { code: '<App A b a />;' },
    { code: '<App A="a" b="b" B="B" />;' },
    {
      code: '<App a:b="c" />;',
      options: ignoreCaseArgs,
      features: ['jsx namespace'],
    },
  ]),
  invalid: parsers.all([
    {
      code: '<App a a />;',
      errors: [expectedError],
    },
    {
      code: '<App A b c A />;',
      errors: [expectedError],
    },
    {
      code: '<App a="a" b="b" a="a" />;',
      errors: [expectedError],
    },
    {
      code: '<App A a />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
    },
    {
      code: '<App a b c A />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
    },
    {
      code: '<App A="a" b="b" B="B" />;',
      options: ignoreCaseArgs,
      errors: [expectedError],
    },
  ]),
});
