/**
 * @fileoverview Tests for sort-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/sort-prop-types');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Prop types declarations should be sorted alphabetically';

var ruleTester = new RuleTester();
ruleTester.run('sort-prop-types', rule, {

  valid: [{
    code: [
      'var First = React.createClass({',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
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
      'var First = React.createClass({',
      '  propTypes: {',
      '    A: React.PropTypes.any,',
      '    Z: React.PropTypes.string,',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    A: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    Z: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = React.createClass({',
      '  propTypes: {',
      '    AA: React.PropTypes.any,',
      '    ZZ: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: React.PropTypes.string,',
      '  z: React.PropTypes.string',
      '};',
      'First.propTypes.justforcheck = React.PropTypes.string;'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: React.PropTypes.any,',
      '  A: React.PropTypes.any,',
      '  z: React.PropTypes.string,',
      '  Z: React.PropTypes.string',
      '};'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: React.PropTypes.any,',
      '    b: React.PropTypes.any,',
      '    c: React.PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "aria-controls": React.PropTypes.string',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreCase: true
    }]
  }, {
    // Invalid code, should not be validated
    code: [
      'class Component extends React.Component {',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    c: React.PropTypes.any,',
      '    b: React.PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    barRequired: React.PropTypes.func.isRequired,',
      '    onBar: React.PropTypes.func,',
      '    z: React.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onBar: React.PropTypes.func,',
      '    onFoo: React.PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onBar: React.PropTypes.func,',
      '    onFoo: React.PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onBar: React.PropTypes.func,',
      '    onFoo: React.PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    barRequired: React.PropTypes.string.isRequired,',
      '    a: React.PropTypes.any',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    fooRequired: MyPropType,',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    barRequired: React.PropTypes.string.isRequired,',
      '    fooRequired: React.PropTypes.any.isRequired,',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onBar: React.PropTypes.func,',
      '    onFoo: React.PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true,
      callbacksLast: true
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    z: React.PropTypes.string,',
      '    a: React.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    z: React.PropTypes.any,',
      '    Z: React.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    Z: React.PropTypes.any,',
      '    a: React.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    A: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    Z: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    Zz: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = React.createClass({',
      '  propTypes: {',
      '    aAA: React.PropTypes.any,',
      '    ZZ: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    yy: React.PropTypes.any,',
      '    bb: React.PropTypes.string',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    aAA: React.PropTypes.any,',
      '    ZZ: React.PropTypes.string',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    z: React.PropTypes.any,',
      '    y: React.PropTypes.any,',
      '    a: React.PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onFoo: React.PropTypes.func,',
      '    onBar: React.PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onFoo: React.PropTypes.func,',
      '    onBar: React.PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: React.PropTypes.any,',
      '    z: React.PropTypes.string,',
      '    onFoo: React.PropTypes.func,',
      '    onBar: React.PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    onBar: React.PropTypes.func,',
      '    onFoo: React.PropTypes.func,',
      '    z: React.PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Callback prop types must be listed after all other prop types',
      line: 5,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    fooRequired: React.PropTypes.string.isRequired,',
      '    barRequired: React.PropTypes.string.isRequired,',
      '    a: React.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any,',
      '    barRequired: React.PropTypes.string.isRequired,',
      '    onFoo: React.PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    parserOptions: parserOptions,
    errors: [{
      message: 'Required prop types must be listed before all other prop types',
      line: 4,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...a.propTypes,',
      '    d: PropTypes.string,',
      '    c: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop types declarations should be sorted alphabetically',
      line: 6,
      column: 5,
      type: 'Property'
    }]
  }]
});
