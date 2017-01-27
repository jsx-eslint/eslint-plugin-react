/**
 * @fileoverview Enforce a defaultProps definition for every prop that is not a required prop.
 * @author Vitor Balocco
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/require-default-props');
var RuleTester = require('eslint').RuleTester;
var assign = require('object.assign');

require('babel-eslint');

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var ruleTester = new RuleTester({parserOptions: parserOptions});

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('require-default-props', rule, {

  valid: [
    //
    // stateless components
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string.isRequired,',
        '  bar: React.PropTypes.string.isRequired',
        '};'
      ].join('\n')
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'MyStatelessComponent.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'MyStatelessComponent.propTypes.foo = React.PropTypes.string;',
        'MyStatelessComponent.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'MyStatelessComponent.propTypes.foo = React.PropTypes.string;',
        'MyStatelessComponent.defaultProps = {};',
        'MyStatelessComponent.defaultProps.foo = "foo";'
      ].join('\n')
    },
    {
      code: [
        'function MyStatelessComponent({ foo }) {',
        '  return <div>{foo}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {};',
        'MyStatelessComponent.propTypes.foo = React.PropTypes.string;',
        'MyStatelessComponent.defaultProps = {};',
        'MyStatelessComponent.defaultProps.foo = "foo";'
      ].join('\n')
    },
    {
      code: [
        'const types = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'const defaults = {',
        '  foo: "foo"',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n')
    },
    {
      code: [
        'const defaults = {',
        '  foo: "foo"',
        '};',
        'const types = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n')
    },

    //
    // React.createClass components
    {
      code: [
        'var Greeting = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string.isRequired,',
        '    bar: React.PropTypes.string.isRequired',
        '  }',
        '});'
      ].join('\n')
    },
    {
      code: [
        'var Greeting = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string.isRequired',
        '  },',
        '  getDefaultProps: function() {',
        '    return {',
        '      foo: "foo"',
        '    };',
        '  }',
        '});'
      ].join('\n')
    },
    {
      code: [
        'var Greeting = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string',
        '  },',
        '  getDefaultProps: function() {',
        '    return {',
        '      foo: "foo",',
        '      bar: "bar"',
        '    };',
        '  }',
        '});'
      ].join('\n')
    },
    {
      code: [
        'var Greeting = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  }',
        '});'
      ].join('\n')
    },

    //
    // ES6 class component
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  foo: React.PropTypes.string.isRequired,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.propTypes.foo = React.PropTypes.string;',
        'Greeting.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.propTypes.foo = React.PropTypes.string;',
        'Greeting.defaultProps = {};',
        'Greeting.defaultProps.foo = "foo";'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {};',
        'Greeting.propTypes.foo = React.PropTypes.string;',
        'Greeting.defaultProps = {};',
        'Greeting.defaultProps.foo = "foo";'
      ].join('\n')
    },

    //
    // edge cases

    // not a react component
    {
      code: [
        'function NotAComponent({ foo, bar }) {}',
        'NotAComponent.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Greeting {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  bar: React.PropTypes.string.isRequired',
        '};'
      ].join('\n')
    },
    // external references
    {
      code: [
        'const defaults = require("./defaults");',
        'const types = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n')
    },
    {
      code: [
        'const defaults = {',
        '  foo: "foo"',
        '};',
        'const types = require("./propTypes");',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n')
    },
    {
      code: [
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = require("./defaults").foo;',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = require("./defaults").foo;',
        'MyStatelessComponent.defaultProps.bar = "bar";',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'import defaults from "./defaults";',

        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = defaults;',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n'),
      parserOptions: assign({sourceType: 'module'}, parserOptions)
    },
    {
      code: [
        'import { foo } from "./defaults";',

        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = foo;',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n'),
      parserOptions: assign({sourceType: 'module'}, parserOptions)
    },
    // using spread operator
    {
      code: [
        'const component = rowsOfType(GuestlistEntry, (rowData, ownProps) => ({',
        '    ...rowData,',
        '    onPress: () => ownProps.onPress(rowData.id),',
        '}));'
      ].join('\n')
    },
    {
      code: [
        'MyStatelessComponent.propTypes = {',
        '  ...stuff,',
        '  foo: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = {',
        ' foo: "foo"',
        '};',
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = {',
        ' ...defaults,',
        '};',
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  ...someProps,',
        '  bar: React.PropTypes.string.isRequired',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.defaultProps = {',
        '  ...defaults,',
        '  bar: "bar"',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.defaultProps = {',
        '  ...defaults,',
        '  bar: "bar"',
        '};'
      ].join('\n')
    },

    //
    // with Flow annotations
    {
      code: [
        'type Props = {',
        '  foo: string',
        '};',

        'class Hello extends React.Component {',
        '  props: Props;',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'type Props = {',
        '  foo: string,',
        '  bar?: string',
        '};',

        'class Hello extends React.Component {',
        '  props: Props;',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',

        'Hello.defaultProps = {',
        '  bar: "bar"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo: string,',
        '    bar?: string',
        '  };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',

        'Hello.defaultProps = {',
        '  bar: "bar"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo: string',
        '  };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'function Hello(props: { foo?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',

        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'function Hello(props: { foo: string }) {',
        '  return <div>Hello {foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'const Hello = (props: { foo?: string }) => {',
        '  return <div>Hello {props.foo}</div>;',
        '};',

        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'const Hello = (props: { foo: string }) => {',
        '  return <div>Hello {foo}</div>;',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'const Hello = function(props: { foo?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '};',

        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'const Hello = function(props: { foo: string }) {',
        '  return <div>Hello {foo}</div>;',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'type Props = {',
        '  foo: string,',
        '  bar?: string',
        '};',

        'type Props2 = {',
        '  foo: string,',
        '  baz?: string',
        '}',

        'function Hello(props: Props | Props2) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',

        'Hello.defaultProps = {',
        '  bar: "bar",',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'import type ImportedProps from "fake";',
        'type Props = ImportedProps;',
        'function Hello(props: Props) {',
        '  return <div>Hello {props.name.firstname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    // don't error when variable is not in scope
    {
      code: [
        'import type { ImportedType } from "fake";',
        'type Props = ImportedType;',
        'function Hello(props: Props) {',
        '  return <div>Hello {props.name.firstname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    // make sure error is not thrown with multiple assignments
    {
      code: [
        'import type ImportedProps from "fake";',
        'type NestedProps = ImportedProps;',
        'type Props = NestedProps;',
        'function Hello(props: Props) {',
        '  return <div>Hello {props.name.firstname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    //
    // stateless components
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 5,
        column: 3
      }]
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'MyStatelessComponent.propTypes.baz = React.propTypes.string;'
      ].join('\n'),
      errors: [
        {
          message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
          line: 5,
          column: 3
        },
        {
          message: 'propType "baz" is not required, but has no corresponding defaultProp declaration.',
          line: 8,
          column: 1
        }
      ]
    },
    {
      code: [
        'const types = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'const defaults = {',
        '  foo: "foo"',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 9,
        column: 3
      }]
    },
    {
      code: [
        'const defaults = {',
        '  foo: "foo"',
        '};',
        'const types = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 6,
        column: 3
      }]
    },

    //
    // React.createClass components
    {
      code: [
        'var Greeting = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string.isRequired',
        '  }',
        '});'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 6,
        column: 5
      }]
    },
    {
      code: [
        'var Greeting = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string',
        '  },',
        '  getDefaultProps: function() {',
        '    return {',
        '      foo: "foo"',
        '    };',
        '  }',
        '});'
      ].join('\n'),
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 7,
        column: 5
      }]
    },

    //
    // ES6 class component
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 9,
        column: 3
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string',
        '};',
        'Greeting.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 10,
        column: 3
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.propTypes.foo = React.PropTypes.string;'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 11,
        column: 1
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {',
        '  bar: React.PropTypes.string',
        '};',
        'Greeting.propTypes.foo = React.PropTypes.string;',
        'Greeting.defaultProps = {};',
        'Greeting.defaultProps.foo = "foo";'
      ].join('\n'),
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 9,
        column: 3
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'Greeting.propTypes = {};',
        'Greeting.propTypes.foo = React.PropTypes.string;',
        'Greeting.defaultProps = {};',
        'Greeting.defaultProps.bar = "bar";'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 9,
        column: 1
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'const props = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.propTypes = props;'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 9,
        column: 3
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '}',
        'const props = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string',
        '};',
        'const defaults = {',
        '  foo: "foo"',
        '};',
        'Greeting.propTypes = props;',
        'Greeting.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 10,
        column: 3
      }]
    },

    //
    // ES6 classes with static getter methods
    {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: React.PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'propType "name" is not required, but has no corresponding defaultProp declaration.',
        line: 4,
        column: 7
      }]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      foo: React.PropTypes.string,',
        '      bar: React.PropTypes.string',
        '    };',
        '  }',
        '  static get defaultProps() {',
        '    return {',
        '      bar: "world"',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 4,
        column: 7
      }]
    },
    {
      code: [
        'const props = {',
        '  foo: React.PropTypes.string',
        '};',

        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return props;',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'const defaults = {',
        '  bar: "world"',
        '};',

        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      foo: React.PropTypes.string,',
        '      bar: React.PropTypes.string',
        '    };',
        '  }',
        '  static get defaultProps() {',
        '    return defaults;',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 7,
        column: 7
      }]
    },

    //
    // ES6 classes with property initializers
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '  static propTypes = {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string.isRequired',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 8,
        column: 5
      }]
    },
    {
      code: [
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '  static propTypes = {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string',
        '  };',
        '  static defaultProps = {',
        '    foo: "foo"',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 9,
        column: 5
      }]
    },
    {
      code: [
        'const props = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '  static propTypes = props;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'const props = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string',
        '};',
        'const defaults = {',
        '  foo: "foo"',
        '};',
        'class Greeting extends React.Component {',
        '  render() {',
        '    return (',
        '      <h1>Hello, {this.props.foo} {this.props.bar}</h1>',
        '    );',
        '  }',
        '  static propTypes = props;',
        '  static defaultProps = defaults;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 3,
        column: 3
      }]
    },

    //
    // edge cases
    {
      code: [
        'let Greetings = {};',
        'Greetings.Hello = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {',
        '  foo: React.PropTypes.string',
        '};'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 8,
        column: 3
      }]
    },
    {
      code: [
        'var Greetings = ({ foo = "foo" }) => {',
        '  return <div>Hello {this.props.foo}</div>;',
        '}',
        'Greetings.propTypes = {',
        '  foo: React.PropTypes.string',
        '};'
      ].join('\n'),
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 5,
        column: 3
      }]
    },

    //
    // with Flow annotations
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo?: string,',
        '    bar?: string',
        '  };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',

        'Hello.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 4,
        column: 5
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo: string,',
        '  bar?: string',
        '};',

        'class Hello extends React.Component {',
        '  props: Props;',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 3,
        column: 3
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo?: string',
        '};',

        'class Hello extends React.Component {',
        '  props: Props;',

        '  static defaultProps: { foo: string };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo: string,',
        '    bar?: string',
        '  };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 4,
        column: 5
      }]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo?: string,',
        '    bar?: string',
        '  };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
          line: 3,
          column: 5
        },
        {
          message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
          line: 4,
          column: 5
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo?: string',
        '  };',

        '  static defaultProps: { foo: string };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 3,
        column: 5
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo?: string,',
        '  bar?: string',
        '};',

        'class Hello extends React.Component {',
        '  props: Props;',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',

        'Hello.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 3,
        column: 3
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo?: string,',
        '  bar?: string',
        '};',

        'class Hello extends React.Component {',
        '  props: Props;',

        '  static defaultProps: { foo: string, bar: string };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',

        'Hello.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 3,
        column: 3
      }]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    foo?: string,',
        '    bar?: string',
        '  };',

        '  static defaultProps: { foo: string, bar: string };',

        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}',

        'Hello.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 4,
        column: 5
      }]
    },
    {
      code: [
        'function Hello(props: { foo?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 25
      }]
    },
    {
      code: [
        'function Hello({ foo = "foo" }: { foo?: string }) {',
        '  return <div>Hello {foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 35
      }]
    },
    {
      code: [
        'function Hello(props: { foo?: string, bar?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',
        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 39
      }]
    },
    {
      code: [
        'function Hello(props: { foo?: string, bar?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
          line: 1,
          column: 25
        },
        {
          message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
          line: 1,
          column: 39
        }
      ]
    },
    {
      code: [
        'type Props = {',
        '  foo?: string',
        '};',

        'function Hello(props: Props) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'const Hello = (props: { foo?: string }) => {',
        '  return <div>Hello {props.foo}</div>;',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 25
      }]
    },
    {
      code: [
        'const Hello = (props: { foo?: string, bar?: string }) => {',
        '  return <div>Hello {props.foo}</div>;',
        '};',
        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 39
      }]
    },
    {
      code: [
        'const Hello = function(props: { foo?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 33
      }]
    },
    {
      code: [
        'const Hello = function(props: { foo?: string, bar?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '};',
        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 1,
        column: 47
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo?: string',
        '};',

        'function Hello(props: Props) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo?: string,',
        '  bar?: string',
        '};',

        'function Hello(props: Props) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',
        'Hello.defaultProps = { foo: "foo" };'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
        line: 3,
        column: 3
      }]
    },

    // UnionType
    {
      code: [
        'function Hello(props: { one?: string } | { two?: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "one" is not required, but has no corresponding defaultProp declaration.',
          line: 1,
          column: 25
        },
        {
          message: 'propType "two" is not required, but has no corresponding defaultProp declaration.',
          line: 1,
          column: 44
        }
      ]
    },
    {
      code: [
        'type Props = {',
        '  foo: string,',
        '  bar?: string',
        '};',

        'type Props2 = {',
        '  foo: string,',
        '  baz?: string',
        '}',

        'function Hello(props: Props | Props2) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "bar" is not required, but has no corresponding defaultProp declaration.',
          line: 3,
          column: 3
        },
        {
          message: 'propType "baz" is not required, but has no corresponding defaultProp declaration.',
          line: 7,
          column: 3
        }
      ]
    },
    {
      code: [
        'type Props = {',
        '  foo: string,',
        '  bar?: string',
        '};',

        'type Props2 = {',
        '  foo: string,',
        '  baz?: string',
        '}',

        'function Hello(props: Props | Props2) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',

        'Hello.defaultProps = {',
        '  bar: "bar"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "baz" is not required, but has no corresponding defaultProp declaration.',
          line: 7,
          column: 3
        }
      ]
    },
    {
      code: [
        'type HelloProps = {',
        '  two?: string,',
        '  three: string',
        '};',
        'function Hello(props: { one?: string } | HelloProps) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "two" is not required, but has no corresponding defaultProp declaration.',
          line: 2,
          column: 3
        },
        {
          message: 'propType "one" is not required, but has no corresponding defaultProp declaration.',
          line: 5,
          column: 25
        }
      ]
    },
    {
      code: [
        'type HelloProps = {',
        '  two?: string,',
        '  three: string',
        '};',
        'function Hello(props: ExternalProps | HelloProps) {',
        '  return <div>Hello {props.foo}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "two" is not required, but has no corresponding defaultProp declaration.',
          line: 2,
          column: 3
        }
      ]
    },
    {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'propType "foo" is not required, but has no corresponding defaultProp declaration.',
          line: 3,
          column: 5
        }
      ]
    }
  ]
});
