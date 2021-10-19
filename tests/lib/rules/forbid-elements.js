/**
 * @fileoverview Tests for forbid-elements
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-elements');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('forbid-elements', rule, {
  valid: parsers.all([
    {
      code: '<button />',
      options: [],
    },
    {
      code: '<button />',
      options: [{ forbid: [] }],
    },
    {
      code: '<Button />',
      options: [{ forbid: ['button'] }],
    },
    {
      code: '<Button />',
      options: [{ forbid: [{ element: 'button' }] }],
    },
    {
      code: 'React.createElement(button)',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'createElement("button")',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'NotReact.createElement("button")',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'React.createElement("_thing")',
      options: [{ forbid: ['_thing'] }],
    },
    {
      code: 'React.createElement("Modal")',
      options: [{ forbid: ['Modal'] }],
    },
    {
      code: 'React.createElement("dotted.component")',
      options: [{ forbid: ['dotted.component'] }],
    },
    {
      code: 'React.createElement(function() {})',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'React.createElement({})',
      options: [{ forbid: ['button'] }],
    },
    {
      code: 'React.createElement(1)',
      options: [{ forbid: ['button'] }],
    },
  ]),

  invalid: parsers.all([
    {
      code: '<button />',
      options: [{ forbid: ['button'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: '[<Modal />, <button />]',
      options: [{ forbid: ['button', 'Modal'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'Modal' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: '<dotted.component />',
      options: [{ forbid: ['dotted.component'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'dotted.component' },
        },
      ],
    },
    {
      code: '<dotted.Component />',
      options: [
        {
          forbid: [
            { element: 'dotted.Component', message: 'that ain\'t cool' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'dotted.Component', message: 'that ain\'t cool' },
        },
      ],
    },
    {
      code: '<button />',
      options: [
        {
          forbid: [
            { element: 'button', message: 'use <Button> instead' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'button', message: 'use <Button> instead' },
        },
      ],
    },
    {
      code: '<button><input /></button>',
      options: [
        {
          forbid: [
            { element: 'button' },
            { element: 'input' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
    {
      code: '<button><input /></button>',
      options: [{ forbid: [{ element: 'button' }, 'input'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
    {
      code: '<button><input /></button>',
      options: [{ forbid: ['input', { element: 'button' }] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
    {
      code: '<button />',
      options: [
        {
          forbid: [
            { element: 'button', message: 'use <Button> instead' },
            { element: 'button', message: 'use <Button2> instead' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'button', message: 'use <Button2> instead' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {}, child)',
      options: [{ forbid: ['button'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: '[React.createElement(Modal), React.createElement("button")]',
      options: [{ forbid: ['button', 'Modal'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'Modal' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
      ],
    },
    {
      code: 'React.createElement(dotted.Component)',
      options: [
        {
          forbid: [
            { element: 'dotted.Component', message: 'that ain\'t cool' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'dotted.Component', message: 'that ain\'t cool' },
        },
      ],
    },
    {
      code: 'React.createElement(dotted.component)',
      options: [{ forbid: ['dotted.component'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'dotted.component' },
        },
      ],
    },
    {
      code: 'React.createElement(_comp)',
      options: [{ forbid: ['_comp'] }],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: '_comp' },
        },
      ],
    },
    {
      code: 'React.createElement("button")',
      options: [
        {
          forbid: [
            { element: 'button', message: 'use <Button> instead' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement_message',
          data: { element: 'button', message: 'use <Button> instead' },
        },
      ],
    },
    {
      code: 'React.createElement("button", {}, React.createElement("input"))',
      options: [
        {
          forbid: [
            { element: 'button' }, { element: 'input' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'forbiddenElement',
          data: { element: 'button' },
        },
        {
          messageId: 'forbiddenElement',
          data: { element: 'input' },
        },
      ],
    },
  ]),
});
