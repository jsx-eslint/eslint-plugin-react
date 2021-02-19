/**
 * @fileoverview Enforce a new line after jsx elements and expressions
 * @author Johnny Zabala
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-newline');
const parsers = require('../../helpers/parsers');

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

const tests = {
  valid: [
    `
    <div>
     <Button>{data.label}</Button>
     <List /> 
    </div>
    `
  ],
  invalid: [
    {
      code: `
        <>
          <Button>{data.label}</Button>
          <span>Should be in new line</span>
        </>
      `,
      output: `
        <>
          <Button>{data.label}</Button>
          <span>Should be in new line</span>
        </>
      `,
      errors: [
        {message: 'JSX element should start in a new line'}
      ]
    }
  ]
};

new RuleTester({parserOptions}).run('jsx-no-newline', rule, tests);

const ruleTester = new RuleTester({parserOptions, parser: parsers['@TYPESCRIPT_ESLINT']});
ruleTester.run('jsx-no-newline', rule, {valid: parsers.TS(tests.valid), invalid: parsers.TS(tests.invalid)});
