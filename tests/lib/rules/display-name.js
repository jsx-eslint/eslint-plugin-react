/**
 * @fileoverview Prevent missing displayName in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint').ESLintTester;


require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/display-name', {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'class Hello {',
      '  render() {',
      '    return \'Hello World\';',
      '  }',
      '}'
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'class Hello {',
      '  method',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'class Hello extends React.Component {',
      '  static get displayName() {',
      '    return \'Hello\';',
      '  }',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'class Hello extends React.Component {',
      '  static displayName = \'Widget\'',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    args: [1, {
      acceptTranspilerName: true
    }],
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    args: [1, {
      acceptTranspilerName: true
    }]
  }, {
    code: [
      'export default class Hello {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    args: [1, {
      acceptTranspilerName: true
    }]
  }, {
    code: [
      'var Hello;',
      'Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    args: [1, {
      acceptTranspilerName: true
    }],
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return React.createElement("div", {}, "text content");',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: false
    },
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Hello component definition is missing display name'
    }]
  }, {
    code: [
      'function HelloComponent() {',
      '  return React.createClass({',
      '    render: function() {',
      '      return <div>Hello {this.props.name}</div>;',
      '    }',
      '  });',
      '}',
      'module.exports = HelloComponent();'
    ].join('\n'),
    args: [1, {
      acceptTranspilerName: true
    }],
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'export default class {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    args: [1, {
      acceptTranspilerName: true
    }],
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }
]});
