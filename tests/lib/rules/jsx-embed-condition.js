/**
 * @fileoverview Prevents usage of && condition in JSX Embeds.
 * @author Anees Iqbal <i@steelbrain.me>
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const version = require('eslint/package.json').version;
const semver = require('semver');
const rule = require('../../../lib/rules/jsx-embed-condition');
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

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-embed-condition', rule, {
  valid: [].concat({
    code: '<App>Test</App>'
  }, {
    code: '<App test>Another</App>'
  }, {
    code: '<App foo={e => bar(e)}>Hello World</App>'
  }, {
    code: '<App>{x ? <div></div> : null}</App>'
  }, {
    code: '<App>{x ? <div>Hello</div> : null}</App>'
  }, {
    code: '<App>{x ? <div>{y ? <y /> : <z />}</div> : null}</App>'
  }, {
    code: '<App x={x && y}>{x ? <div>{y ? <y /> : <z />}</div> : null}</App>'
  }, semver.satisfies(version, '<= 5') ? [] : [{
    code: '<App test>{x ?? <div />}</App>',
    parserOptions: {
      ecmaVersion: 2020
    }
  }, {
    code: '<App test>{x ?? <div />}</App>',
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: '<App test>{x ?? <div />}</App>',
    parser: parsers['@TYPEDCRIPT_ESLINT']
  }]),

  invalid: [{
    code: '<div>{x && <div />}</div>',
    output: '<div>{x && <div />}</div>',
    errors: [
      {message: 'Using && to condition JSX embeds is forbidden. Convert it to a ternary operation instead'}
    ]
  }, {
    code: '<div>{x ? <div>{y && <div />}</div> : null}</div>',
    output: '<div>{x ? <div>{y && <div />}</div> : null}</div>',
    errors: [
      {message: 'Using && to condition JSX embeds is forbidden. Convert it to a ternary operation instead'}
    ]
  }]
});
