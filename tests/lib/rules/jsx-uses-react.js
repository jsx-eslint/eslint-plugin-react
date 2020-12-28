/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('eslint/lib/rules/no-unused-vars');

const RuleTester = eslint.RuleTester;

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));

ruleTester.run('no-unused-vars', rule, {
  valid: [].concat(
    {code: '/*eslint jsx-uses-react:1*/ var React; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();'},
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;', settings},
    parsers.TS([
      {code: '/*eslint jsx-uses-react:1*/ var Frag; <></>;', settings: {react: {fragment: 'Frag'}}},
      {code: '/*eslint jsx-uses-react:1*/ var React; <></>;', parser: parsers.BABEL_ESLINT}
    ])
  ),
  invalid: [].concat({
    code: '/*eslint jsx-uses-react:1*/ var React;',
    errors: [{message: '\'React\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
    errors: [{message: '\'React\' is defined but never used.'}]
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <div />;',
    errors: [{message: '\'React\' is defined but never used.'}],
    settings
  }, parsers.TS([{
    code: '/*eslint jsx-uses-react:1*/ var Frag; <></>;',
    errors: [{message: '\'Frag\' is defined but never used.'}],
    parser: parsers.TYPESCRIPT_ESLINT,
    settings: {react: {fragment: 'Fragment'}}
  }, {
    code: '/*eslint jsx-uses-react:1*/ var Frag; <></>;',
    errors: [{message: '\'Frag\' is defined but never used.'}],
    parser: parsers['@TYPESCRIPT_ESLINT'],
    settings: {react: {fragment: 'Fragment'}}
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
    parser: parsers.BABEL_ESLINT,
    errors: [{message: '\'React\' is defined but never used.'}],
    settings
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
    parser: parsers.TYPESCRIPT_ESLINT,
    errors: [{message: '\'React\' is defined but never used.'}],
    settings
  }, {
    code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
    parser: parsers['@TYPESCRIPT_ESLINT'],
    errors: [{message: '\'React\' is defined but never used.'}],
    settings
  }]))
});
