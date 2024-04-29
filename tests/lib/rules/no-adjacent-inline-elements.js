/**
 * @fileoverview Tests for no-adjacent-inline-elements
 * @author Sean Hayes
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-adjacent-inline-elements');
const parsers = require('../../helpers/parsers');

const languageOptions = {
  ecmaVersion: 6,
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-adjacent-inline-elements', rule, {
  valid: parsers.all([
    {
      code: '<div />;',
      languageOptions,
    },
    {
      code: '<div><div></div><div></div></div>;',
      languageOptions,
    },
    {
      code: '<div><p></p><div></div></div>;',
      languageOptions,
    },
    {
      code: '<div><p></p><a></a></div>;',
      languageOptions,
    },
    {
      code: '<div><a></a>&nbsp;<a></a></div>;',
      languageOptions,
      features: ['no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      code: '<div><a></a>&nbsp;some text &nbsp; <a></a></div>;',
      languageOptions,
    },
    {
      code: '<div><a></a>&nbsp;some text <a></a></div>;',
      languageOptions,
    },
    {
      code: '<div><a></a> <a></a></div>;',
      languageOptions,
    },
    {
      code: '<div><ul><li><a></a></li><li><a></a></li></ul></div>;',
      languageOptions,
    },
    {
      code: '<div><a></a> some text <a></a></div>;',
      languageOptions,
    },
    {
      code: 'React.createElement("div", null, "some text");',
      languageOptions,
    },
    {
      code: ('React.createElement("div", undefined, [React.createElement("a"), " some text ", React.createElement("a")]);'),
      languageOptions,
    },
    {
      code: 'React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);',
      languageOptions,
    },
    {
      code: 'React.createElement(a, b);',
      languageOptions,
    },
  ]),
  invalid: parsers.all([
    {
      code: '<div><a></a><a></a></div>;',
      errors: [{ messageId: 'inlineElement' }],
      languageOptions,
    },
    {
      code: '<div><a></a><span></span></div>;',
      errors: [{ messageId: 'inlineElement' }],
      languageOptions,
    },
    {
      code: 'React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);',
      errors: [{ messageId: 'inlineElement' }],
      languageOptions,
    },
  ]),
});
