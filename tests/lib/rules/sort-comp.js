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

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('sort-comp', rule, {

  valid: [{
    code: [
      '// Must validate a full class',
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
    code: [
      '// Must validate a class with missing groups',
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      '// Must put a custom method in \'everything-else\'',
      'var Hello = createReactClass({',
      '  onClick: function() {},',
      '  render: function() {',
      '    return <button onClick={this.onClick}>Hello</button>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      '// Must allow us to re-order the groups',
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
    code: [
      '// Must validate a full React 16.3 createReactClass class',
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
    code: [
      '// Must validate React 16.3 lifecycle methods with the default parser',
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
    code: [
      '// Must validate a full React 16.3 ES6 class',
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
    code: [
      '// Must allow us to create a RegExp-based group',
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
    code: [
      '// Must allow us to create a named group',
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
    code: [
      '// Must allow a method to be in different places if it\'s matches multiple patterns',
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
    code: [
      '// Must allow us to use \'constructor\' as a method name',
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
    code: [
      '// Must ignore stateless components',
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '// Must ignore stateless components (arrow function with explicit return)',
      'var Hello = props => (',
      '  <div>Hello {props.name}</div>',
      ')'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '// Must ignore spread operator',
      'var Hello = createReactClass({',
      '  ...proto,',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '// Type Annotations should be first',
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
    code: [
      '// Properties with Type Annotations should not be at the top',
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
    code: [
      '// Non-react classes should be ignored, even in expressions',
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
    code: [
      '// Non-react classes should be ignored, even in expressions',
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
    code: [
      '// Getters should be at the top',
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
    code: [
      '// Setters should be at the top',
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
    code: [
      '// Instance methods should be at the top',
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
    code: [
      '// Instance variables should be at the top',
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
  }, {
    code: [
      '// Methods can be grouped with any matching group (with statics)',
      'class Hello extends React.Component {',
      '  static onFoo() {}',
      '  static renderFoo() {}',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '  getFoo() {}',
      '}'
    ].join('\n'),
    options: [{
      order: [
        'static-methods',
        'render',
        '/^get.+$/',
        '/^on.+$/',
        '/^render.+$/'
      ]
    }]
  }, {
    code: [
      '// Methods can be grouped with any matching group (with RegExp)',
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>{this.props.text}</div>;',
      '  }',
      '  getFoo() {}',
      '  static onFoo() {}',
      '  static renderFoo() {}',
      '}'
    ].join('\n'),
    options: [{
      order: [
        'static-methods',
        'render',
        '/^get.+$/',
        '/^on.+$/',
        '/^render.+$/'
      ]
    }]
  }, {
    code: [
      '// static lifecycle methods can be grouped (with statics)',
      'class Hello extends React.Component {',
      '  static getDerivedStateFromProps() {}',
      '  constructor() {}',
      '}'
    ].join('\n')
  }, {
    code: [
      '// static lifecycle methods can be grouped (with lifecycle)',
      'class Hello extends React.Component {',
      '  constructor() {}',
      '  static getDerivedStateFromProps() {}',
      '}'
    ].join('\n')
  }],

  invalid: [{
    code: [
      '// Must force a lifecycle method to be placed before render',
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  },',
      '  displayName : \'Hello\',',
      '});'
    ].join('\n'),
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    code: [
      '// Must run rule when render uses createElement instead of JSX',
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return React.createElement("div", null, "Hello");',
      '  },',
      '  displayName : \'Hello\',',
      '});'
    ].join('\n'),
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    code: [
      '// Must force a custom method to be placed before render',
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  },',
      '  onClick: function() {},',
      '});'
    ].join('\n'),
    errors: [{message: 'render should be placed after onClick'}]
  }, {
    code: [
      '// Must force a custom method to be placed before render, even in function',
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
    code: [
      '// Must force a custom method to be placed after render if no \'everything-else\' group is specified',
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
    code: [
      '// Must validate static properties',
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
    code: [
      '// Type Annotations should not be at the top by default',
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
    code: [
      '// Type Annotations should be first',
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
    code: [
      '// Properties with Type Annotations should not be at the top',
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
      '// componentDidMountOk should be placed after getA',
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
    code: [
      '// Getters should at the top',
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
    code: [
      '// Setters should at the top',
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
    code: [
      '// Instance methods should not be at the top',
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
    code: [
      '// Instance variables should not be at the top',
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
  }, {
    code: [
      '// Should not confuse method names with group names',
      'class Hello extends React.Component {',
      '  setters() {}',
      '  constructor() {}',
      '  render() {}',
      '}'
    ].join('\n'),
    errors: [{message: 'setters should be placed after render'}],
    options: [{
      order: [
        'setters',
        'lifecycle',
        'render'
      ]
    }]
  }, {
    code: [
      '// Explicitly named methods should appear in the correct order',
      'class Hello extends React.Component {',
      '  render() {}',
      '  foo() {}',
      '}'
    ].join('\n'),
    errors: [{message: 'render should be placed after foo'}],
    options: [{
      order: [
        'foo',
        'render'
      ]
    }]
  }]
});
