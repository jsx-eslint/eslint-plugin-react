/**
 * @fileoverview Enforce component methods order
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/sort-comp');

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
ruleTester.run('sort-comp', rule, {
  valid: parsers.all([
    {
      code: `
        // Must validate a full class
        var Hello = createReactClass({
          displayName : '',
          propTypes: {},
          contextTypes: {},
          childContextTypes: {},
          mixins: [],
          statics: {},
          getDefaultProps: function() {},
          getInitialState: function() {},
          getChildContext: function() {},
          componentWillMount: function() {},
          componentDidMount: function() {},
          componentWillReceiveProps: function() {},
          shouldComponentUpdate: function() {},
          componentWillUpdate: function() {},
          componentDidUpdate: function() {},
          componentWillUnmount: function() {},
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
    },
    {
      code: `
        // Must validate a class with missing groups
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
    },
    {
      code: `
        // Must put a custom method in 'everything-else'
        var Hello = createReactClass({
          onClick: function() {},
          render: function() {
            return <button onClick={this.onClick}>Hello</button>;
          }
        });
      `,
    },
    {
      code: `
        // Must allow us to re-order the groups
        var Hello = createReactClass({
          displayName : 'Hello',
          render: function() {
            return <button onClick={this.onClick}>Hello</button>;
          },
          onClick: function() {}
        });
      `,
      options: [
        {
          order: [
            'lifecycle',
            'render',
            'everything-else',
          ],
        },
      ],
    },
    {
      code: `
        // Must validate a full React 16.3 createReactClass class
        var Hello = createReactClass({
          displayName : '',
          propTypes: {},
          contextTypes: {},
          childContextTypes: {},
          mixins: [],
          statics: {},
          getDefaultProps: function() {},
          getInitialState: function() {},
          getChildContext: function() {},
          UNSAFE_componentWillMount: function() {},
          componentDidMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          shouldComponentUpdate: function() {},
          UNSAFE_componentWillUpdate: function() {},
          getSnapshotBeforeUpdate: function() {},
          componentDidUpdate: function() {},
          componentDidCatch: function() {},
          componentWillUnmount: function() {},
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
    },
    {
      code: `
        // Must validate React 16.3 lifecycle methods with the default parser
        class Hello extends React.Component {
          constructor() {}
          static getDerivedStateFromProps() {}
          UNSAFE_componentWillMount() {}
          componentDidMount() {}
          UNSAFE_componentWillReceiveProps() {}
          shouldComponentUpdate() {}
          UNSAFE_componentWillUpdate() {}
          getSnapshotBeforeUpdate() {}
          componentDidUpdate() {}
          componentDidCatch() {}
          componentWillUnmount() {}
          testInstanceMethod() {}
          render() { return (<div>Hello</div>); }
        }
      `,
    },
    {
      code: `
        // Must validate a full React 16.3 ES6 class
        class Hello extends React.Component {
          static displayName = ''
          static propTypes = {}
          static defaultProps = {}
          constructor() {}
          state = {}
          static getDerivedStateFromProps = () => {}
          UNSAFE_componentWillMount = () => {}
          componentDidMount = () => {}
          UNSAFE_componentWillReceiveProps = () => {}
          shouldComponentUpdate = () => {}
          UNSAFE_componentWillUpdate = () => {}
          getSnapshotBeforeUpdate = () => {}
          componentDidUpdate = () => {}
          componentDidCatch = () => {}
          componentWillUnmount = () => {}
          testArrowMethod = () => {}
          testInstanceMethod() {}
          render = () => (<div>Hello</div>)
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        // Must allow us to create a RegExp-based group
        class Hello extends React.Component {
          customHandler() {}
          render() {
            return <div>Hello</div>;
          }
          onClick() {}
        }
      `,
      options: [
        {
          order: [
            'lifecycle',
            'everything-else',
            'render',
            '/on.*/',
          ],
        },
      ],
    },
    {
      code: `
        // Must allow us to create a named group
        class Hello extends React.Component {
          customHandler() {}
          render() {
            return <div>Hello</div>;
          }
          onClick() {}
        }
      `,
      options: [
        {
          order: [
            'lifecycle',
            'everything-else',
            'render',
            'customGroup',
          ],
          groups: {
            customGroup: [
              '/on.*/',
            ],
          },
        },
      ],
    },
    {
      code: `
        // Must allow a method to be in different places if it's matches multiple patterns
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
          onClick() {}
        }
      `,
      options: [
        {
          order: [
            '/on.*/',
            'render',
            '/.*Click/',
          ],
        },
      ],
    },
    {
      code: `
        // Must allow us to use 'constructor' as a method name
        class Hello extends React.Component {
          constructor() {}
          displayName() {}
          render() {
            return <div>Hello</div>;
          }
        }
      `,
      options: [
        {
          order: [
            'constructor',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Must ignore stateless components
        function Hello(props) {
          return <div>Hello {props.name}</div>
        }
      `,
    },
    {
      code: `
        // Must ignore stateless components (arrow function with explicit return)
        var Hello = props => (
          <div>Hello {props.name}</div>
        )
      `,
    },
    {
      code: `
        // Must ignore spread operator
        var Hello = createReactClass({
          ...proto,
          render: function() {
            return <div>Hello</div>;
          }
        });
      `,
    },
    {
      code: `
        // Type Annotations should be first
        class Hello extends React.Component {
          props: { text: string };
          constructor() {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['types'],
      options: [
        {
          order: [
            'type-annotations',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Properties with Type Annotations should not be at the top
        class Hello extends React.Component {
          props: { text: string };
          constructor() {}
          state: Object = {};
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['types'],
      options: [
        {
          order: [
            'type-annotations',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Non-react classes should be ignored, even in expressions
        return class Hello {
          render() {
            return <div>{this.props.text}</div>;
          }
          props: { text: string };
          constructor() {}
          state: Object = {};
        }
      `,
      features: ['types'],
      parserOptions,
    },
    {
      code: `
        // Non-react classes should be ignored, even in expressions
        return class {
          render() {
            return <div>{this.props.text}</div>;
          }
          props: { text: string };
          constructor() {}
          state: Object = {};
        }
      `,
      features: ['types'],
      parserOptions,
    },
    {
      code: `
        // Getters should be at the top
        class Hello extends React.Component {
          get foo() {}
          constructor() {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      options: [
        {
          order: [
            'getters',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Setters should be at the top
        class Hello extends React.Component {
          set foo(bar) {}
          constructor() {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      options: [
        {
          order: [
            'setters',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Instance methods should be at the top
        class Hello extends React.Component {
          foo = () => {}
          constructor() {}
          classMethod() {}
          static bar = () => {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'instance-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Instance variables should be at the top
        class Hello extends React.Component {
          foo = 'bar'
          constructor() {}
          state = {}
          static bar = 'foo'
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'instance-variables',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Methods can be grouped with any matching group (with statics)
        class Hello extends React.Component {
          static onFoo() {}
          static renderFoo() {}
          render() {
            return <div>{this.props.text}</div>;
          }
          getFoo() {}
        }
      `,
      options: [
        {
          order: [
            'static-methods',
            'render',
            '/^get.+$/',
            '/^on.+$/',
            '/^render.+$/',
          ],
        },
      ],
    },
    {
      code: `
        // Methods can be grouped with any matching group (with RegExp)
        class Hello extends React.Component {
          render() {
            return <div>{this.props.text}</div>;
          }
          getFoo() {}
          static onFoo() {}
          static renderFoo() {}
        }
      `,
      options: [
        {
          order: [
            'static-methods',
            'render',
            '/^get.+$/',
            '/^on.+$/',
            '/^render.+$/',
          ],
        },
      ],
    },
    {
      code: `
        // static lifecycle methods can be grouped (with statics)
        class Hello extends React.Component {
          static getDerivedStateFromProps() {}
          constructor() {}
        }
      `,
    },
    {
      code: `
        // static lifecycle methods can be grouped (with lifecycle)
        class Hello extends React.Component {
          constructor() {}
          static getDerivedStateFromProps() {}
        }
      `,
    },
    {
      code: `
        class MyComponent extends React.Component {
          state = {};
          foo;
          static propTypes;

          render() {
            return null;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'state',
            'instance-variables',
            'static-methods',
            'lifecycle',
            'render',
            'everything-else',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static foo;
          static getDerivedStateFromProps() {}

          render() {
            return null;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'static-variables',
            'static-methods',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static getDerivedStateFromProps() {}
          static foo = 'some-str';

          render() {
            return null;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'static-methods',
            'static-variables',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          foo = {};
          static bar = 0;
          static getDerivedStateFromProps() {}

          render() {
            return null;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'instance-variables',
            'static-variables',
            'static-methods',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static bar = 1;
          foo = {};
          static getDerivedStateFromProps() {}

          render() {
            return null;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'static-variables',
            'instance-variables',
            'static-methods',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static getDerivedStateFromProps() {}
          render() {
            return null;
          }
          static bar;
          foo = {};
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'static-methods',
            'render',
            'static-variables',
            'instance-variables',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static foo = 1;
          bar;

          constructor() {
            super(props);

            this.state = {};
          }

          render() {
            return null;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          order: [
            'static-variables',
            'instance-variables',
            'constructor',
            'everything-else',
            'render',
          ],
        },
      ],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        // Must force a lifecycle method to be placed before render
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          },
          displayName : 'Hello',
        });
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'render',
            position: 'after',
            propB: 'displayName',
          },
        },
      ],
    },
    {
      code: `
        // Must run rule when render uses createElement instead of JSX
        var Hello = createReactClass({
          render: function() {
            return React.createElement("div", null, "Hello");
          },
          displayName : 'Hello',
        });
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'render',
            position: 'after',
            propB: 'displayName',
          },
        },
      ],
    },
    {
      code: `
        // Must force a custom method to be placed before render
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          },
          onClick: function() {},
        });
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'render',
            position: 'after',
            propB: 'onClick',
          },
        },
      ],
    },
    {
      code: `
        // Must force a custom method to be placed before render, even in function
        var Hello = () => {
          return class Test extends React.Component {
            render () {
              return <div>Hello</div>;
            }
            onClick () {}
          }
        };
      `,
      parserOptions,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'render',
            position: 'after',
            propB: 'onClick',
          },
        },
      ],
    },
    {
      code: `
        // Must force a custom method to be placed after render if no 'everything-else' group is specified
        var Hello = createReactClass({
          displayName: 'Hello',
          onClick: function() {},
          render: function() {
            return <button onClick={this.onClick}>Hello</button>;
          }
        });
      `,
      options: [
        {
          order: [
            'lifecycle',
            'render',
          ],
        },
      ],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'onClick',
            position: 'after',
            propB: 'render',
          },
        },
      ],
    },
    {
      code: `
        // Must validate static properties
        class Hello extends React.Component {
          render() {
            return <div></div>
          }
          static displayName = 'Hello';
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'render',
            position: 'after',
            propB: 'displayName',
          },
        },
      ],
    },
    {
      code: `
        // Type Annotations should not be at the top by default
        class Hello extends React.Component {
          props: { text: string };
          constructor() {}
          state: Object = {};
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'props',
            position: 'after',
            propB: 'state',
          },
        },
      ],
    },
    {
      code: `
        // Type Annotations should be first
        class Hello extends React.Component {
          constructor() {}
          props: { text: string };
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'constructor',
            position: 'after',
            propB: 'props',
          },
        },
      ],
      options: [
        {
          order: [
            'type-annotations',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Properties with Type Annotations should not be at the top
        class Hello extends React.Component {
          props: { text: string };
          state: Object = {};
          constructor() {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'state',
            position: 'after',
            propB: 'constructor',
          },
        },
      ],
      options: [
        {
          order: [
            'type-annotations',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // componentDidMountOk should be placed after getA
        export default class View extends React.Component {
          componentDidMountOk() {}
          getB() {}
          componentWillMount() {}
          getA() {}
          render() {}
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'componentDidMountOk',
            position: 'after',
            propB: 'getA',
          },
        },
      ],
      options: [
        {
          order: [
            'static-methods',
            'lifecycle',
            '/^on.+$/',
            '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
            'everything-else',
            '/^render.+$/',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Getters should at the top
        class Hello extends React.Component {
          constructor() {}
          get foo() {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'constructor',
            position: 'after getter',
            propB: 'functions',
          },
        },
      ],
      options: [
        {
          order: [
            'getters',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Setters should at the top
        class Hello extends React.Component {
          constructor() {}
          set foo(bar) {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'constructor',
            position: 'after setter',
            propB: 'functions',
          },
        },
      ],
      options: [
        {
          order: [
            'setters',
            'static-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Instance methods should not be at the top
        class Hello extends React.Component {
          constructor() {}
          static bar = () => {}
          classMethod() {}
          foo = function() {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'foo',
            position: 'before',
            propB: 'constructor',
          },
        },
      ],
      options: [
        {
          order: [
            'instance-methods',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Instance variables should not be at the top
        class Hello extends React.Component {
          constructor() {}
          state = {}
          static bar = {}
          foo = {}
          render() {
            return <div>{this.props.text}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'foo',
            position: 'before',
            propB: 'constructor',
          },
        },
      ],
      options: [
        {
          order: [
            'instance-variables',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Should not confuse method names with group names
        class Hello extends React.Component {
          setters() {}
          constructor() {}
          render() {}
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'setters',
            position: 'after',
            propB: 'render',
          },
        },
      ],
      options: [
        {
          order: [
            'setters',
            'lifecycle',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        // Explicitly named methods should appear in the correct order
        class Hello extends React.Component {
          render() {}
          foo() {}
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'render',
            position: 'after',
            propB: 'foo',
          },
        },
      ],
      options: [
        {
          order: [
            'foo',
            'render',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static getDerivedStateFromProps() {}
          static foo;

          render() {
            return null;
          }
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'getDerivedStateFromProps',
            position: 'after',
            propB: 'foo',
          },
        },
      ],
      features: ['class fields'],
      options: [
        {
          order: [
            'static-variables',
            'static-methods',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static foo;
          bar = 'some-str'
          static getDerivedStateFromProps() {}

          render() {
            return null;
          }
        }
      `,
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'foo',
            position: 'after',
            propB: 'bar',
          },
        },
      ],
      features: ['class fields'],
      options: [
        {
          order: [
            'instance-variables',
            'static-variables',
            'static-methods',
          ],
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static getDerivedStateFromProps() {}
          static bar;
          render() {
            return null;
          }
          foo = {};
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unsortedProps',
          data: {
            propA: 'bar',
            position: 'after',
            propB: 'render',
          },
        },
      ],
      options: [
        {
          order: [
            'static-methods',
            'render',
            'static-variables',
            'instance-variables',
          ],
        },
      ],
    },
  ]),
});
