/**
 * @fileoverview Tests for jsx-sort-default-props
 * @author Vladimir Kattsov
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-sort-default-props');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ERROR_MESSAGE = 'Default prop types declarations should be sorted alphabetically';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-sort-default-props', rule, {
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
      '  propTypes: {',
      '    A: PropTypes.any,',
      '    Z: PropTypes.string,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      A: "A",',
      '      Z: "Z",',
      '      a: "a",',
      '      z: "z"',
      '    };',
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
      '    a: PropTypes.any,',
      '    A: PropTypes.any,',
      '    z: PropTypes.string,',
      '    Z: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      a: "a",',
      '      A: "A",',
      '      z: "z",',
      '      Z: "Z"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      a: "a",',
      '      z: "z"',
      '    };',
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
      '  getDefaultProps: function() {',
      '    return {',
      '      AA: "AA",',
      '      ZZ: "ZZ"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
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
      'First.propTypes.justforcheck = PropTypes.string;',
      'First.defaultProps = {',
      '  a: a,',
      '  z: z',
      '};',
      'First.defaultProps.justforcheck = "justforcheck";'
    ].join('\n')
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
      '};',
      'First.defaultProps = {',
      '  a: "a",',
      '  A: "A",',
      '  z: "z",',
      '  Z: "Z"',
      '};'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    a: "a",',
      '    b: "b",',
      '    c: "c"',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "aria-controls": PropTypes.string',
      '};',
      'Hello.defaultProps = {',
      '  "aria-controls": "aria-controls"',
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
      '  defaultProps: {',
      '    a: "a",',
      '    c: "c",',
      '    b: "b"',
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
      'var First = createReactClass({',
      '  propTypes: {',
      '    barRequired: PropTypes.func.isRequired,',
      '    onBar: PropTypes.func,',
      '    z: PropTypes.any',
      '  },',
      '  getDefaultProps: function() {',
      '    return {',
      '      barRequired: "barRequired",',
      '      onBar: "onBar",',
      '      z: "z"',
      '    };',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    b: "b",',
      '    ...c.defaultProps,',
      '    a: "a"',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    a: PropTypes.string,',
      '    b: PropTypes.string,',
      '    c: PropTypes.string,',
      '    d: PropTypes.string,',
      '    e: PropTypes.string,',
      '    f: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    a: "a",',
      '    b: "b",',
      '    ...c.defaultProps,',
      '    e: "e",',
      '    f: "f",',
      '    ...d.defaultProps',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const defaults = {',
      '  b: "b"',
      '};',
      'const types = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string,',
      '  c: PropTypes.string',
      '};',
      'function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {',
      '  return <div>{a}{b}{c}</div>;',
      '}',
      'StatelessComponentWithSpreadInPropTypes.propTypes = types;',
      'StatelessComponentWithSpreadInPropTypes.defaultProps = {',
      '  c: "c",',
      '  ...defaults,',
      '  a: "a"',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const propTypes = require(\'./externalPropTypes\')',
      'const defaultProps = require(\'./externalDefaultProps\')',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;',
      'TextFieldLabel.defaultProps = defaultProps;'
    ].join('\n')
  }, {
    code: [
      'const First = (props) => <div />;',
      'export const propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '};',
      'export const defaultProps = {',
      '    a: "a",',
      '    z: "z",',
      '};',
      'First.propTypes = propTypes;',
      'First.defaultProps = defaultProps;'
    ].join('\n')
  }],

  invalid: [{
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    a: "a",',
      '    c: "c",',
      '    b: "b"',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    c: "c",',
      '    b: "b",',
      '    a: "a"',
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
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    Z: "Z",',
      '    a: "a",',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreCase: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 8,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.any',
      '  };',
      '  static defaultProps = {',
      '    a: "a",',
      '    Z: "Z",',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 8,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "b": PropTypes.string',
      '};',
      'Hello.defaultProps = {',
      '  "b": "b",',
      '  "a": "a"',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 12,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "b": PropTypes.string,',
      '  "c": PropTypes.string',
      '};',
      'Hello.defaultProps = {',
      '  "c": "c",',
      '  "b": "b",',
      '  "a": "a"',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "B": PropTypes.string,',
      '};',
      'Hello.defaultProps = {',
      '  "a": "a",',
      '  "B": "B",',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 12,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "a": PropTypes.string,',
      '  "B": PropTypes.string,',
      '};',
      'Hello.defaultProps = {',
      '  "B": "B",',
      '  "a": "a",',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreCase: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 12,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'const First = (props) => <div />;',
      'const propTypes = {',
      '  z: PropTypes.string,',
      '  a: PropTypes.any,',
      '};',
      'const defaultProps = {',
      '  z: "z",',
      '  a: "a",',
      '};',
      'First.propTypes = propTypes;',
      'First.defaultProps = defaultProps;'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      line: 8,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    b: "b",',
      '    a: "a",',
      '    ...c.defaultProps',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 9,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    a: PropTypes.string,',
      '    b: PropTypes.string,',
      '    c: PropTypes.string,',
      '    d: PropTypes.string,',
      '    e: PropTypes.string,',
      '    f: PropTypes.string',
      '  }',
      '  static defaultProps = {',
      '    b: "b",',
      '    a: "a",',
      '    ...c.defaultProps,',
      '    f: "f",',
      '    e: "e",',
      '    ...d.defaultProps',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2
  }, {
    code: [
      'const defaults = {',
      '  b: "b"',
      '};',
      'const types = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string,',
      '  c: PropTypes.string',
      '};',
      'function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {',
      '  return <div>{a}{b}{c}</div>;',
      '}',
      'StatelessComponentWithSpreadInPropTypes.propTypes = types;',
      'StatelessComponentWithSpreadInPropTypes.defaultProps = {',
      '  c: "c",',
      '  a: "a",',
      '  ...defaults,',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 15,
      column: 3,
      type: 'Property'
    }]
  }]
});
