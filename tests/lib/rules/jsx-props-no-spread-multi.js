/**
 * @fileoverview Tests for jsx-props-no-spread-multi
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-props-no-spread-multi');

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
const expectedError = { messageId: 'noMultiSpreading' };

ruleTester.run('jsx-props-no-spread-multi', rule, {
  valid: parsers.all([
    {
      code: `
        const a = {};
        <App {...a} />
      `,
    },
    {
      code: `
        const a = {};
        const b = {};
        <App {...a} {...b} />
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        const props = {};
        <App {...props} {...props} />
      `,
      errors: [expectedError],
    },
    {
      code: `
        const props = {};
        <div {...props} a="a" {...props} />
      `,
      errors: [expectedError],
    },
    {
      code: `
        const props = {};
        <div {...props} {...props} {...props} />
      `,
      errors: [expectedError, expectedError],
    },
  ]),
});
