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

const ERROR = rule.ERROR;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-adjacent-inline-elements', rule, {
  valid: [
    {
      code: '<div />;',
      parserOptions
    },
    {
      code: '<div><div></div><div></div></div>;',
      parserOptions
    },
    {
      code: '<div><p></p><div></div></div>;',
      parserOptions
    },
    {
      code: '<div><p></p><a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a>&nbsp;<a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a>&nbsp;some text &nbsp; <a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a>&nbsp;some text <a></a></div>;',
      parserOptions
    },
    {
      code: '<div><a></a> <a></a></div>;',
      parserOptions
    },
    {
      code: '<div><ul><li><a></a></li><li><a></a></li></ul></div>;',
      parserOptions
    },
    {
      code: '<div><a></a> some text <a></a></div>;',
      errors: [{message: ERROR}],
      parserOptions
    },
    {
      code: ('React.createElement("div", undefined, [React.createElement("a"), ' +
        '" some text ", React.createElement("a")]);'),
      errors: [{message: ERROR}],
      parserOptions
    },
    {
      code: 'React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);',
      errors: [{message: ERROR}],
      parserOptions
    }
  ],
  invalid: [
    {
      code: '<div><a></a><a></a></div>;',
      errors: [{message: ERROR}],
      parserOptions
    },
    {
      code: '<div><a></a><span></span></div>;',
      errors: [{message: ERROR}],
      parserOptions
    },
    {
      code: 'React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);',
      errors: [{message: ERROR}],
      parserOptions
    }
  ]
});
