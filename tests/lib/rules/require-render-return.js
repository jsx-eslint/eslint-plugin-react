/**
 * @fileoverview Enforce ES5 or ES6 class for returning value in render function.
 * @author Mark Orel
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/require-render-return');

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
ruleTester.run('require-render-return', rule, {
  valid: parsers.all([
    {
      // ES6 class
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      // ES6 class with render property
      code: `
        class Hello extends React.Component {
          render = () => {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      // ES6 class with render property (implicit return)
      code: `
        class Hello extends React.Component {
          render = () => (
            <div>Hello {this.props.name}</div>
          )
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      // ES5 class
      code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div></div>
          }
        });
      `,
    },
    {
      // Stateless function
      code: `
        function Hello() {
          return <div></div>;
        }
      `,
    },
    {
      // Stateless arrow function
      code: `
        var Hello = () => (
          <div></div>
        );
      `,
    },
    {
      // Return in a switch...case
      code: `
        var Hello = createReactClass({
          render: function() {
            switch (this.props.name) {
              case 'Foo':
                return <div>Hello Foo</div>;
              default:
                return <div>Hello {this.props.name}</div>;
            }
          }
        });
      `,
    },
    {
      // Return in a if...else
      code: `
        var Hello = createReactClass({
          render: function() {
            if (this.props.name === 'Foo') {
              return <div>Hello Foo</div>;
            } else {
              return <div>Hello {this.props.name}</div>;
            }
          }
        });
      `,
    },
    {
      // Not a React component
      code: `
        class Hello {
          render() {}
        }
      `,
    },
    {
      // ES6 class without a render method
      code: 'class Hello extends React.Component {}',
    },
    {
      // ES5 class without a render method
      code: 'var Hello = createReactClass({});',
    },
    {
      // ES5 class with an imported render method
      code: `
        var render = require('./render');
        var Hello = createReactClass({
          render
        });
      `,
    },
    {
      // Invalid render method (but accepted by Babel)
      code: `
        class Foo extends Component {
          render
        }
      `,
      features: ['class fields'],
    },
  ]),

  invalid: parsers.all([
    {
      // Missing return in ES5 class
      code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {}
        });
      `,
      errors: [
        {
          messageId: 'noRenderReturn',
          line: 4,
        },
      ],
    },
    {
      // Missing return in ES6 class
      code: `
        class Hello extends React.Component {
          render() {}
        }
      `,
      errors: [{ messageId: 'noRenderReturn' }],
    },
    {
      // Missing return (but one is present in a sub-function)
      code: `
        class Hello extends React.Component {
          render() {
            const names = this.props.names.map(function(name) {
              return <div>{name}</div>
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'noRenderReturn',
          line: 3,
        },
      ],
    },
    {
      // Missing return ES6 class render property
      code: `
        class Hello extends React.Component {
          render = () => {
            <div>Hello {this.props.name}</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'noRenderReturn',
          type: 'ClassProperty',
        },
      ],
    },
  ]),
});
