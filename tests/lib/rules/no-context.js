/**
 * @fileoverview Prevent usage of context
 * @author Zach Guo
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-context');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-context', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  propTypes: {',
      '    name: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = function() {',
      '  var context;',
      '  return context;',
      '};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'const Hello = props => {',
      '  return <div>Hello {props.name}</div>;',
      '};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {',
      '    name: React.PropTypes.string',
      '  };',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.PureComponent {',
      '  static propTypes = {',
      '    name: React.PropTypes.string',
      '  };',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '};',
      'Hello.propTypes = {',
      '  name: React.PropTypes.string',
      '};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const names = ["foo", "bar"];',
      '    return (',
      '      <div>',
      '        {names.map((e, i) => <p key={i}>{e}</p>)}',
      '      </div>',
      '    );',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  handleClick = (e, i) => i',
      '  render() {',
      '    return <div onClick={this.handleClick}>Hello {this.props.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const handleClick = (e, i) => i;',
      '    return <div onClick={handleClick}>Hello {this.props.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.context.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  contextTypes: {',
      '    name: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div>Hello {this.context.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }, {
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.context.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '};',
      'Hello.contextTypes = {',
      '  name: React.PropTypes.string',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  static contextTypes = {',
      '    name: React.PropTypes.string',
      '  };',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.PureComponent {',
      '  static contextTypes = {',
      '    name: React.PropTypes.string',
      '  };',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const {name} = this.context;',
      '    return <div>Hello {name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'const Hello = (props, context) => {',
      '  return <div>Hello {context.name}</div>;',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'const Hello = (props, contextRenamed) => {',
      '  return <div>Hello {contextRenamed.name}</div>;',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'const Hello = (props, {name}) => {',
      '  return <div>Hello {name}</div>;',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'const Hello = function(props, context) {',
      '  return <div>Hello {context.name}</div>;',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  handleClick = (e, i) => i',
      '  render() {',
      '    return <div onClick={this.handleClick}>Hello {this.context.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'const Hello = (props, context) => {',
      '  return <div>Hello {context.name}</div>;',
      '};',
      'Hello.contextTypes = {',
      '  name: React.PropTypes.string',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }, {
      message: 'Using context is not allowed.'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  static contextTypes = {',
      '    name: React.PropTypes.string',
      '  };',
      '  render() {',
      '    return <div>Hello {this.context.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Using context is not allowed.'
    }, {
      message: 'Using context is not allowed.'
    }]
  }]
});
