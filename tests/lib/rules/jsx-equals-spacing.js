/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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

  invalid: parsers.all([].concat(
    parsers.skipDueToMultiErrorSorting ? [] : {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      errors: [
        { messageId: 'noSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    parsers.skipDueToMultiErrorSorting ? [] : {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBefore', type: 'JSXAttribute' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceAfter', type: 'JSXAttribute' }],
    },
    parsers.skipDueToMultiErrorSorting ? [] : {
      code: '<App foo= {bar} bar = {baz} />',
      output: '<App foo={bar} bar={baz} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
        { messageId: 'noSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    parsers.skipDueToMultiErrorSorting ? [] : {
      code: '<App foo={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'needSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceAfter', type: 'JSXAttribute' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceBefore', type: 'JSXAttribute' }],
    },
    parsers.skipDueToMultiErrorSorting ? [] : {
      code: '<App foo={bar} bar ={baz} />',
      output: '<App foo = {bar} bar = {baz} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'needSpaceAfter', type: 'JSXAttribute' },
        { messageId: 'needSpaceAfter', type: 'JSXAttribute' },
      ],
    }
  )),
});
