/**
 * @fileoverview Prevent usage of iteration in React render functions (no-render-iteration)
 * @author Eli White
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-render-iteration');
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
ruleTester.run('no-render-iteration', rule, {

  valid: [{
    // ES6 class
    code: [
      'class Hello extends React.Component {',
      '  foo() {}',
      '  render() {',
      '    return <div>{this.foo()}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // ES6 class with render property
    code: [
      'class Hello extends React.Component {',
      '  foo = () => {}',
      '  render = () => {',
      '    return <div>{this.foo()}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Stateless function
    code: [
      'function Hello(props) {',
      '  return <div>{props.foo.map(item => {})}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Stateless arrow function
    code: [
      'var Hello = () => (',
      '  <div>{props.foo.map(item => {})}</div>',
      ');'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // Return in a if...else
    code: [
      'var Hello = React.createClass({',
      '  foo: function() {},',
      '  render: function() {',
      '    if (this.props.name === \'Foo\') {',
      '      return <div>{this.foo()}</div>;',
      '    } else {',
      '      return <div />;',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Not a React component
    code: [
      'class Hello {',
      '  render() {',
      '    array.map(item => item)',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
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
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    const foo = this.props.foo.map(item => item);',
      '    <div>',
      '      {foo}',
      '    </div>',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should not include iteration'
    }]
  }, {
    // Using map in ES6 class
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    const foo = this.props.foo.map(item => item);',
      '    <div>',
      '      {foo}',
      '    </div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should not include iteration'
    }]
  }, {
    // Using map in ES5 class
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    <div>',
      '      {this.props.foo.map(item => item)}',
      '    </div>',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should not include iteration'
    }]
  }, {
    // Using map in ES6 class
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    <div>',
      '      {this.props.foo.map(item => item)}',
      '    </div>',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should not include iteration'
    }]
  }, {
    // Using map in if...else in ES5 class
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    if (this.props.name === \'Foo\') {',
      '      return <div>{this.props.foo.map(item => item)}</div>;',
      '    } else {',
      '      return <div />;',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should not include iteration'
    }]
  }, {
    // Using map ES6 class render property
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    if (this.props.name === \'Foo\') {',
      '      return <div>{this.props.foo.map(item => item)}</div>;',
      '    } else {',
      '      return <div />;',
      '    }',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Your render method should not include iteration'
    }]
  }
]});
