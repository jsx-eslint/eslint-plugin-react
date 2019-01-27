/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-multi-comp');
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
ruleTester.run('no-multi-comp', rule, {

  valid: [{
    code: [
      'var Hello = require(\'./components/Hello\');',
      'var HelloJohn = createReactClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\r')
  }, {
    code: [
      'var Heading = createReactClass({',
      '  render: function() {',
      '    return (',
      '      <div>',
      '        {this.props.buttons.map(function(button, index) {',
      '          return <Button {...button} key={index}/>;',
      '        })}',
      '      </div>',
      '    );',
      '  }',
      '});'
    ].join('\r')
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    options: [{
      ignoreStateless: true
    }]
  }, {
    // multiple non-components
    code: [
      'import React, { createElement } from "react"',
      'const helperFoo = () => {',
      '  return true;',
      '};',
      'function helperBar() {',
      '  return false;',
      '};',
      'function RealComponent() {',
      '  return createElement("img");',
      '};'
    ].join('\n'),
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
  }, {
    code: `
      const Hello = React.memo(function(props) {
        return <div>Hello {props.name}</div>;
      });
      class HelloJohn extends React.Component {
        render() {
          return <Hello name="John" />;
        }
      }
    `,
    options: [{
      ignoreStateless: true
    }]
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});',
      'var HelloJohn = createReactClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}',
      'class HelloJohnny extends React.Component {',
      '  render() {',
      '    return <Hello name="Johnny" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }, {
      message: 'Declare only one React component per file',
      line: 11
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Declare only one React component per file',
      line: 4
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    errors: [{
      message: 'Declare only one React component per file',
      line: 4
    }]
  }, {
    code: [
      'export default {',
      '  renderHello(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  },',
      '  renderHello2(props) {',
      '    let {name} = props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }]
  }]
});
