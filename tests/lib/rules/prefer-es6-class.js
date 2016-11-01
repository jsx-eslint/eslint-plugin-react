/**
 * @fileoverview Prefer es6 class instead of createClass for React Component
 * @author Dan Hamilton
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/prefer-es6-class');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('prefer-es6-class', rule, {

  valid: [{
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'export default class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = "foo";',
      'module.exports = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Component should use es6 class instead of createClass'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component should use es6 class instead of createClass'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: ['never'],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component should use createClass instead of es6 class'
    }]
  }]
});
