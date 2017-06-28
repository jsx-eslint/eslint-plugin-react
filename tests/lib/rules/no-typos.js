/**
 * @fileoverview Tests for no-typos
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-typos');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ERROR_MESSAGE = 'Typo in static class property declaration';

const ruleTester = new RuleTester();
ruleTester.run('no-typos', rule, {

  valid: [{
    code: [
      'class First {',
      '  static PropTypes = {key: "myValue"};',
      '  static ContextTypes = {key: "myValue"};',
      '  static ChildContextTypes = {key: "myValue"};',
      '  static DefaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  },
  {
    code: [
      'class First {}',
      'First.PropTypes = {key: "myValue"};',
      'First.ContextTypes = {key: "myValue"};',
      'First.ChildContextTypes = {key: "myValue"};',
      'First.DefaultProps = {key: "myValue"};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  static propTypes = {key: "myValue"};',
      '  static contextTypes = {key: "myValue"};',
      '  static childContextTypes = {key: "myValue"};',
      '  static defaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {}',
      'First.propTypes = {key: "myValue"};',
      'First.contextTypes = {key: "myValue"};',
      'First.childContextTypes = {key: "myValue"};',
      'First.defaultProps = {key: "myValue"};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  propTypes = {key: "myValue"};',
      '  contextTypes = {key: "myValue"};',
      '  childContextTypes = {key: "myValue"};',
      '  defaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  PropTypes = {key: "myValue"};',
      '  ContextTypes = {key: "myValue"};',
      '  ChildContextTypes = {key: "myValue"};',
      '  DefaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  proptypes = {key: "myValue"};',
      '  contexttypes = {key: "myValue"};',
      '  childcontextypes = {key: "myValue"};',
      '  defaultprops = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  static PropTypes() {};',
      '  static ContextTypes() {};',
      '  static ChildContextTypes() {};',
      '  static DefaultProps() {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  static proptypes() {};',
      '  static contexttypes() {};',
      '  static childcontexttypes() {};',
      '  static defaultprops() {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {}',
      'MyClass.prototype.PropTypes = function() {};',
      'MyClass.prototype.ContextTypes = function() {};',
      'MyClass.prototype.ChildContextTypes = function() {};',
      'MyClass.prototype.DefaultProps = function() {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {}',
      'MyClass.PropTypes = function() {};',
      'MyClass.ContextTypes = function() {};',
      'MyClass.ChildContextTypes = function() {};',
      'MyClass.DefaultProps = function() {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'function MyRandomFunction() {}',
      'MyRandomFunction.PropTypes = {};',
      'MyRandomFunction.ContextTypes = {};',
      'MyRandomFunction.ChildContextTypes = {};',
      'MyRandomFunction.DefaultProps = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'class Component extends React.Component {',
      '  static PropTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.PropTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.PropTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static proptypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.proptypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.proptypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static ContextTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.ContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.ContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static contexttypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.contexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.contexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static ChildContextTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.ChildContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.ChildContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static childcontexttypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.childcontexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.childcontexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static DefaultProps = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.DefaultProps = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.DefaultProps = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static defaultprops = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.defaultprops = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.defaultprops = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }]
});
