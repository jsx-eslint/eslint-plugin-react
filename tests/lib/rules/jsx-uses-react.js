/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../helpers/getESLintCoreRule')('no-unused-vars');

const RuleTester = require('../../helpers/ruleTester');
const getRuleDefiner = require('../../helpers/getRuleDefiner');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  react: {
    pragma: 'Foo',
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
const ruleDefiner = getRuleDefiner(ruleTester);
ruleDefiner.defineRule('react/jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));

ruleTester.run('no-unused-vars', rule, {
  valid: parsers.all([
    { code: '/*eslint react/jsx-uses-react:1*/ var React; <div />;' },
    { code: '/*eslint react/jsx-uses-react:1*/ var React; (function () { <div /> })();' },
    { code: '/*eslint react/jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;' },
    {
      code: '/*eslint react/jsx-uses-react:1*/ var Foo; <div />;',
      settings,
    },
    {
      code: '/*eslint react/jsx-uses-react:1*/ var Frag; <></>;',
      settings: { react: { fragment: 'Frag' } },
      features: ['fragment'],
    },
    {
      code: '/*eslint react/jsx-uses-react:1*/ var React; <></>;',
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: fix for typescript-eslint
    },
  ].map(parsers.disableNewTS)),
  invalid: parsers.all([
    {
      code: '/*eslint react/jsx-uses-react:1*/ var React;',
      errors: [{ message: '\'React\' is defined but never used.' }],
    },
    {
      code: '/*eslint react/jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
      errors: [{ message: '\'React\' is defined but never used.' }],
    },
    {
      code: '/*eslint react/jsx-uses-react:1*/ var React; <div />;',
      errors: [{ message: '\'React\' is defined but never used.' }],
      settings,
    },
    {
      code: '/*eslint react/jsx-uses-react:1*/ var Frag; <></>;',
      errors: [{ message: '\'Frag\' is defined but never used.' }],
      features: ['fragment'],
      settings: { react: { fragment: 'Fragment' } },
    },
    {
      code: '/*eslint react/jsx-uses-react:1*/ var React; <></>;',
      features: ['fragment'],
      errors: [{ message: '\'React\' is defined but never used.' }],
      settings,
    },
  ].map(parsers.disableNewTS)),
});
