/**
 * @fileoverview Tests for jsx-sort-functional-props
 * @author IRoninCoder
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-sort-functional-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ERROR_MESSAGE = 'Functional component prop declarations should be sorted alphabetically';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-sort-functional-props', rule, {
  valid: [
    // short
    {
      code: [
        'const First = ({ one, three, two }) => {',
        '  return <div />;',
        '};'
      ].join('\n')
    },
    {
      code: [
        'const First = ({ One, Three, Two }) => {',
        '  return <div />;',
        '};'
      ].join('\n')
    },
    {
      code: [
        'const First = ({ One, two, West }) => {',
        '  return <div />;',
        '};'
      ].join('\n'),
      options: [
        {
          ignoreCase: true
        }
      ]
    },
    // full
    {
      code: [
        'function First ({ one, three, two }) {',
        '  return <div />;',
        '};'
      ].join('\n')
    },
    {
      code: [
        'function First ({ One, Three, Two }) {',
        '  return <div />;',
        '};'
      ].join('\n')
    },
    {
      code: [
        'function First ({ tWO, two, Two }) {',
        '  return <div />;',
        '};'
      ].join('\n'),
      options: [
        {
          ignoreCase: true
        }
      ]
    }
  ],

  invalid: [
    {
      code: [
        'const First = ({ one, two, three }) => {',
        '  return <div />;',
        '};'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 28
        }
      ]
    },
    {
      code: [
        'const First = ({ One, two, Three }) => {',
        '  return <div />;',
        '};'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      options: [
        {
          ignoreCase: true
        }
      ],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 28
        }
      ]
    },
    // full
    {
      code: [
        'function First ({ one, two, three }) {',
        '  return <div />;',
        '};'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 29
        }
      ]
    },
    {
      code: [
        'function First ({ One, Txo, two }) {',
        '  return <div />;',
        '};'
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      options: [
        {
          ignoreCase: true
        }
      ],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 29
        }
      ]
    }
  ]
});
