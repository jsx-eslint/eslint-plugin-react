/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-closing-tag-location');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 2015,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-closing-tag-location', rule, {
  valid: [{
    code: `
      <App>
        foo
      </App>
    `
  }, {
    code: `
      <App>foo</App>
    `
  }, {
    code: `
      <>
        foo
      </>
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      <>foo</>
    `,
    parser: parsers.BABEL_ESLINT
  }],

  invalid: [{
    code: `
      <App>
        foo
        </App>
    `,
    output: `
      <App>
        foo
      </App>
    `,
    errors: [{messageId: 'matchIndent'}]
  }, {
    code: `
      <App>
        foo</App>
    `,
    output: `
      <App>
        foo
      </App>
    `,
    errors: [{messageId: 'onOwnLine'}]
  }, {
    code: `
      <>
        foo
        </>
    `,
    parser: parsers.BABEL_ESLINT,
    output: `
      <>
        foo
      </>
    `,
    errors: [{messageId: 'matchIndent'}]
  }, {
    code: `
      <>
        foo</>
    `,
    parser: parsers.BABEL_ESLINT,
    output: `
      <>
        foo
      </>
    `,
    errors: [{messageId: 'onOwnLine'}]
  }]
});
