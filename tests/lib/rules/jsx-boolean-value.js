/**
 * @fileoverview Enforce boolean attributes notation in JSX
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
    {
      code: '<App />;',
      options: ['never', { assumeUndefinedIsFalse: true }],
    },
    {
      code: '<App foo={false} />;',
      options: ['never', { assumeUndefinedIsFalse: false }],
    },
    {
      code: '<App foo={false} />;',
      options: ['never', { assumeUndefinedIsFalse: true, always: ['foo'] }],
    },
  ]),
  invalid: parsers.all([
    {
      code: '<App foo={true} />;',
      output: '<App foo />;',
      options: ['never'],
      errors: [
        {
          messageId: 'omitBoolean',
          data: { propName: 'foo' },
        },
      ],
    },
    {
      code: '<App foo={true} bar={true} baz={true} />;',
      output: '<App foo bar baz={true} />;',
      options: ['always', { never: ['foo', 'bar'] }],
      errors: [
        {
          messageId: 'omitBoolean',
          data: { propName: 'foo' },
        },
        {
          messageId: 'omitBoolean',
          data: { propName: 'bar' },
        },
      ],
    },
    {
      code: '<App foo={true} />;',
      output: '<App foo />;',
      errors: [
        {
          messageId: 'omitBoolean',
          data: { propName: 'foo' },
        },
      ],
    },
    {
      code: '<App foo = {true} />;',
      output: '<App foo />;',
      errors: [
        {
          messageId: 'omitBoolean',
          data: { propName: 'foo' },
        },
      ],
    },
    {
      code: '<App foo />;',
      output: '<App foo={true} />;',
      options: ['always'],
      errors: [
        {
          messageId: 'setBoolean',
          data: { propName: 'foo' },
        },
      ],
    },
    {
      code: '<App foo bar baz />;',
      output: '<App foo={true} bar={true} baz />;',
      options: ['never', { always: ['foo', 'bar'] }],
      errors: [
        {
          messageId: 'setBoolean',
          data: { propName: 'foo' },
        },
        {
          messageId: 'setBoolean',
          data: { propName: 'bar' },
        },
      ],
    },
    {
      code: '<App foo={false} bak={false} />;',
      output: '<App   />;',
      options: ['never', { assumeUndefinedIsFalse: true }],
      errors: [
        {
          messageId: 'omitPropAndBoolean',
          data: { propName: 'foo' },
        },
        {
          messageId: 'omitPropAndBoolean',
          data: { propName: 'bak' },
        },
      ],
    },
    {
      code: '<App foo={true} bak={false} />;',
      output: '<App foo  />;',
      options: ['never', { assumeUndefinedIsFalse: true }],
      errors: [
        {
          messageId: 'omitBoolean',
          data: { propName: 'foo' },
        },
        {
          messageId: 'omitPropAndBoolean',
          data: { propName: 'bak' },
        },
      ],
    },
    {
      code: '<App foo={true} bar={false} baz={false} bak={false} />;',
      output: '<App foo={true} bar={false}   />;',
      options: [
        'always',
        { assumeUndefinedIsFalse: true, never: ['baz', 'bak'] },
      ],
      errors: [
        {
          messageId: 'omitPropAndBoolean',
          data: { propName: 'baz' },
        },
        {
          messageId: 'omitPropAndBoolean',
          data: { propName: 'bak' },
        },
      ],
    },
    {
      code: '<App foo={true} bar={true} baz />;',
      output: '<App foo bar baz={true} />;',
      options: ['always', { never: ['foo', 'bar'] }],
      errors: [
        {
          messageId: 'omitBoolean',
          data: { propName: 'foo' },
        },
        {
          messageId: 'omitBoolean',
          data: { propName: 'bar' },
        },
        {
          messageId: 'setBoolean',
          data: { propName: 'baz' },
        },
      ],
    },
  ]),
});
