/**
 * @fileoverview Enforce all defaultProps are declared and non-required propTypes
 * @author Vitor Balocco
 * @author Roy Sutton
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/default-props-match-prop-types');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('default-props-match-prop-types', rule, {

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
        'MyStatelessComponent.defaultProps = {',
        '  bar: "bar"',
        '};'
      ].join('\n'),
      options: [{
        allowRequiredDefaults: true
      }]
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
    // createReactClass components
    {
      code: [
        'var Greeting = createReactClass({',
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
        'var Greeting = createReactClass({',
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
        'var Greeting = createReactClass({',
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
        'var Greeting = createReactClass({',
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
        'NotAComponent.defaultProps = {',
        '  bar: "bar"',
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
        'Greeting.defaulProps = {',
        '  bar: "bar"',
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
      parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
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
      parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
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
      code: `
        type PropsA = { foo?: string };
        type PropsB = { bar?: string, fooBar: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props;
          static defaultProps = {
            foo: "foo",
          }

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
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
        'type Props = any;',

        'const Hello = function({ foo }: Props) {',
        '  return <div>Hello {foo}</div>;',
        '};'
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
    },
    // don't error when variable is not in scope with intersection
    {
      code: [
        'import type ImportedProps from "fake";',
        'type Props = ImportedProps & {',
        '  foo: string',
        '};',
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
        '};',
        'MyStatelessComponent.defaultProps = {',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 9,
        column: 3
      }]
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = forbidExtraProps({',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '})',
        'MyStatelessComponent.defaultProps = {',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      settings: {
        propWrapperFunctions: ['forbidExtraProps']
      },
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 9,
        column: 3
      }]
    },
    {
      code: [
        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'const propTypes = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'MyStatelessComponent.propTypes = forbidExtraProps(propTypes);',
        'MyStatelessComponent.defaultProps = {',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      settings: {
        propWrapperFunctions: ['forbidExtraProps']
      },
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 10,
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
        'MyStatelessComponent.defaultProps = {',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 9,
        column: 3
      }],
      options: [{
        allowRequiredDefaults: true
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
        'MyStatelessComponent.defaultProps = {',
        '  bar: "bar"',
        '};',
        'MyStatelessComponent.defaultProps.baz = "baz";'
      ].join('\n'),
      errors: [
        {
          message: 'defaultProp "bar" defined for isRequired propType.',
          line: 9,
          column: 3
        },
        {
          message: 'defaultProp "baz" has no corresponding propTypes declaration.',
          line: 11,
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
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = {',
        '  bar: "bar"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "bar" defined for isRequired propType.',
        line: 10,
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
        '  foo: React.PropTypes.string.isRequired,',
        '  bar: React.PropTypes.string',
        '};',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 2,
        column: 3
      }]
    },
    {
      code: [
        'const defaults = {',
        '  foo: "foo"',
        '};',
        'const types = {',
        '  foo: React.PropTypes.string.isRequired,',
        '  bar: React.PropTypes.string',
        '};',

        'function MyStatelessComponent({ foo, bar }) {',
        '  return <div>{foo}{bar}</div>;',
        '}',
        'MyStatelessComponent.propTypes = types;',
        'MyStatelessComponent.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 2,
        column: 3
      }]
    },

    //
    // createReactClass components
    {
      code: [
        'var Greeting = createReactClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string.isRequired',
        '  },',
        '  getDefaultProps: function() {',
        '    return {',
        '      baz: "baz"',
        '    };',
        '  }',
        '});'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 11,
        column: 7
      }]
    },
    {
      code: [
        'var Greeting = createReactClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.foo} {this.props.bar}</div>;',
        '  },',
        '  propTypes: {',
        '    foo: React.PropTypes.string.isRequired,',
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
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 11,
        column: 7
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
        '};',
        'Greeting.defaultProps = {',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 13,
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
        '  foo: React.PropTypes.string.isRequired,',
        '  bar: React.PropTypes.string',
        '};',
        'Greeting.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 13,
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
        'Greeting.propTypes.foo = React.PropTypes.string.isRequired;',
        'Greeting.defaultProps = {};',
        'Greeting.defaultProps.foo = "foo";'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 13,
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
        'Greeting.defaultProps.baz = "baz";'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 13,
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
        'Greeting.propTypes = {};',
        'Greeting.propTypes.foo = React.PropTypes.string.isRequired;',
        'Greeting.defaultProps = {};',
        'Greeting.defaultProps.foo = "foo";'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
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
        'const props = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'Greeting.propTypes = props;',
        'const defaults = {',
        '  bar: "bar"',
        '};',
        'Greeting.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "bar" defined for isRequired propType.',
        line: 14,
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
        '  baz: "baz"',
        '};',
        'Greeting.propTypes = props;',
        'Greeting.defaultProps = defaults;'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 13,
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
        '      name: React.PropTypes.string.isRequired',
        '    };',
        '  }',
        '  static get defaultProps() {',
        '    return {',
        '      name: "name"',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "name" defined for isRequired propType.',
        line: 9,
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
        '      baz: "world"',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.bar}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 10,
        column: 7
      }]
    },
    {
      code: [
        'const props = {',
        '  foo: React.PropTypes.string',
        '};',
        'const defaults = {',
        '  baz: "baz"',
        '};',

        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return props;',
        '  }',
        '  static get defaultProps() {',
        '    return defaults;',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 5,
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
        '      bar: React.PropTypes.string.isRequired',
        '    };',
        '  }',
        '  static get defaultProps() {',
        '    return defaults;',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.bar}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "bar" defined for isRequired propType.',
        line: 2,
        column: 3
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
        '  static defaultProps = {',
        '    bar: "bar"',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'defaultProp "bar" defined for isRequired propType.',
        line: 12,
        column: 5
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
        'MyStatelessComponent.defaultProps = {',
        '  baz: "baz"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
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
        '  static propTypes = {',
        '    foo: React.PropTypes.string,',
        '    bar: React.PropTypes.string',
        '  };',
        '  static defaultProps = {',
        '    baz: "baz"',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 12,
        column: 5
      }]
    },
    {
      code: [
        'const props = {',
        '  foo: React.PropTypes.string,',
        '  bar: React.PropTypes.string.isRequired',
        '};',
        'const defaults = {',
        '  bar: "bar"',
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
        message: 'defaultProp "bar" defined for isRequired propType.',
        line: 6,
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
        '  baz: "baz"',
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
        message: 'defaultProp "baz" has no corresponding propTypes declaration.',
        line: 6,
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
        '  foo: React.PropTypes.string.isRequired',
        '};',
        'Greetings.Hello.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 11,
        column: 3
      }]
    },
    {
      code: [
        'var Greetings = ({ foo = "foo" }) => {',
        '  return <div>Hello {this.props.foo}</div>;',
        '}',
        'Greetings.propTypes = {',
        '  foo: React.PropTypes.string.isRequired',
        '};',
        'Greetings.defaultProps = {',
        '  foo: "foo"',
        '};'
      ].join('\n'),
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 8,
        column: 3
      }]
    },

    //
    // with Flow annotations
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
        '  foo: "foo"',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 11,
        column: 3
      }]
    },
    // Investigate why this test fails. Flow type not finding foo?
    {
      code: [
        'function Hello(props: { foo: string }) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',
        'Hello.defaultProps = {',
        '  foo: "foo"',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 5,
        column: 3
      }]
    },
    {
      code: [
        'type Props = {',
        '  foo: string',
        '};',

        'function Hello(props: Props) {',
        '  return <div>Hello {props.foo}</div>;',
        '}',
        'Hello.defaultProps = {',
        '  foo: "foo"',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 8,
        column: 3
      }]
    },
    {
      code: [
        'const Hello = (props: { foo: string, bar?: string }) => {',
        '  return <div>Hello {props.foo}</div>;',
        '};',
        'Hello.defaultProps = { foo: "foo", bar: "bar" };'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'defaultProp "foo" defined for isRequired propType.',
        line: 4,
        column: 24
      }]
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
        'Hello.defaultProps = { foo: "foo", frob: "frob" };'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {
          message: 'defaultProp "foo" defined for isRequired propType.',
          line: 12,
          column: 24
        },
        {
          message: 'defaultProp "frob" has no corresponding propTypes declaration.',
          line: 12,
          column: 36
        }
      ]
    },
    {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props;
          static defaultProps = {
            fooBar: "fooBar",
            foo: "foo",
          }

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [
        {
          message: 'defaultProp "fooBar" has no corresponding propTypes declaration.'
        },
        {
          message: 'defaultProp "foo" defined for isRequired propType.'
        }
      ]
    },
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          "firstProperty": PropTypes.string.isRequired,
        };

        SomeComponent.defaultProps = {
          "firstProperty": () => undefined
        };
      `,
      errors: [
        {
          message: 'defaultProp "firstProperty" defined for isRequired propType.'
        }
      ]
    }
  ]
});
