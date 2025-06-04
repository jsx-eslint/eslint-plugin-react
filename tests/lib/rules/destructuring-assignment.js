/**
 * @fileoverview Rule to forbid or enforce destructuring assignment consistency.
 */

'use strict';

const semver = require('semver');
const eslintPkg = require('eslint/package.json');
const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/destructuring-assignment');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2022,
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
        export const revisionStates2 = {
            [A.b]: props => {
              return props.editor !== null
                ? 'xyz'
                : 'abc'
            },
        };
      `,
    },
    {
      code: `
        export function hof(namespace) {
          const initialState = {
            bounds: null,
            search: false,
          };
          return (props) => {
            const {x, y} = props
            if (y) {
              return <span>{y}</span>;
            }
            return <span>{x}</span>
          };
        }
      `,
    },
    {
      code: `
        export function hof(namespace) {
          const initialState = {
            bounds: null,
            search: false,
          };

          return (state = initialState, action) => {
            if (action.type === 'ABC') {
              return {...state, bounds: stuff ? action.x : null};
            }

            if (action.namespace !== namespace) {
              return state;
            }

            return null
          };
        }
      `,
    },
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
    // https://github.com/jsx-eslint/eslint-plugin-react/issues/2911
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
    {
      code: `
        function Foo(props) {
          const {a} = props;
          return <Goo {...props}>{a}</Goo>;
        }
      `,
      options: ['always', { destructureInSignature: 'always' }],
    },
    {
      code: `
        function Foo(props) {
          const {a} = props;
          return <Goo f={() => props}>{a}</Goo>;
        }
      `,
      options: ['always', { destructureInSignature: 'always' }],
    },
    {
      code: `
        import { useContext } from 'react';

        const MyComponent = (props) => {
          const {foo} = useContext(aContext);
          return <div>{foo}</div>
        };
      `,
      options: ['always'],
      settings: { react: { version: '16.9.0' } },
    },
    {
      code: `
        import { useContext } from 'react';

        const MyComponent = (props) => {
          const foo = useContext(aContext);
          return <div>{foo.test}</div>
        };
      `,
      options: ['never'],
      settings: { react: { version: '16.9.0' } },
    },
    {
      code: `
        import { useContext } from 'react';

        const MyComponent = (props) => {
          const foo = useContext(aContext);
          return <div>{foo.test}</div>
        };
      `,
      options: ['always'],
      settings: { react: { version: '16.9.0' } },
    },
    {
      code: `
        const MyComponent = (props) => {
          const foo = useContext(aContext);
          return <div>{foo.test}</div>
        };
      `,
      options: ['always'],
      settings: { react: { version: '16.8.999' } },
    },
    {
      code: `
        const MyComponent = (props) => {
          const {foo} = useContext(aContext);
          return <div>{foo}</div>
        };
      `,
      options: ['never'],
      settings: { react: { version: '16.8.999' } },
    },
    {
      code: `
        const MyComponent = (props) => {
          const {foo} = useContext(aContext);
          return <div>{foo}</div>
        };
      `,
      options: ['always'],
      settings: { react: { version: '16.8.999' } },
    },
    {
      code: `
        const MyComponent = (props) => {
          const foo = useContext(aContext);
          return <div>{foo.test}</div>
        };
      `,
      options: ['never'],
      settings: { react: { version: '16.8.999' } },
    },
    {
      code: `
        import { useContext } from 'react';

        const MyComponent = (props) => {
          const foo = useContext(aContext);
          return <div>{foo?.test}</div>
        };
      `,
      features: ['optional chaining'],
    },
  ]),

  invalid: parsers.all([].concat(
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
        var Hello = createReactClass({
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
          line: 5,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 7,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 8,
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
    {
      code: `
        import React from 'react';

        const TestComp = (props) => {
          props.onClick3102();

          return (
            <div
              onClick={(evt) => {
                if (props.onClick3102) {
                  props.onClick3102(evt);
                }
              }}
            >
              <div />
            </div>
          );
        };
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 5,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 10,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 11,
        },
      ],
    },
    {
      code: `
        export const revisionStates2 = {
            [A.b]: props => {
              return props.editor !== null
                ? <span>{props.editor}</span>
                : null
            },
        };
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 4,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 5,
        },
      ],
    },
    {
      code: `
        export function hof(namespace) {
          const initialState = {
            bounds: null,
            search: false,
          };
          return (props) => {
            if (props.y) {
              return <span>{props.y}</span>;
            }
            return <span>{props.x}</span>
          };
        }
      `,
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 8,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 9,
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
          line: 11,
        },
      ],
    },
    // Ignore for ESLint < 4 because ESLint < 4 does not support array fixer.
    semver.satisfies(eslintPkg.version, '>= 4') ? [
      {
        code: `
          function Foo(props) {
            const {a} = props;
            return <p>{a}</p>;
          }
        `,
        options: ['always', { destructureInSignature: 'always' }],
        errors: [
          {
            messageId: 'destructureInSignature',
            line: 3,
          },
        ],
        output: `
          function Foo({a}) {
${'            '}
            return <p>{a}</p>;
          }
        `,
      },
      {
        code: `
          function Foo(props: FooProps) {
            const {a} = props;
            return <p>{a}</p>;
          }
        `,
        options: ['always', { destructureInSignature: 'always' }],
        errors: [
          {
            messageId: 'destructureInSignature',
            line: 3,
          },
        ],
        output: `
          function Foo({a}: FooProps) {
${'            '}
            return <p>{a}</p>;
          }
        `,
        features: ['ts', 'no-babel'],
      },
    ] : [],
    {
      code: `
        type Props = { text: string };
        export const MyComponent: React.FC<Props> = (props) => {
          type MyType = typeof props.text;
          return <div>{props.text as MyType}</div>;
        };
      `,
      options: ['always', { destructureInSignature: 'always' }],
      features: ['types', 'no-babel'],
      errors: [
        {
          messageId: 'useDestructAssignment',
          type: 'TSQualifiedName',
          data: { type: 'props' },
        },
        {
          messageId: 'useDestructAssignment',
          type: 'MemberExpression',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        type Props = { text: string };
        export const MyOtherComponent: React.FC<Props> = (props) => {
          const { text } = props;
          type MyType = typeof props.text;
          return <div>{text as MyType}</div>;
        };
      `,
      options: ['always', { destructureInSignature: 'always' }],
      features: ['types', 'no-babel'],
      errors: [
        {
          messageId: 'useDestructAssignment',
          type: 'TSQualifiedName',
          data: { type: 'props' },
        },
      ],
    },
    {
      code: `
        function C(props: Props) {
          void props.a
          typeof props.b
          return <div />
        }
      `,
      options: ['always'],
      features: ['types'],
      errors: [
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
        {
          messageId: 'useDestructAssignment',
          data: { type: 'props' },
        },
      ],
    },
  )),
});
