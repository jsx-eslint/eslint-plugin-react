/**
 * @fileoverview Prevent missing displayName in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/display-name');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var settings = {
  react: {
    pragma: 'Foo'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('display-name', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello {',
      '  render() {',
      '    return \'Hello World\';',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends Greetings {',
      '  static text = \'Hello World\';',
      '  render() {',
      '    return Hello.text;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'class Hello {',
      '  method;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
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
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  static displayName = \'Widget\';',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
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
    parser: 'babel-eslint'
  }, {
    code: [
      'export default class Hello {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello;',
      'Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'module.exports = React.createClass({',
      '  "displayName": "Hello",',
      '  "render": function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'export default class {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = function() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'function Hello() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = () => {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'module.exports = function Hello() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'function Hello() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}',
      'Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = () => {',
      '  return <div>Hello {this.props.name}</div>;',
      '}',
      'Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = function() {',
      '  return <div>Hello {this.props.name}</div>;',
      '}',
      'Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Mixins = {',
      '  Greetings: {',
      '    Hello: function() {',
      '      return <div>Hello {this.props.name}</div>;',
      '    }',
      '  }',
      '}',
      'Mixins.Greetings.Hello.displayName = \'Hello\';'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  },',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  },',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'const Mixin = {',
      '  Button() {',
      '    return (',
      '      <button />',
      '    );',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var obj = {',
      '  pouf: function() {',
      '    return any',
      '  }',
      '};'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'var obj = {',
      '  pouf: function() {',
      '    return any',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'export default {',
      '  renderHello() {',
      '    let {name} = this.props;',
      '    return <div>{name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'import React, { createClass } from \'react\';',
      'export default createClass({',
      '  displayName: \'Foo\',',
      '  render() {',
      '    return <h1>foo</h1>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'import React, {Component} from "react";',
      'function someDecorator(ComposedComponent) {',
      '  return class MyDecorator extends Component {',
      '    render() {return <ComposedComponent {...this.props} />;}',
      '  };',
      '}',
      'module.exports = someDecorator;'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const element = (',
      '  <Media query={query} render={() => {',
      '    renderWasCalled = true',
      '    return <div/>',
      '  }}/>',
      ')'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const element = (',
      '  <Media query={query} render={function() {',
      '    renderWasCalled = true',
      '    return <div/>',
      '  }}/>',
      ')'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'module.exports = {',
      '  createElement: tagName => document.createElement(tagName)',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const { createElement } = document;',
      'createElement("a");'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return React.createElement("div", {}, "text content");',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
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
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
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
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component definition is missing display name'
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
    options: [{
      ignoreTranspilerName: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'module.exports = () => {',
      '  return <div>Hello {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'module.exports = function() {',
      '  return <div>Hello {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'module.exports = React.createClass({',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  },',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'var Hello = Foo.createClass({',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  },',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    settings: settings,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      '/** @jsx Foo */',
      'var Hello = Foo.createClass({',
      '  _renderHello: function() {',
      '    return <span>Hello {this.props.name}</span>;',
      '  },',
      '  render: function() {',
      '    return <div>{this._renderHello()}</div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'const Mixin = {',
      '  Button() {',
      '    return (',
      '      <button />',
      '    );',
      '  }',
      '};'
    ].join('\n'),
    options: [{
      ignoreTranspilerName: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'import React, { createElement } from "react";',
      'export default (props) => {',
      '  return createElement("div", {}, "hello");',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'import React from "react";',
      'const { createElement } = React;',
      'export default (props) => {',
      '  return createElement("div", {}, "hello");',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: [
      'import React from "react";',
      'const createElement = React.createElement;',
      'export default (props) => {',
      '  return createElement("div", {}, "hello");',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }]
});
