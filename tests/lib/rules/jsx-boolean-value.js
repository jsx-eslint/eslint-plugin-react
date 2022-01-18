/**
 * @fileoverview Enforce boolean attributes notation in JSX
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-boolean-value');

const parsers = require('../../helpers/parsers');

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
ruleTester.run('jsx-boolean-value', rule, {
  valid: parsers.all([
    {
      code: '<App foo />;',
      options: ['never'],
    },
    {
      code: '<App foo bar={true} />;',
      options: ['always', { never: ['foo'] }],
    },
    {
      code: '<App foo />;',
    },
    {
      code: '<App foo={true} />;',
      options: ['always'],
    },
    {
      code: '<App foo={true} bar />;',
      options: ['never', { always: ['foo'] }],
    },
  ]),
  invalid: parsers.all([
    {
      code: '<App foo={true} />;',
      output: '<App foo />;',
      options: ['never'],
      errors: [
        { messageId: 'omitBoolean_noMessage' },
      ],
    },
    {
      code: '<App foo={true} bar={true} baz={true} />;',
      output: '<App foo bar baz={true} />;',
      options: ['always', { never: ['foo', 'bar'] }],
      errors: [
        {
          messageId: 'omitBoolean',
          data: { exceptionsMessage: ' for the following props: `foo`, `bar`' },
        },
        {
          messageId: 'omitBoolean',
          data: { exceptionsMessage: ' for the following props: `foo`, `bar`' },
        },
      ],
    },
    {
      code: '<App foo={true} />;',
      output: '<App foo />;',
      errors: [
        { messageId: 'omitBoolean_noMessage' },
      ],
    },
    {
      code: '<App foo = {true} />;',
      output: '<App foo />;',
      errors: [
        { messageId: 'omitBoolean_noMessage' },
      ],
    },
    {
      code: '<App foo />;',
      output: '<App foo={true} />;',
      options: ['always'],
      errors: [
        { messageId: 'setBoolean_noMessage' },
      ],
    },
    {
      code: '<App foo bar baz />;',
      output: '<App foo={true} bar={true} baz />;',
      options: ['never', { always: ['foo', 'bar'] }],
      errors: [
        {
          messageId: 'setBoolean',
          data: { exceptionsMessage: ' for the following props: `foo`, `bar`' },
        },
        {
          messageId: 'setBoolean',
          data: { exceptionsMessage: ' for the following props: `foo`, `bar`' },
        },
      ],
    },
  ]),
});
