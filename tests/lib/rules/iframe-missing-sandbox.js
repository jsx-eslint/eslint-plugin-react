/**
 * @fileoverview TBD
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/iframe-missing-sandbox');

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
ruleTester.run('iframe-missing-sandbox', rule, {
  valid: parsers.all([
    { code: '<div sandbox="__unknown__" />;' },

    { code: '<iframe sandbox="" />;' },
    { code: '<iframe sandbox={""} />' },
    { code: 'React.createElement("iframe", { sandbox: "" });' },

    { code: '<iframe src="foo.htm" sandbox></iframe>' },
    { code: 'React.createElement("iframe", { src: "foo.htm", sandbox: true })' },

    { code: '<iframe src="foo.htm" sandbox sandbox></iframe>' },

    { code: '<iframe sandbox="allow-forms"></iframe>' },
    { code: '<iframe sandbox="allow-modals"></iframe>' },
    { code: '<iframe sandbox="allow-orientation-lock"></iframe>' },
    { code: '<iframe sandbox="allow-pointer-lock"></iframe>' },
    { code: '<iframe sandbox="allow-popups"></iframe>' },
    { code: '<iframe sandbox="allow-popups-to-escape-sandbox"></iframe>' },
    { code: '<iframe sandbox="allow-presentation"></iframe>' },
    { code: '<iframe sandbox="allow-same-origin"></iframe>' },
    { code: '<iframe sandbox="allow-scripts"></iframe>' },
    { code: '<iframe sandbox="allow-top-navigation"></iframe>' },
    { code: '<iframe sandbox="allow-top-navigation-by-user-activation"></iframe>' },
    { code: '<iframe sandbox="allow-forms allow-modals"></iframe>' },
    { code: '<iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation"></iframe>' },
    { code: 'React.createElement("iframe", { sandbox: "allow-forms" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-modals" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-orientation-lock" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-pointer-lock" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-popups" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-popups-to-escape-sandbox" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-presentation" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-same-origin" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-scripts" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-top-navigation" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-top-navigation-by-user-activation" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-forms allow-modals" })' },
    { code: 'React.createElement("iframe", { sandbox: "allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation" })' },
  ]),
  invalid: parsers.all([
    {
      code: '<iframe></iframe>;',
      errors: [{ messageId: 'attributeMissing' }],
    },
    {
      code: '<iframe/>;',
      errors: [{ messageId: 'attributeMissing' }],
    },
    {
      code: 'React.createElement("iframe");',
      errors: [{ messageId: 'attributeMissing' }],
    },
    {
      code: 'React.createElement("iframe", {});',
      errors: [{ messageId: 'attributeMissing' }],
    },
    {
      code: 'React.createElement("iframe", null);',
      errors: [{ messageId: 'attributeMissing' }],
    },

    {
      code: '<iframe sandbox="__unknown__"></iframe>',
      errors: [{ messageId: 'invalidValue', data: { value: '__unknown__' } }],
    },
    {
      code: 'React.createElement("iframe", { sandbox: "__unknown__" })',
      errors: [{ messageId: 'invalidValue', data: { value: '__unknown__' } }],
    },

    {
      code: '<iframe sandbox="allow-popups __unknown__"/>',
      errors: [{ messageId: 'invalidValue', data: { value: '__unknown__' } }],
    },
    {
      code: '<iframe sandbox="__unknown__ allow-popups"/>',
      errors: [{ messageId: 'invalidValue', data: { value: '__unknown__' } }],
    },
    {
      code: '<iframe sandbox=" allow-forms __unknown__ allow-popups __unknown__  "/>',
      errors: [
        { messageId: 'invalidValue', data: { value: '__unknown__' } },
        { messageId: 'invalidValue', data: { value: '__unknown__' } },
      ],
    },
    {
      code: '<iframe sandbox="allow-scripts allow-same-origin"></iframe>;',
      errors: [{ messageId: 'invalidCombination' }],
    },
    {
      code: '<iframe sandbox="allow-same-origin allow-scripts"/>;',
      errors: [{ messageId: 'invalidCombination' }],
    },
  ]),
});
