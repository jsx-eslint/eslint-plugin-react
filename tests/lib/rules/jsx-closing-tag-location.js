/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-closing-tag-location');
const {RuleTester} = require('eslint');
const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const MESSAGE_MATCH_INDENTATION = [{message: 'Expected closing tag to match indentation of opening.'}];

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-closing-tag-location', rule, {
  valid: [{
    code: [
      '<App>',
      '  foo',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>foo</App>'
    ].join('\n')
  }],

  invalid: [{
    code: [
      '<App>',
      '  foo',
      '  </App>'
    ].join('\n'),
    errors: MESSAGE_MATCH_INDENTATION
  }, {
    code: [
      '<App>',
      '  foo</App>'
    ].join('\n'),
    errors: MESSAGE_MATCH_INDENTATION
  }]
});
