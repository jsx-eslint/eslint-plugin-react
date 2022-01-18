/**
 * @fileoverview Tests for no-danger
 * @author Scott Andrews
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-danger');

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
ruleTester.run('no-danger', rule, {
  valid: parsers.all([
    { code: '<App />;' },
    { code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;' },
    { code: '<div className="bar"></div>;' },
  ]),
  invalid: parsers.all([
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
  ]),
});
