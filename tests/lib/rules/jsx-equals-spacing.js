/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-equals-spacing');

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
ruleTester.run('jsx-equals-spacing', rule, {
  valid: parsers.all([
    {
      code: '<App />',
    },
    {
      code: '<App foo />',
    },
    {
      code: '<App foo="bar" />',
    },
    {
      code: '<App foo={e => bar(e)} />',
    },
    {
      code: '<App {...props} />',
    },
    {
      code: '<App />',
      options: ['never'],
    },
    {
      code: '<App foo />',
      options: ['never'],
    },
    {
      code: '<App foo="bar" />',
      options: ['never'],
    },
    {
      code: '<App foo={e => bar(e)} />',
      options: ['never'],
    },
    {
      code: '<App {...props} />',
      options: ['never'],
    },
    {
      code: '<App />',
      options: ['always'],
    },
    {
      code: '<App foo />',
      options: ['always'],
    },
    {
      code: '<App foo = "bar" />',
      options: ['always'],
    },
    {
      code: '<App foo = {e => bar(e)} />',
      options: ['always'],
    },
    {
      code: '<App {...props} />',
      options: ['always'],
    },
  ]),

  invalid: parsers.all([
    {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      errors: [
        { messageId: 'noSpaceBefore' },
        { messageId: 'noSpaceAfter' },
      ],
    },
    {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceBefore' },
        { messageId: 'noSpaceAfter' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBefore' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceAfter' }],
    },
    {
      code: '<App foo= {bar} bar = {baz} />',
      output: '<App foo={bar} bar={baz} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceAfter' },
        { messageId: 'noSpaceBefore' },
        { messageId: 'noSpaceAfter' },
      ],
    },
    {
      code: '<App foo={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore' },
        { messageId: 'needSpaceAfter' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceAfter' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceBefore' }],
    },
    {
      code: '<App foo={bar} bar ={baz} />',
      output: '<App foo = {bar} bar = {baz} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore' },
        { messageId: 'needSpaceAfter' },
        { messageId: 'needSpaceAfter' },
      ],
    },
  ]),
});
