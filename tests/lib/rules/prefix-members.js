/**
 * @fileoverview Enforce "_" prefix to user methods in a React component definition
 * @author Adrian Toncean
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/prefix-members');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

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
ruleTester.run('prefix-members', rule, {
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
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  _handleClick: function() {',
      '    console.log(\'click\');',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  _handleClick() {',
      '    console.log(\'click\');',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = {',
      '  renader: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Greeting {',
      '  reander() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  [RENDER]: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  [RENDER]() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }],
  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  reander: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'User-defined component member "reander" must be prefixed with an "_"'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  reander() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'User-defined component member "reander" must be prefixed with an "_"'
    }]
  }]
});
