/**
 * @fileoverview Rule to forbid or enforce destructuring assignment consistency.
 */

'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/destructuring-assignment');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('destructuring-assignment', rule, {
  valid: parsers.all([
    {
      code: `
        const MyComponent = ({ id, className }) => (
          <div id={id} className={className} />
        );
      `,
    },
    {
      code: `
        const MyComponent = ({ id, className }) => (
          <div id={id} className={className} />
        );
      `,
      options: ['always'],
    },
    {
      code: `
        const MyComponent = (props) => {
          const { id, className } = props;
          return <div id={id} className={className} />
        };
      `,
    },
    {
      code: `
        const MyComponent = (props) => {
          const { id, className } = props;
          return <div id={id} className={className} />
        };
      `,
      options: ['always'],
    },
    {
      code: `
        const MyComponent = (props) => (
          <div id={id} props={props} />
        );
      `,
    },
    {
      code: `
        const MyComponent = (props) => (
          <div id={id} props={props} />
        );
      `,
      options: ['always'],
    },
    {
      code: `
        const MyComponent = (props, { color }) => (
          <div id={id} props={props} color={color} />
        );
      `,
    },
    {
      code: `
        const MyComponent = (props, { color }) => (
          <div id={id} props={props} color={color} />
        );
      `,
      options: ['always'],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          doStuff() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: ['never'],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            const { foo } = this.props;
            return <div>{foo}</div>;
          }
        };
      `,
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            const { foo } = this.props;
            return <div>{foo}</div>;
          }
        };
      `,
      options: ['always'],
    },
    {
      code: `
        const MyComponent = (props) => {
          const { h, i } = hi;
          return <div id={props.id} className={props.className} />
        };
      `,
      options: ['never'],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          constructor() {
            this.state = {};
            this.state.foo = 'bar';
          }
        };
      `,
      options: ['always'],
    },
    {
      code: `
        const div = styled.div\`
          & .button {
            border-radius: \${props => props.borderRadius}px;
          }
        \`
      `,
    },
    {
      code: `
        export default (context: $Context) => ({
          foo: context.bar
        });
      `,
      features: ['types'],
    },
    {
      code: `
        class Foo {
          bar(context) {
            return context.baz;
          }
        }
      `,
    },
    {
      code: `
        class Foo {
          bar(props) {
            return props.baz;
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          bar = this.props.bar
        }
      `,
      options: ['always', { ignoreClassFields: true }],
      features: ['class fields'],
    },
    {
      code: `
        class Input extends React.Component {
          id = \`\${this.props.name}\`;
          render() {
            return <div />;
          }
        }
      `,
      options: ['always', { ignoreClassFields: true }],
      features: ['class fields'],
    },
    // https://github.com/yannickcr/eslint-plugin-react/issues/2911
    {
      code: `
        function Foo({ context }) {
          const d = context.describe();
          return <div>{d}</div>;
        }
      `,
      options: ['always'],
    },
    {
      code: `
        const obj = {
          foo(arg) {
            const a = arg.func();
            return null;
          },
        };
      `,
    },
    {
      code: `
        const columns = [
          {
            render: (val) => {
              if (val.url) {
                return (
                  <a href={val.url}>
                    {val.test}
                  </a>
                );
              }
              return null;
            },
          },
        ];
      `,
    },
    {
      code: `
        const columns = [
          {
            render: val => <span>{val}</span>,
          },
          {
            someRenderFunc: function(val) {
              if (val.url) {
                return (
                  <a href={val.url}>
                    {val.test}
                  </a>
                );
              }
              return null;
            },
          },
        ];
      `,
    },
    {
      code: `
        export default (fileName) => {
          const match = fileName.match(/some expression/);
          if (match) {
            return fn;
          }
          return null;
        };
      `,
    },
    {
      code: `
        class C extends React.Component {
          componentDidMount() {
            const { forwardRef } = this.props;

            this.ref.current.focus();

            if (typeof forwardRef === 'function') {
              forwardRef(this.ref);
            }
          }
          render() {
            return <div />;
          }
        }
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        const MyComponent = (props) => {
          return (<div id={props.id} />)
        };
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        const MyComponent = ({ id, className }) => (
          <div id={id} className={className} />
        );
      `,
      options: ['never'],
      errors: [
        { messageId: 'noDestructPropsInSFCArg' },
      ],
    },
    {
      code: `
        const MyComponent = (props, { color }) => (
          <div id={props.id} className={props.className} />
        );
      `,
      options: ['never'],
      errors: [
        { messageId: 'noDestructContextInSFCArg' },
      ],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.state.foo}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'state' },
        },
      ],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.context.foo}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'context' },
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          render() { return this.foo(); }
          foo() {
            return this.props.children;
          }
        }
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        var Hello = React.createClass({
          render: function() {
            return <Text>{this.props.foo}</Text>;
          }
        });
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        module.exports = {
          Foo(props) {
            return <p>{props.a}</p>;
          }
        }
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        export default function Foo(props) {
          return <p>{props.a}</p>;
        }
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        function hof() {
          return (props) => <p>{props.a}</p>;
        }
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            const foo = this.props.foo;
            return <div>{foo}</div>;
          }
        };
        `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            const { foo } = this.props;
            return <div>{foo}</div>;
          }
        };
      `,
      options: ['never'],
      errors: [
        {
          messageId: 'noDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        const MyComponent = (props) => {
          const { id, className } = props;
          return <div id={id} className={className} />
        };
      `,
      options: ['never'],
      errors: [
        {
          messageId: 'noDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            const { foo } = this.state;
            return <div>{foo}</div>;
          }
        };
      `,
      options: ['never'],
      errors: [
        {
          messageId: 'noDestructAssignment',
          data: { type: 'state' },
        },
      ],
    },
    {
      code: `
        const columns = [
          {
            CustomComponentName: function(props) {
              if (props.url) {
                return (
                  <a href={props.url}>
                    {props.test}
                  </a>
                );
              }
              return null;
            },
          },
        ];
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        function Foo(props, context) {
          const d = context.describe();
          return <div>{d}</div>;
        }
      `,
      options: ['always'],
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'context' },
        },
      ],
    },
    {
      code: `
        export default (props) => {
          const match = props.str.match(/some expression/);
          if (match) {
            return <span>jsx</span>;
          }
          return null;
        };
      `,
      options: ['always'],
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
  ]),
});
