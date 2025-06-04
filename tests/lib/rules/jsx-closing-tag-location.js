/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-closing-tag-location');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 2022,
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-closing-tag-location', rule, {
  valid: parsers.all([
    {
      code: `
        const foo = () => {
          return <App>
       bar</App>
        }
      `,
      options: [{ location: 'line-aligned' }],
    },
    {
      code: `
        const foo = () => {
          return <App>
              bar</App>
        }
      `,
    },
    {
      code: `
        const foo = () => {
          return <App>
              bar
          </App>
        }
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        const foo = <App>
              bar
        </App>
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        const x = <App>
              foo
                  </App>
      `,
    },
    {
      code: `
        const foo =
          <App>
              bar
          </App>
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        const foo =
          <App>
              bar
          </App>
      `,
    },
    {
      code: `
        <App>
          foo
        </App>
      `,
    },
    {
      code: `
        <App>
          foo
        </App>
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        <App>foo</App>
      `,
    },
    {
      code: `
        <>
          foo
        </>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <>foo</>
      `,
      features: ['fragment'],
    },
  ]),

  invalid: parsers.all([
    {
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
      errors: [{ messageId: 'matchIndent' }],
    },
    {
      code: `
        <App>
          foo</App>
      `,
      output: `
        <App>
          foo
        </App>
      `,
      errors: [{ messageId: 'onOwnLine' }],
    },
    {
      code: `
        <>
          foo
          </>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        <>
          foo
        </>
      `,
      errors: [{ messageId: 'matchIndent' }],
    },
    {
      code: `
        <>
          foo</>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        <>
          foo
        </>
      `,
      errors: [{ messageId: 'onOwnLine' }],
    },
    {
      code: `
        const x = () => {
          return <App>
              foo</App>
        }
      `,
      output: `
        const x = () => {
          return <App>
              foo
          </App>
        }
      `,
      errors: [{ messageId: 'onOwnLine' }],
      options: ['line-aligned'],
    },
    {
      code: `
        const x = <App>
              foo
                  </App>
      `,
      output: `
        const x = <App>
              foo
        </App>
      `,
      errors: [{ messageId: 'alignWithOpening' }],
      options: ['line-aligned'],
    },
  ]),
});
