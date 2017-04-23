/**
 * @fileoverview Tests for forbid-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/forbid-prop-types');
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

var ANY_ERROR_MESSAGE = 'Prop type `any` is forbidden';
var ARRAY_ERROR_MESSAGE = 'Prop type `array` is forbidden';
var NUMBER_ERROR_MESSAGE = 'Prop type `number` is forbidden';
var OBJECT_ERROR_MESSAGE = 'Prop type `object` is forbidden';

var ruleTester = new RuleTester();
ruleTester.run('forbid-prop-types', rule, {

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
      '    s: React.PropTypes.string,',
      '    n: React.PropTypes.number,',
      '    i: React.PropTypes.instanceOf,',
      '    b: React.PropTypes.bool',
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
      '    a: React.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object']
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    o: React.PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    o: React.PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
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
      '  a: React.PropTypes.string,',
      '  b: React.PropTypes.string',
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
      '  elem: PropTypes.instanceOf(HTMLElement)',
      '};'
    ].join('\n'),
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
    parser: 'babel-eslint'
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
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends react.component {',
      '  static propTypes = {',
      '    intl: React.propTypes.number,',
      '    ...propTypes',
      '  };',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    n: React.PropTypes.number',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: NUMBER_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }],
    options: [{
      forbid: ['number']
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.object.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
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
      '    s: React.PropTypes.shape({,',
      '      o: React.PropTypes.object',
      '    })',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 1
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    o: React.PropTypes.object',
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
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
      '};'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: 4
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
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
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{
      forbid: ['instanceOf']
    }],
    errors: 1
  }, {
    code: [
      'var object = React.PropTypes.object;',
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{
      forbid: ['object']
    }],
    errors: 1
  }]
});
