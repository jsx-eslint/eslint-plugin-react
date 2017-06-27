/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Evgueni Naverniouk
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/boolean-prop-naming');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('boolean-prop-naming', rule, {

  valid: [{
    // Should support both `is` and `has` prefixes by default
    code: [
      'var Hello = createReactClass({',
      '  propTypes: {isSomething: PropTypes.bool, hasValue: PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n')
  }, {
    // createReactClass components with PropTypes
    code: [
      'var Hello = createReactClass({',
      '  propTypes: {isSomething: PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    // createReactClass components with React.PropTypes
    code: [
      'var Hello = createReactClass({',
      '  propTypes: {isSomething: React.PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    // React.createClass components with PropTypes
    code: [
      'var Hello = React.createClass({',
      '  propTypes: {isSomething: PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    }
  }, {
    // React.createClass components with non-boolean PropTypes
    code: [
      'var Hello = React.createClass({',
      '  propTypes: {something: PropTypes.any},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    }
  }, {
    // ES6 components as React.Component with boolean PropTypes
    code: [
      'class Hello extends React.Component {',
      '  render () { return <div />; }',
      '}',
      'Hello.propTypes = {isSomething: PropTypes.bool}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    // ES6 components as React.Component with non-boolean PropTypes
    code: [
      'class Hello extends React.Component {',
      '  render () { return <div />; }',
      '}',
      'Hello.propTypes = {something: PropTypes.any}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    // ES6 components as Component with boolean PropTypes
    code: [
      'class Hello extends Component {',
      '  render () { return <div />; }',
      '}',
      'Hello.propTypes = {isSomething: PropTypes.bool}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    // ES6 components with static class properties and PropTypes
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {isSomething: PropTypes.bool};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // ES6 components with static class properties and React.PropTypes
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {isSomething: React.PropTypes.bool};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // ES6 components with static class properties an non-booleans
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {something: PropTypes.any};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // ES6 components and Flowtype booleans
    code: [
      'class Hello extends React.Component {',
      '  props: {isSomething: boolean};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // ES6 components and Flowtype non-booleans
    code: [
      'class Hello extends React.Component {',
      '  props: {something: any};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // Stateless components
    code: [
      'var Hello = ({isSomething}) => { return <div /> }',
      'Hello.propTypes = {isSomething: PropTypes.bool};'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // Functional components and Flowtype booleans
    code: [
      'type Props = {',
      '  isSomething: boolean;',
      '};',
      'function Hello(props: Props): React.Element { return <div /> }'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // Custom `propTypeNames` option
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {',
      '    isSomething: PropTypes.mutuallyExclusiveTrueProps,',
      '    something: PropTypes.bool',
      '  };',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      propTypeNames: ['mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    // Custom PropTypes that are specified as variables
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {',
      '    isSomething: mutuallyExclusiveTrueProps,',
      '    isSomethingElse: bool',
      '  };',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }],

  invalid: [{
    // createReactClass components with PropTypes
    code: [
      'var Hello = createReactClass({',
      '  propTypes: {something: PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // createReactClass components with React.PropTypes
    code: [
      'var Hello = createReactClass({',
      '  propTypes: {something: React.PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // React.createClass components with PropTypes
    code: [
      'var Hello = React.createClass({',
      '  propTypes: {something: PropTypes.bool},',
      '  render: function() { return <div />; }',
      '});'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    },
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // ES6 components as React.Component with boolean PropTypes
    code: [
      'class Hello extends React.Component {',
      '  render () { return <div />; }',
      '}',
      'Hello.propTypes = {something: PropTypes.bool}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // ES6 components as Component with non-boolean PropTypes
    code: [
      'class Hello extends Component {',
      '  render () { return <div />; }',
      '}',
      'Hello.propTypes = {something: PropTypes.bool}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // ES6 components as React.Component with non-boolean PropTypes
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {something: PropTypes.bool};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // ES6 components and Flowtype non-booleans
    code: [
      'class Hello extends React.Component {',
      '  props: {something: boolean};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // Stateless components
    code: [
      'var Hello = ({something}) => { return <div /> }',
      'Hello.propTypes = {something: PropTypes.bool};'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // Functional components and Flowtype booleans
    code: [
      'type Props = {',
      '  something: boolean;',
      '};',
      'function Hello(props: Props): React.Element { return <div /> }'
    ].join('\n'),
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // Custom `propTypeNames` option
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {something: PropTypes.mutuallyExclusiveTrueProps};',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // Should fail for every invalid prop
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {',
      '    something: PropTypes.mutuallyExclusiveTrueProps,',
      '    somethingElse: PropTypes.bool',
      '  };',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }, {
      message: 'Prop name (somethingElse) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    // Custom PropTypes that are specified as variables
    code: [
      'class Hello extends React.Component {',
      '  static propTypes = {',
      '    something: mutuallyExclusiveTrueProps,',
      '    somethingElse: bool',
      '  };',
      '  render () { return <div />; }',
      '}'
    ].join('\n'),
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }, {
      message: 'Prop name (somethingElse) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }]
});
