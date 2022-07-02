/**
 * @fileoverview Enforce JSX inline conditional as a ternary
 * @author Kevin Ingersoll
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-inline-conditional');

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
ruleTester.run('jsx-inline-conditional', rule, {
  valid: parsers.all([
    { code: '<div>{someCondition ? <div></div> : null}</div>' },
    { code: '<div>{someCondition ? <SomeComponent /> : null}</div>' },
    {
      code: '<div>{someCondition ? <div>{anotherCondition ? <SomeComponent /> : null}</div> : null}</div>',
    },
    {
      code: '<div>{someCondition && someOtherCondition ? <SomeComponent /> : null}</div>',
    },
    {
      code: '<div>{possiblyNull ?? <SomeComponent />}</div>',
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    {
      code: '<div>{possiblyNull ?? <SomeComponent />}</div>',
      parser: parsers.TYPESCRIPT_ESLINT,
    },
    {
      code: '<div>{possiblyNull ?? <SomeComponent />}</div>',
      parser: parsers['@TYPESCRIPT_ESLINT'],
    },
  ]),
  invalid: parsers.all([
    {
      code: '<div>{someCondition && <SomeComponent />}</div>',
      output: '<div>{someCondition ? <SomeComponent /> : null}</div>',
      errors: [
        {
          messageId: 'inlineConditional',
        },
      ],
    },
    {
      code: '<div>{someCondition && someOtherCondition && <SomeComponent />}</div>',
      output:
        '<div>{someCondition && someOtherCondition ? <SomeComponent /> : null}</div>',
      errors: [
        {
          messageId: 'inlineConditional',
        },
      ],
    },
  ]),
});
