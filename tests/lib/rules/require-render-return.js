/**
 * @fileoverview Enforce ES5 or ES6 class for returning value in render function.
 * @author Mark Orel
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/require-render-return');
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
ruleTester.run('require-render-return', rule, {

  valid: [{
    // ES6 class
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // ES6 class with render property
    code: [
      'class Hello extends React.Component {',
      '  render = () => {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // ES6 class with render property (implicit return)
    code: [
      'class Hello extends React.Component {',
      '  render = () => (',
      '    <div>Hello {this.props.name}</div>',
      '  )',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // ES5 class
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div></div>',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Stateless function
    code: [
      'function Hello() {',
      '  return <div></div>;',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Stateless arrow function
    code: [
      'var Hello = () => (',
      '  <div></div>',
      ');'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Return in a switch...case
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    switch (this.props.name) {',
      '      case \'Foo\':',
      '        return <div>Hello Foo</div>;',
      '      default:',
      '        return <div>Hello {this.props.name}</div>;',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Return in a if...else
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    if (this.props.name === \'Foo\') {',
      '      return <div>Hello Foo</div>;',
      '    } else {',
      '      return <div>Hello {this.props.name}</div>;',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Not a React component
    code: [
      'class Hello {',
      '  render() {}',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // ES6 class without a render method
    code: 'class Hello extends React.Component {}',
    parserOptions: parserOptions
  }, {
    // ES5 class without a render method
    code: 'var Hello = React.createClass({});',
    parserOptions: parserOptions
  }, {
    // ES5 class with an imported render method
    code: [
      'var render = require(\'./render\');',
      'var Hello = React.createClass({',
      '  render',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Invalid render method (but accepted by Babel)
    code: [
      'class Foo extends Component {',
      '  render',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    // Missing return in ES5 class
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {}',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }, {
    // Missing return in ES6 class
    code: [
      'class Hello extends React.Component {',
      '  render() {} ',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }, {
    // Missing return (but one is present in a sub-function)
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const names = this.props.names.map(function(name) {',
      '      return <div>{name}</div>',
      '    });',
      '  } ',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }, {
    // Missing return ES6 class render property
    code: [
      'class Hello extends React.Component {',
      '  render = () => {',
      '    <div>Hello {this.props.name}</div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }]
});
