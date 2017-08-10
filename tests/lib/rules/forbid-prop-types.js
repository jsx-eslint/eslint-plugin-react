/**
 * @fileoverview Tests for forbid-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/forbid-prop-types');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ANY_ERROR_MESSAGE = 'Prop type `any` is forbidden';
const ARRAY_ERROR_MESSAGE = 'Prop type `array` is forbidden';
const NUMBER_ERROR_MESSAGE = 'Prop type `number` is forbidden';
const OBJECT_ERROR_MESSAGE = 'Prop type `object` is forbidden';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-prop-types', rule, {

  valid: [{
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    s: PropTypes.string,',
      '    n: PropTypes.number,',
      '    i: PropTypes.instanceOf,',
      '    b: PropTypes.bool',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object']
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    o: PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string',
      '};',
      'First.propTypes.justforcheck = PropTypes.string;'
    ].join('\n')
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
    ].join('\n')
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
    parser: 'babel-eslint'
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
    ].join('\n')
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
    ].join('\n')
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
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    n: PropTypes.number',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    a: PropTypes.any.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    a: PropTypes.array.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    a: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    a: PropTypes.object.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
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
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 2
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    s: PropTypes.shape({,',
      '      o: PropTypes.object',
      '    })',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 1
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 2
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '};'
    ].join('\n'),
    errors: 4
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = forbidExtraProps({',
      '    a: PropTypes.array',
      '});'
    ].join('\n'),
    errors: 1,
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'import { forbidExtraProps } from "airbnb-prop-types";',
      'export const propTypes = {a: PropTypes.any};',
      'export default function Component() {}',
      'Component.propTypes = forbidExtraProps(propTypes);'
    ].join('\n'),
    // errors: [{message: ANY_ERROR_MESSAGE}], // TODO: make this pass
    errors: [],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = forbidExtraProps({',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  });',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2,
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
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
    options: [{
      forbid: ['instanceOf']
    }],
    errors: 1
  }, {
    code: [
      'var object = PropTypes.object;',
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['object']
    }],
    errors: 1
  }]
});
