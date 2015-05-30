/**
 * @fileoverview Enforce component methods order
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/sort-comp', {

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
    ecmaFeatures: {
      jsx: true
    }
  }, {
    // Must validate a class with missing groups
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
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
    ecmaFeatures: {
      jsx: true
    }
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
    args: [1, {
      order: [
        'lifecycle',
        'render',
        'everything-else'
      ]
    }],
    ecmaFeatures: {
      jsx: true
    }
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
    args: [1, {
      order: [
        'lifecycle',
        'everything-else',
        'render',
        '/on.*/'
      ]
    }],
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
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
    args: [1, {
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
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
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
    args: [1, {
      order: [
        '/on.*/',
        'render',
        '/.*Click/'
      ]
    }],
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
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
    args: [1, {
      order: [
        'constructor',
        'lifecycle',
        'everything-else',
        'render'
      ]
    }],
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
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
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'render must be placed after displayName'}]
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
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'render must be placed after onClick'}]
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
    args: [1, {
      order: [
        'lifecycle',
        'render'
      ]
    }],
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'onClick must be placed after render'}]
  }, {
    // Must validate static properties
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div></div>',
      '  }',
      '  static displayName = \'Hello\'',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{message: 'render must be placed after displayName'}]
  }]
});
