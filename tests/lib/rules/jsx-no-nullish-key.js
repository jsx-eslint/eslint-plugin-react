/**
 * @fileoverview Warn against literal `null` or `undefined` as JSX `key` prop values
 * @author Maximilien Tirard
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-no-nullish-key');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-no-nullish-key', rule, {
  valid: [
    { code: '<App key="id" />' },
    { code: '<App key={id} />' },
    { code: '<App key={0} />' },
    { code: '<App key={`prefix-${id}`} />' },
    { code: '<App key={item.id} />' },
    // null/undefined on non-key props is fine
    { code: '<App foo={null} />' },
    { code: '<App foo={undefined} />' },
  ],
  invalid: [
    {
      code: '<App key={null} />',
      errors: [{ messageId: 'nullishKey', data: { value: 'null' } }],
    },
    {
      code: '<App key={undefined} />',
      errors: [{ messageId: 'nullishKey', data: { value: 'undefined' } }],
    },
    {
      code: '[1, 2, 3].map(x => <App key={null} />)',
      errors: [{ messageId: 'nullishKey', data: { value: 'null' } }],
    },
    {
      code: '[1, 2, 3].map(x => <App key={undefined} />)',
      errors: [{ messageId: 'nullishKey', data: { value: 'undefined' } }],
    },
  ],
});
