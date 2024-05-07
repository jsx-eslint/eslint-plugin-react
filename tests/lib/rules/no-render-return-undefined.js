/**
 * @fileoverview Tests for no-danger
 * @author Scott Andrews
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-render-return-undefined');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-render-return-undefined', rule, {
  valid: parsers.all([
    {
      code: `
              function App() {
                  return 123;
              }
          `,
    },
    {
      code: `
            function App() {
                return 'Hello World';
            }
        `,
    },
    {
      code: `
            function App() {
                return null;
            }
        `,
    },
    {
      code: `
            function App() {
                return [];
            }
        `,
    },
    {
      code: `
            function App() {
                return <div />;
            }
        `,
    },
    {
      code: `
            function App() {
                return <div></div>;
            }
        `,
    },
    {
      code: `
            function App() {
                return <div>Hello World</div>;
            }
        `,
    },
    {
      code: `
            function App() {
                return <Component />;
            }
        `,
    },
  ]),
  invalid: parsers.all([
    {
      code: `
            function App() {}
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return undefined;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                const toReturn = undefined;
                return toReturn;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                var toReturn;
                return toReturn;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                let toReturn;
                return toReturn;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            var foo;
            function App() {
                return foo;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            let foo;
            function App() {
                return foo;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
              function App() {
                  return [undefined];
              }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
  ]),
});
