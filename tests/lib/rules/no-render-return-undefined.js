/**
 * @fileoverview Tests for no-danger
 * @author Akul Srivastava
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
              const App = () => {
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
    {
      code: `
            function App() {
                return <Component></Component>;
            }
        `,
    },
    {
      code: `
            function App() {
                return (
                  <Component>
                    <ABC />
                  </Component>
                );
            }
        `,
    },
    {
      code: `
            const ui = <Component />;
            function App() {
                return ui;
            }
        `,
    },
    {
      code: `
            function App() {
                return [<div/>, <span/>];
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
            const App = () => {}
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return;
            }
        `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            const App = () => {
              return;
            }
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
            const App = () => {
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
    {
      code: `
            function App() {
                return [undefined, undefined];
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function foo() {}

            function App() {
                return foo();
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return
                <div />
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return
                []
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return
                123
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return
                "abc"
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
    {
      code: `
            function App() {
                return; <div />;
            }
          `,
      errors: [{ messageId: 'returnsUndefined' }],
    },
  ]),
});
