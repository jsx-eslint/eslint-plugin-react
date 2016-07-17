/**
 * @fileoverview Enforce component methods order
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/sort-comp');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('sort-comp', rule, {

  valid: [{
    // Must validate a full class
    code: [
      'var Hello = React.createClass({',
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
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Must validate a class with missing groups
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Must put a custom method in 'everything-else'
    code: [
      'var Hello = React.createClass({',
      '  onClick: function() {},',
      '  render: function() {',
      '    return <button onClick={this.onClick}>Hello</button>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Must allow us to re-order the groups
    code: [
      'var Hello = React.createClass({',
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
    }],
    parserOptions: parserOptions
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
    }],
    parserOptions: parserOptions
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
    }],
    parserOptions: parserOptions
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
    }],
    parserOptions: parserOptions
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
    }],
    parserOptions: parserOptions
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
      'var Hello = React.createClass({',
      '  ...proto,',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    // Must consider `instance-properties` part of `everything-else` by default
    code: [
      'class Hello extends React.Component {',
      '  static displayName = \'Hello\';',
      '  componentDidMount() {}',
      '  count = 5;',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Must allow non-initialized instance properties
    code: [
      'class Hello extends React.Component {',
      '  count;',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'instance-properties',
        'render'
      ]
    }],
    parserOptions: parserOptions
  }],

  invalid: [{
    // Must force a lifecycle method to be placed before render
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  },',
      '  displayName : \'Hello\',',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    // Must run rule when render uses createElement instead of JSX
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return React.createElement("div", null, "Hello");',
      '  },',
      '  displayName : \'Hello\',',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    // Must force a custom method to be placed before render
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  },',
      '  onClick: function() {},',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: 'render should be placed after onClick'}]
  }, {
    // Must force a custom method to be placed after render if no 'everything-else' group is specified
    code: [
      'var Hello = React.createClass({',
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
    errors: [{message: 'render should be placed after displayName'}]
  }, {
    // Must validate instance properties
    // if `instance-properties` is found in configuration
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div></div>',
      '  }',
      '  count = 2;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'instance-properties',
        'render'
      ]
    }],
    parserOptions: parserOptions,
    errors: [{message: 'render should be placed after count'}]
  }, {
    // Must differentiate between instance and static properties
    // if `instance-properties` is found in configuration
    code: [
      'class Hello extends React.Component {',
      '  count = 2;',
      '  static displayName = \'Hello\';',
      '  render() {',
      '    return <div></div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'static-methods',
        'instance-properties',
        'render'
      ]
    }],
    parserOptions: parserOptions,
    errors: [{message: 'count should be placed after displayName'}]
  }, {
    // Must differentiate between `instance-properties` and instance arrow functions
    // if `instance-properties` is found in configuration
    code: [
      'class Hello extends React.Component {',
      '  handleClick = () => {}',
      '  count = 2;',
      '  render() {',
      '    return <div></div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      order: [
        'instance-properties',
        'everything-else',
        'render'
      ]
    }],
    parserOptions: parserOptions,
    errors: [{message: 'handleClick should be placed after count'}]
  }]
});
