/**
 * @fileoverview Forbid "button" element without an explicit "type" attribute
 * @author Filipp Riabchun
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/button-has-type');

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
ruleTester.run('button-has-type', rule, {
  valid: parsers.all([
    { code: '<span/>' },
    { code: '<span type="foo"/>' },
    { code: '<button type="button"/>' },
    { code: '<button type="submit"/>' },
    { code: '<button type="reset"/>' },
    { code: '<button type={"button"}/>' },
    { code: '<button type={\'button\'}/>' },
    { code: '<button type={`button`}/>' },
    { code: '<button type={condition ? "button" : "submit"}/>' },
    { code: '<button type={condition ? \'button\' : \'submit\'}/>' },
    { code: '<button type={condition ? `button` : `submit`}/>' },
    {
      code: '<button type="button"/>',
      options: [{ reset: false }],
    },
    { code: 'React.createElement("span")' },
    { code: 'React.createElement("span", {type: "foo"})' },
    { code: 'React.createElement("button", {type: "button"})' },
    { code: 'React.createElement("button", {type: \'button\'})' },
    { code: 'React.createElement("button", {type: `button`})' },
    { code: 'React.createElement("button", {type: "submit"})' },
    { code: 'React.createElement("button", {type: \'submit\'})' },
    { code: 'React.createElement("button", {type: `submit`})' },
    { code: 'React.createElement("button", {type: "reset"})' },
    { code: 'React.createElement("button", {type: \'reset\'})' },
    { code: 'React.createElement("button", {type: `reset`})' },
    { code: 'React.createElement("button", {type: condition ? "button" : "submit"})' },
    { code: 'React.createElement("button", {type: condition ? \'button\' : \'submit\'})' },
    { code: 'React.createElement("button", {type: condition ? `button` : `submit`})' },
    {
      code: 'React.createElement("button", {type: "button"})',
      options: [{ reset: false }],
    },
    {
      code: 'document.createElement("button")',
    },
    {
      code: 'Foo.createElement("span")',
      settings: {
        react: {
          pragma: 'Foo',
        },
      },
    },
  ]),
  invalid: parsers.all([
    {
      code: '<button/>',
      errors: [
        { messageId: 'missingType' },
      ],
    },
    {
      code: '<button type="foo"/>',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: '<button type={foo}/>',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: '<button type={"foo"}/>',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: '<button type={\'foo\'}/>',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: '<button type={`foo`}/>',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: '<button type={`button${foo}`}/>',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: '<button type="reset"/>',
      options: [{ reset: false }],
      errors: [
        {
          messageId: 'forbiddenValue',
          data: { value: 'reset' },
        },
      ],
    },
    {
      code: '<button type={condition ? "button" : foo}/>',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: '<button type={condition ? "button" : "foo"}/>',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: '<button type={condition ? "button" : "reset"}/>',
      options: [{ reset: false }],
      errors: [
        {
          messageId: 'forbiddenValue',
          data: { value: 'reset' },
        },
      ],
    },
    {
      code: '<button type={condition ? foo : "button"}/>',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: '<button type={condition ? "foo" : "button"}/>',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: '<button type={condition ? "reset" : "button"}/>',
      options: [{ reset: false }],
      errors: [
        {
          messageId: 'forbiddenValue',
          data: { value: 'reset' },
        },
      ],
    },
    {
      code: 'React.createElement("button")',
      errors: [
        { messageId: 'missingType' },
      ],
    },
    {
      code: 'React.createElement("button", {type: foo})',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: 'React.createElement("button", {type: "foo"})',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {type: "reset"})',
      options: [{ reset: false }],
      errors: [
        {
          messageId: 'forbiddenValue',
          data: { value: 'reset' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {type: condition ? "button" : foo})',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: 'React.createElement("button", {type: condition ? "button" : "foo"})',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {type: condition ? "button" : "reset"})',
      options: [{ reset: false }],
      errors: [
        {
          messageId: 'forbiddenValue',
          data: { value: 'reset' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {type: condition ? foo : "button"})',
      errors: [
        { messageId: 'complexType' },
      ],
    },
    {
      code: 'React.createElement("button", {type: condition ? "foo" : "button"})',
      errors: [
        {
          messageId: 'invalidValue',
          data: { value: 'foo' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {type: condition ? "reset" : "button"})',
      options: [{ reset: false }],
      errors: [
        {
          messageId: 'forbiddenValue',
          data: { value: 'reset' },
        },
      ],
    },
    {
      code: 'Foo.createElement("button")',
      errors: [
        { messageId: 'missingType' },
      ],
      settings: {
        react: {
          pragma: 'Foo',
        },
      },
    },
    {
      code: 'function Button({ type, ...extraProps }) { const button = type; return <button type={button} {...extraProps} />; }',
      errors: [
        { messageId: 'complexType' },
      ],
    },
  ]),
});
