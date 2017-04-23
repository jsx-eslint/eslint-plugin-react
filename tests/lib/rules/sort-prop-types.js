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
      'var First = createReactClass({',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    A: PropTypes.any,',
      '    Z: PropTypes.string,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    A: PropTypes.any,',
      '    z: PropTypes.string,',
      '    Z: PropTypes.string',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    AA: PropTypes.any,',
      '    ZZ: PropTypes.string',
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
      '  a: PropTypes.string,',
      '  z: PropTypes.string',
      '};',
      'First.propTypes.justforcheck = PropTypes.string;'
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
      '  a: PropTypes.any,',
      '  A: PropTypes.any,',
      '  z: PropTypes.string,',
      '  Z: PropTypes.string',
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
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
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
      '  "aria-controls": PropTypes.string',
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
      '    a: PropTypes.any,',
      '    c: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = createReactClass({',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    barRequired: PropTypes.func.isRequired,',
      '    onBar: PropTypes.func,',
      '    z: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
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
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
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
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
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
      '    barRequired: PropTypes.string.isRequired,',
      '    a: PropTypes.any',
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
      '    barRequired: PropTypes.string.isRequired,',
      '    fooRequired: PropTypes.any.isRequired,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
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
  }, {
    code: [
      'const propTypes = require(\'./externalPropTypes\')',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    z: PropTypes.string,',
      '    a: PropTypes.any',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    z: PropTypes.any,',
      '    Z: PropTypes.any',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    Z: PropTypes.any,',
      '    a: PropTypes.any',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    A: PropTypes.any,',
      '    z: PropTypes.string,',
      '    Z: PropTypes.string',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    Zz: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    aAA: PropTypes.any,',
      '    ZZ: PropTypes.string',
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
      '    yy: PropTypes.any,',
      '    bb: PropTypes.string',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    aAA: PropTypes.any,',
      '    ZZ: PropTypes.string',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 2
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    z: PropTypes.any,',
      '    y: PropTypes.any,',
      '    a: PropTypes.any',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
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
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
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
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func,',
      '    z: PropTypes.string',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    fooRequired: PropTypes.string.isRequired,',
      '    barRequired: PropTypes.string.isRequired,',
      '    a: PropTypes.any',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    barRequired: PropTypes.string.isRequired,',
      '    onFoo: PropTypes.func',
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
  }, {
    code: [
      'const propTypes = {',
      '  b: PropTypes.string,',
      '  a: PropTypes.string,',
      '};',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      line: 3,
      column: 3,
      type: 'Property'
    }]
  }]
});
