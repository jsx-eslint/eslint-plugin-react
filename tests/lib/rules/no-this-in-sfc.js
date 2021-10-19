/**
 * @fileoverview Report "this" being used in stateless functional components.
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-this-in-sfc');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-this-in-sfc', rule, {
  valid: parsers.all([
    {
      code: `
        function Foo(props) {
          const { foo } = props;
          return <div bar={foo} />;
        }
      `,
    },
    {
      code: `
        function Foo({ foo }) {
          return <div bar={foo} />;
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          render() {
            const { foo } = this.props;
            return <div bar={foo} />;
          }
        }
      `,
    },
    {
      code: `
        const Foo = createReactClass({
          render: function() {
            return <div>{this.props.foo}</div>;
          }
        });
      `,
    },
    {
      code: `
        const Foo = React.createClass({
          render: function() {
            return <div>{this.props.foo}</div>;
          }
        });
      `,
      settings: { react: { createClass: 'createClass' } },
    },
    {
      code: `
        function foo(bar) {
          this.bar = bar;
          this.props = 'baz';
          this.getFoo = function() {
            return this.bar + this.props;
          }
        }
      `,
    },
    {
      code: `
        function Foo(props) {
          return props.foo ? <span>{props.bar}</span> : null;
        }
      `,
    },
    {
      code: `
        function Foo(props) {
          if (props.foo) {
            return <div>{props.bar}</div>;
          }
          return null;
        }
      `,
    },
    {
      code: `
        function Foo(props) {
          if (props.foo) {
            something();
          }
          return null;
        }
      `,
    },
    {
      code: 'const Foo = (props) => <span>{props.foo}</span>',
    },
    {
      code: 'const Foo = ({ foo }) => <span>{foo}</span>',
    },
    {
      code: 'const Foo = (props) => props.foo ? <span>{props.bar}</span> : null;',
    },
    {
      code: 'const Foo = ({ foo, bar }) => foo ? <span>{bar}</span> : null;',
    },
    {
      code: `
        class Foo {
          bar() {
            () => {
              this.something();
              return null;
            };
          }
        }
      `,
    },
    {
      code: `
        class Foo {
          bar = () => {
            this.something();
            return null;
          };
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        export const Example = ({ prop }) => {
          return {
            handleClick: () => {},
            renderNode() {
              return <div onClick={this.handleClick} />;
            },
          };
        };
      `,
    },
    {
      code: `
        export const prepareLogin = new ValidatedMethod({
          name: "user.prepare",
          validate: new SimpleSchema({
          }).validator(),
          run({ remember }) {
              if (Meteor.isServer) {
                  const connectionId = this.connection.id; // react/no-this-in-sfc
                  return Methods.prepareLogin(connectionId, remember);
              }
              return null;
          },
        });
      `,
    },
    {
      code: `
        obj.notAComponent = function () {
          return this.a || null;
        };
      `,
    },
    {
      code: `
        $.fn.getValueAsStringWeak = function (): string | null {
          const val = this.length === 1 ? this.val() : null;
        
          return typeof val === 'string' ? val : null;
        };
      `,
      features: ['types'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        function Foo(props) {
          const { foo } = this.props;
          return <div>{foo}</div>;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          return <div>{this.props.foo}</div>;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          return <div>{this.state.foo}</div>;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          const { foo } = this.state;
          return <div>{foo}</div>;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          return props.foo ? <div>{this.props.bar}</div> : null;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          if (props.foo) {
            return <div>{this.props.bar}</div>;
          }
          return null;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          if (this.props.foo) {
            something();
          }
          return null;
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: 'const Foo = (props) => <span>{this.props.foo}</span>',
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: 'const Foo = (props) => this.props.foo ? <span>{props.bar}</span> : null;',
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        function Foo(props) {
          function onClick(bar) {
            this.props.onClick();
          }
          return <div onClick={onClick}>{this.props.foo}</div>;
        }
      `,
      errors: [
        { messageId: 'noThisInSFC' },
        { messageId: 'noThisInSFC' },
      ],
    },
    {
      code: `
        class Foo {
          bar() {
            return () => {
              this.something();
              return null;
            }
          }
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        class Foo {
          bar = () => () => {
            this.something();
            return null;
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove `no-ts-old` and fix
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        class Foo {
          bar() {
            function Bar(){
              return () => {
                this.something();
                return null;
              }
            }
          }
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
    {
      code: `
        class Foo {
          bar() {
            () => () => {
              this.something();
              return null;
            };
          }
        }
      `,
      errors: [{ messageId: 'noThisInSFC' }],
    },
  ]),
});
