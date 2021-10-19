/**
 * @fileoverview Prevent usage of `javascript:` URLs
 * @author Sergei Startsev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-script-url');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('jsx-no-script-url', rule, {
  valid: parsers.all([
    { code: '<a href="https://reactjs.org"></a>' },
    { code: '<a href="mailto:foo@bar.com"></a>' },
    { code: '<a href="#"></a>' },
    { code: '<a href=""></a>' },
    { code: '<a name="foo"></a>' },
    { code: '<a href={"javascript:"}></a>' },
    { code: '<Foo href="javascript:"></Foo>' },
    { code: '<a href />' },
  ]),
  invalid: parsers.all([
    {
      code: '<a href="javascript:"></a>',
      errors: [{ messageId: 'noScriptURL' }],
    },
    {
      code: '<a href="javascript:void(0)"></a>',
      errors: [{ messageId: 'noScriptURL' }],
    },
    {
      code: '<a href="j\n\n\na\rv\tascript:"></a>',
      errors: [{ messageId: 'noScriptURL' }],
    },
    {
      code: '<Foo to="javascript:"></Foo>',
      errors: [{ messageId: 'noScriptURL' }],
      options: [
        [{ name: 'Foo', props: ['to', 'href'] }],
      ],
    },
    {
      code: '<Foo href="javascript:"></Foo>',
      errors: [{ messageId: 'noScriptURL' }],
      options: [
        [{ name: 'Foo', props: ['to', 'href'] }],
      ],
    },
    {
      code: `
      <div>
        <Foo href="javascript:"></Foo>
        <Bar link="javascript:"></Bar>
      </div>
    `,
      errors: [
        { messageId: 'noScriptURL' },
        { messageId: 'noScriptURL' },
      ],
      options: [
        [
          { name: 'Foo', props: ['to', 'href'] },
          { name: 'Bar', props: ['link'] },
        ],
      ],
    },
  ]),
});
