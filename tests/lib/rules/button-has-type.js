/**
 * @fileoverview Forbid "button" element without an explicit "type" attribute
 * @author Filipp Riabchun
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/button-has-type');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('button-has-type', rule, {
  valid: [
    {code: '<span/>'},
    {code: '<span type="foo"/>'},
    {code: '<button type="button"/>'},
    {code: '<button type="submit"/>'},
    {code: '<button type="reset"/>'},
    {
      code: '<button type="button"/>',
      options: [{reset: false}]
    },
    {code: 'React.createElement("span")'},
    {code: 'React.createElement("span", {type: "foo"})'},
    {code: 'React.createElement("button", {type: "button"})'},
    {code: 'React.createElement("button", {type: "submit"})'},
    {code: 'React.createElement("button", {type: "reset"})'},
    {
      code: 'React.createElement("button", {type: "button"})',
      options: [{reset: false}]
    },
    {
      code: 'document.createElement("button")'
    },
    {
      code: 'Foo.createElement("span")',
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    }
  ],
  invalid: [
    {
      code: '<button/>',
      errors: [{
        message: 'Missing an explicit type attribute for button'
      }]
    },
    {
      code: '<button type="foo"/>',
      errors: [{
        message: '"foo" is an invalid value for button type attribute'
      }]
    },
    {
      code: '<button type={foo}/>',
      errors: [{
        message: '`foo` is an invalid value for button type attribute'
      }]
    },
    {
      code: '<button type="reset"/>',
      options: [{reset: false}],
      errors: [{
        message: '"reset" is a forbidden value for button type attribute'
      }]
    },
    {
      code: 'React.createElement("button")',
      errors: [{
        message: 'Missing an explicit type attribute for button'
      }]
    },
    {
      code: 'React.createElement("button", {type: "foo"})',
      errors: [{
        message: '"foo" is an invalid value for button type attribute'
      }]
    },
    {
      code: 'React.createElement("button", {type: "reset"})',
      options: [{reset: false}],
      errors: [{
        message: '"reset" is a forbidden value for button type attribute'
      }]
    },
    {
      code: 'Foo.createElement("button")',
      errors: [{
        message: 'Missing an explicit type attribute for button'
      }],
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    }
  ]
});
