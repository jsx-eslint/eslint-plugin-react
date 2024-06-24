/**
 * @fileoverview Enforce the use of the 'onChange' or 'readonly' attribute when 'checked' is used'
 * @author Jaesoekjjang
 */

'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/checked-requires-onchange-or-readonly');

const parsers = require('../../helpers/parsers');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('checked-requires-onchange-or-readonly', rule, {
  valid: parsers.all([
    '<input type="checkbox" />',
    '<input type="checkbox" onChange={noop} />',
    '<input type="checkbox" readOnly />',
    '<input type="checkbox" checked onChange={noop} />',
    '<input type="checkbox" checked={true} onChange={noop} />',
    '<input type="checkbox" checked={false} onChange={noop} />',
    '<input type="checkbox" checked readOnly />',
    '<input type="checkbox" checked={true} readOnly />',
    '<input type="checkbox" checked={false} readOnly />',
    '<input type="checkbox" defaultChecked />',
    "React.createElement('input')",
    "React.createElement('input', { checked: true, onChange: noop })",
    "React.createElement('input', { checked: false, onChange: noop })",
    "React.createElement('input', { checked: true, readOnly: true })",
    "React.createElement('input', { checked: true, onChange: noop, readOnly: true })",
    "React.createElement('input', { checked: foo, onChange: noop, readOnly: true })",
    {
      code: '<input type="checkbox" checked />',
      options: [{ ignoreMissingProperties: true }],
    },
    {
      code: '<input type="checkbox" checked={true} />',
      options: [{ ignoreMissingProperties: true }],
    },
    {
      code: '<input type="checkbox" onChange={noop} checked defaultChecked />',
      options: [{ ignoreExclusiveCheckedAttribute: true }],
    },
    {
      code: '<input type="checkbox" onChange={noop} checked={true} defaultChecked />',
      options: [{ ignoreExclusiveCheckedAttribute: true }],
    },
    {
      code: '<input type="checkbox" onChange={noop} checked defaultChecked />',
      options: [{ ignoreMissingProperties: true, ignoreExclusiveCheckedAttribute: true }],
    },
    '<span/>',
    "React.createElement('span')",
    '(()=>{})()',
  ]),
  invalid: parsers.all([
    {
      code: '<input type="radio" checked />',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: '<input type="radio" checked={true} />',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: '<input type="checkbox" checked />',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: '<input type="checkbox" checked={true} />',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: '<input type="checkbox" checked={condition ? true : false} />',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: '<input type="checkbox" checked defaultChecked />',
      errors: [
        { messageId: 'exclusiveCheckedAttribute' },
        { messageId: 'missingProperty' },
      ],
    },
    {
      code: 'React.createElement("input", { checked: false })',
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: 'React.createElement("input", { checked: true, defaultChecked: true })',
      errors: [
        { messageId: 'exclusiveCheckedAttribute' },
        { messageId: 'missingProperty' },
      ],
    },
    {
      code: '<input type="checkbox" checked defaultChecked />',
      options: [{ ignoreMissingProperties: true }],
      errors: [{ messageId: 'exclusiveCheckedAttribute' }],
    },
    {
      code: '<input type="checkbox" checked defaultChecked />',
      options: [{ ignoreExclusiveCheckedAttribute: true }],
      errors: [{ messageId: 'missingProperty' }],
    },
    {
      code: '<input type="checkbox" checked defaultChecked />',
      options: [{ ignoreMissingProperties: false, ignoreExclusiveCheckedAttribute: false }],
      errors: [
        { messageId: 'exclusiveCheckedAttribute' },
        { messageId: 'missingProperty' },
      ],
    },
  ]),
});
