/**
 * @fileoverview Tests for forbid-elements
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/forbid-elements');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-elements', rule, {
  valid: [
    {
      code: '<button />',
      options: []
    },
    {
      code: '<button />',
      options: [{forbid: []}]
    },
    {
      code: '<Button />',
      options: [{forbid: ['button']}]
    },
    {
      code: '<Button />',
      options: [{forbid: [{element: 'button'}]}]
    },
    {
      code: 'React.createElement(button)',
      options: [{forbid: ['button']}]
    },
    {
      code: 'createElement("button")',
      options: [{forbid: ['button']}]
    },
    {
      code: 'NotReact.createElement("button")',
      options: [{forbid: ['button']}]
    },
    {
      code: 'React.createElement("_thing")',
      options: [{forbid: ['_thing']}]
    },
    {
      code: 'React.createElement("Modal")',
      options: [{forbid: ['Modal']}]
    },
    {
      code: 'React.createElement("dotted.component")',
      options: [{forbid: ['dotted.component']}]
    },
    {
      code: 'React.createElement(function() {})',
      options: [{forbid: ['button']}]
    },
    {
      code: 'React.createElement({})',
      options: [{forbid: ['button']}]
    },
    {
      code: 'React.createElement(1)',
      options: [{forbid: ['button']}]
    }
  ],

  invalid: [
    {
      code: '<button />',
      options: [{forbid: ['button']}],
      errors: [{message: '<button> is forbidden'}]
    },
    {
      code: '[<Modal />, <button />]',
      options: [{forbid: ['button', 'Modal']}],
      errors: [
        {message: '<Modal> is forbidden'},
        {message: '<button> is forbidden'}
      ]
    },
    {
      code: '<dotted.component />',
      options: [{forbid: ['dotted.component']}],
      errors: [
        {message: '<dotted.component> is forbidden'}
      ]
    },
    {
      code: '<dotted.Component />',
      options: [{forbid: [
        {element: 'dotted.Component', message: 'that ain\'t cool'}
      ]}],
      errors: [{message: '<dotted.Component> is forbidden, that ain\'t cool'}]
    },
    {
      code: '<button />',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'}
      ]}],
      errors: [{message: '<button> is forbidden, use <Button> instead'}]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: [{element: 'button'}, {element: 'input'}]}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: [{element: 'button'}, 'input']}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button><input /></button>',
      options: [{forbid: ['input', {element: 'button'}]}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    },
    {
      code: '<button />',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'},
        {element: 'button', message: 'use <Button2> instead'}
      ]}],
      errors: [{message: '<button> is forbidden, use <Button2> instead'}]
    },
    {
      code: 'React.createElement("button", {}, child)',
      options: [{forbid: ['button']}],
      errors: [{message: '<button> is forbidden'}]
    },
    {
      code: '[React.createElement(Modal), React.createElement("button")]',
      options: [{forbid: ['button', 'Modal']}],
      errors: [
        {message: '<Modal> is forbidden'},
        {message: '<button> is forbidden'}
      ]
    },
    {
      code: 'React.createElement(dotted.Component)',
      options: [{forbid: [
        {element: 'dotted.Component', message: 'that ain\'t cool'}
      ]}],
      errors: [{message: '<dotted.Component> is forbidden, that ain\'t cool'}]
    },
    {
      code: 'React.createElement(dotted.component)',
      options: [{forbid: ['dotted.component']}],
      errors: [
        {message: '<dotted.component> is forbidden'}
      ]
    },
    {
      code: 'React.createElement(_comp)',
      options: [{forbid: ['_comp']}],
      errors: [
        {message: '<_comp> is forbidden'}
      ]
    },
    {
      code: 'React.createElement("button")',
      options: [{forbid: [
        {element: 'button', message: 'use <Button> instead'}
      ]}],
      errors: [{message: '<button> is forbidden, use <Button> instead'}]
    },
    {
      code: 'React.createElement("button", {}, React.createElement("input"))',
      options: [{forbid: [{element: 'button'}, {element: 'input'}]}],
      errors: [
        {message: '<button> is forbidden'},
        {message: '<input> is forbidden'}
      ]
    }
  ]
});
