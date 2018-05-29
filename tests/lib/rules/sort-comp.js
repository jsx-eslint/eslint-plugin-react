/**
 * @fileoverview Enforce component methods order
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/sort-comp');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('sort-comp', rule, {

  valid: [{
    // Must validate a full class
    code: [
      'var Hello = createReactClass({',
      '  displayName : \'\',',
      '  propTypes: {},',
      '  contextTypes: {},',
      '  childContextTypes: {},',
      '  mixins: [],',
      '  statics: {},',
      '  getDefaultProps: function() {},',
      '  getInitialState: function() {},',
      '  getChildContext: function() {},',
      '  componentWillMount: function() {},',
      '  componentDidMount: function() {},',
      '  componentWillReceiveProps: function() {},',
      '  shouldComponentUpdate: function() {},',
      '  componentWillUpdate: function() {},',
      '  componentDidUpdate: function() {},',
      '  componentWillUnmount: function() {},',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    // Must validate a class with missing groups
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    // Must put a custom method in 'everything-else'
    code: [
      'var Hello = createReactClass({',
      '  onClick: function() {},',
      '  render: function() {',
      '    return <button onClick={this.onClick}>Hello</button>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    // Must allow us to re-order the groups
    code: [
      'var Hello = createReactClass({',
      '  displayName : \'Hello\',',
      '  render: function() {',
      '    return <button onClick={this.onClick}>Hello</button>;',
      '  },',
      '  onClick: function() {}',
      '});'
    ].join('\n'),
    options: [{
      order: [
        'lifecycle',
        'render',
        'everything-else'
      ]
    }]
  }, {
    // Must validate a full React 16.3 createReactClass class
    code: [
      'var Hello = createReactClass({',
      '  displayName : \'\',',
      '  propTypes: {},',
      '  contextTypes: {},',
      '  childContextTypes: {},',
      '  mixins: [],',
      '  statics: {},',
      '  getDefaultProps: function() {},',
      '  getInitialState: function() {},',
      '  getChildContext: function() {},',
      '  UNSAFE_componentWillMount: function() {},',
      '  componentDidMount: function() {},',
      '  UNSAFE_componentWillReceiveProps: function() {},',
      '  shouldComponentUpdate: function() {},',
      '  UNSAFE_componentWillUpdate: function() {},',
      '  getSnapshotBeforeUpdate: function() {},',
      '  componentDidUpdate: function() {},',
      '  componentDidCatch: function() {},',
      '  componentWillUnmount: function() {},',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    // Must validate React 16.3 lifecycle methods with the default parser
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  static getDerivedStateFromProps() {}',
      '  UNSAFE_componentWillMount() {}',
      '  componentDidMount() {}',
      '  UNSAFE_componentWillReceiveProps() {}',
      '  shouldComponentUpdate() {}',
      '  UNSAFE_componentWillUpdate() {}',
      '  getSnapshotBeforeUpdate() {}',
      '  componentDidUpdate() {}',
      '  componentDidCatch() {}',
      '  componentWillUnmount() {}',
      '  testInstanceMethod() {}',
      '  render() { return (<div>Hello</div>); }',
      '}'
    ].join('\n')
  }, {
    // Must validate a full React 16.3 ES6 class
    code: [
      'class Hello extends React.Component {',
      '  static displayName = \'\'',
      '  static propTypes = {}',
      '  static defaultProps = {}',
      '  constructor() {}',
      '  state = {}',
      '  static getDerivedStateFromProps = () => {}',
      '  UNSAFE_componentWillMount = () => {}',
      '  componentDidMount = () => {}',
      '  UNSAFE_componentWillReceiveProps = () => {}',
      '  shouldComponentUpdate = () => {}',
      '  UNSAFE_componentWillUpdate = () => {}',
      '  getSnapshotBeforeUpdate = () => {}',
      '  componentDidUpdate = () => {}',
      '  componentDidCatch = () => {}',
      '  componentWillUnmount = () => {}',
      '  testArrowMethod = () => {}',
      '  testInstanceMethod() {}',
      '  render = () => (<div>Hello</div>)',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    // Must allow us to create a RegExp-based group
    code: [
      'class Hello extends React.Component {',
      '  customHandler() {}',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '  onClick() {}',
      '}'
    ].join('\n'),
    options: [{
      order: [
        'lifecycle',
        'everything-else',
        'render',
        '/on.*/'
      ]
    }]
  }, {
    // Must allow us to create a named group
    code: [
      'class Hello extends React.Component {',
      '  customHandler() {}',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '  onClick() {}',
      '}'
    ].join('\n'),
    options: [{
      order: [
        'lifecycle',
        'everything-else',
        'render',
        'customGroup'
      ],
      groups: {
        customGroup: [
          '/on.*/'
        ]
      }
    }]
  }, {
    // Must allow a method to be in different places if it's matches multiple patterns
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '  onClick() {}',
      '}'
    ].join('\n'),
    options: [{
      order: [
        '/on.*/',
        'render',
        '/.*Click/'
      ]
    }]
  }, {
    // Must allow us to use 'constructor' as a method name
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  displayName() {}',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      order: [
        'constructor',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Must ignore stateless components
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    // Must ignore stateless components (arrow function with explicit return)
    code: [
      'var Hello = props => (',
      '  <div>Hello {props.name}</div>',
      ')'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    // Must ignore spread operator
    code: [
      'var Hello = createReactClass({',
      '  ...proto,',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    // Type Annotations should be first
    code: [
      'class Hello extends React.Component {',
      '  props: { text: string };',
      '  constructor() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'type-annotations',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Properties with Type Annotations should not be at the top
    code: [
      'class Hello extends React.Component {',
      '  props: { text: string };',
      '  constructor() {}',
      '  state: Object = {};',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'type-annotations',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Non-react classes should be ignored, even in expressions
    code: [
      'return class Hello {',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '  props: { text: string };',
      '  constructor() {}',
      '  state: Object = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Non-react classes should be ignored, even in expressions
    code: [
      'return class {',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '  props: { text: string };',
      '  constructor() {}',
      '  state: Object = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Getters should be at the top
    code: [
      'class Hello extends React.Component {',
      '  get foo() {}',
      '  constructor() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'getters',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Setters should be at the top
    code: [
      'class Hello extends React.Component {',
      '  set foo(bar) {}',
      '  constructor() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'setters',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Instance methods should be at the top
    code: [
      'class Hello extends React.Component {',
      '  foo = () => {}',
      '  constructor() {}',
      '  classMethod() {}',
      '  static bar = () => {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'instance-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Instance variables should be at the top
    code: [
      'class Hello extends React.Component {',
      '  foo = \'bar\'',
      '  constructor() {}',
      '  state = {}',
      '  static bar = \'foo\'',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'instance-variables',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }],

  invalid: [{
    // Must force a lifecycle method to be placed before render
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  },',
      '  displayName : \'Hello\',',
      '});'
    ].join('\n'),
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    // Must run rule when render uses createElement instead of JSX
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return React.createElement("div", null, "Hello");',
      '  },',
      '  displayName : \'Hello\',',
      '});'
    ].join('\n'),
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    // Must force a custom method to be placed before render
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  },',
      '  onClick: function() {},',
      '});'
    ].join('\n'),
    errors: [{message: 'render should be placed after onClick'}]
  }, {
    // Must force a custom method to be placed before render, even in function
    code: [
      'var Hello = () => {',
      '  return class Test extends React.Component {',
      '    render () {',
      '      return <div>Hello</div>;',
      '    }',
      '    onClick () {}',
      '  }',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: 'render should be placed after onClick'}]
  }, {
    // Must force a custom method to be placed after render if no 'everything-else' group is specified
    code: [
      'var Hello = createReactClass({',
      '  displayName: \'Hello\',',
      '  onClick: function() {},',
      '  render: function() {',
      '    return <button onClick={this.onClick}>Hello</button>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      order: [
        'lifecycle',
        'render'
      ]
    }],
    errors: [{message: 'onClick should be placed after render'}]
  }, {
    // Must validate static properties
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div></div>',
      '  }',
      '  static displayName = \'Hello\';',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    // Must validate static lifecycle methods
    code: [
      'class Hello extends React.Component {',
      '  static getDerivedStateFromProps() {}',
      '  constructor() {}',
      '}'
    ].join('\n'),
    errors: [{message: 'getDerivedStateFromProps should be placed after constructor'}]
  }, {
    // Type Annotations should not be at the top by default
    code: [
      'class Hello extends React.Component {',
      '  props: { text: string };',
      '  constructor() {}',
      '  state: Object = {};',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'props should be placed after state'}]
  }, {
    // Type Annotations should be first
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  props: { text: string };',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'constructor should be placed after props'}],
    options: [{
      order: [
        'type-annotations',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Properties with Type Annotations should not be at the top
    code: [
      'class Hello extends React.Component {',
      '  props: { text: string };',
      '  state: Object = {};',
      '  constructor() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'state should be placed after constructor'}],
    options: [{
      order: [
        'type-annotations',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    code: [
      'export default class View extends React.Component {',
      '  componentDidMountOk() {}',
      '  getB() {}',
      '  componentWillMount() {}',
      '  getA() {}',
      '  render() {}',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'componentDidMountOk should be placed after getA'}],
    options: [{
      order: [
        'static-methods',
        'lifecycle',
        '/^on.+$/',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        'everything-else',
        '/^render.+$/',
        'render'
      ]
    }]
  }, {
    // Getters should at the top
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  get foo() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'constructor should be placed after getter functions'}],
    options: [{
      order: [
        'getters',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Setters should at the top
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  set foo(bar) {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'constructor should be placed after setter functions'}],
    options: [{
      order: [
        'setters',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Instance methods should not be at the top
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  static bar = () => {}',
      '  classMethod() {}',
      '  foo = function() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'foo should be placed before constructor'}],
    options: [{
      order: [
        'instance-methods',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }, {
    // Instance variables should not be at the top
    code: [
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  state = {}',
      '  static bar = {}',
      '  foo = {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'foo should be placed before constructor'}],
    options: [{
      order: [
        'instance-variables',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }]
  }]
});
