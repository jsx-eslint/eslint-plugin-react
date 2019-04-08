/**
 * @fileoverview Tests for jsx-quoted-string-props
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-quoted-string-props');
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

function errMessage(propName) {
  return `String literal value for property '${propName}' shouldn't be wrapped as an expression`;
}

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-quoted-string-props', rule, {
  valid: [
    {
      code: `
        <div id="foobar" />
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div>{'foobar'}</div>
       `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div prop={0} />
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div prop={true} />
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div prop={['foobar']} />
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div prop={'foobar'.toString()} />
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div prop={'foobar' + ''} />
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <div prop />
      `,
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: `
        <div id={'foobar'} />
      `,
      parser: 'babel-eslint',
      errors: [{message: errMessage('id')}]
    }
  ]
});
