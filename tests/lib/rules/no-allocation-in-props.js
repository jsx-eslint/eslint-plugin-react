/**
 * @fileoverview Disallow array and object literals as props values.
 * @author alexzherdev
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-allocation-in-props');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-allocation-in-props', rule, {

  valid: [
    // Not covered by the rule
    {
      code: '<Foo onClick={foo} />'
    },
    {
      code: '<Foo onClick={foo} />',
      parser: 'babel-eslint'
    },

    // ignore DOM components
    {
      code: '<div style={{ foo: 1 }}></div>',
      options: [{ignoreDOMComponents: true}]
    },
    {
      code: '<div style={{ foo: 1 }}></div>',
      options: [{ignoreDOMComponents: true}],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const style = { foo: 1 };
            return <div style={style}></div>;
          }
        };
      `,
      options: [{ignoreDOMComponents: true}]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const style = { foo: 1 };
            return <div style={style}></div>;
          }
        };
      `,
      options: [{ignoreDOMComponents: true}],
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    // arrays
    {
      code: '<Foo onClick={[1, 2, 3]} />',
      errors: [{message: 'JSX props should not use array allocations'}]
    },
    {
      code: '<Foo onClick={[1, 2, 3]} />',
      errors: [{message: 'JSX props should not use array allocations'}],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = [1, 2, 3];
            return <Foo bar={bar} />;
          }
        };
      `,
      errors: [{message: 'JSX props should not use array allocations'}]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = [1, 2, 3];
            return <Foo bar={bar} />;
          }
        };
      `,
      errors: [{message: 'JSX props should not use array allocations'}],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = [1, 2, 3];
            const renderFoo = () => {
              return <Foo bar={bar} />;
            };
            return renderFoo();
          }
        };
      `,
      errors: [{message: 'JSX props should not use array allocations'}]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = [1, 2, 3];
            const renderFoo = () => {
              return <Foo bar={bar} />;
            };
            return renderFoo();
          }
        };
      `,
      errors: [{message: 'JSX props should not use array allocations'}],
      parser: 'babel-eslint'
    },

    // objects
    {
      code: '<Foo onClick={{ foo: 1 }} />',
      errors: [{message: 'JSX props should not use object allocations'}]
    },
    {
      code: '<Foo onClick={{ foo: 1 }} />',
      errors: [{message: 'JSX props should not use object allocations'}],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const style = { foo: 1 };
            return <div style={style}>Hello {this.state.name}</div>;
          }
        };
      `,
      errors: [{message: 'JSX props should not use object allocations'}]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const style = { foo: 1 };
            return <div style={style}>Hello {this.state.name}</div>;
          }
        };
      `,
      errors: [{message: 'JSX props should not use object allocations'}],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = { foo: 1 };
            return <Foo bar={bar} />;
          }
        };
      `,
      errors: [{message: 'JSX props should not use object allocations'}]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = { foo: 1 };
            return <Foo bar={bar} />;
          }
        };
      `,
      errors: [{message: 'JSX props should not use object allocations'}],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = { foo: 1 };
            const renderFoo = () => {
              return <Foo bar={bar} />;
            };
            return renderFoo();
          }
        };
      `,
      errors: [{message: 'JSX props should not use object allocations'}]
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const bar = { foo: 1 };
            const renderFoo = () => {
              return <Foo bar={bar} />;
            };
            return renderFoo();
          }
        };
      `,
      errors: [{message: 'JSX props should not use object allocations'}],
      parser: 'babel-eslint'
    }
  ]
});
