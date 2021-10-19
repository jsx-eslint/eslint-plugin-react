/**
 * @fileoverview Enforce all defaultProps are declared and non-required propTypes
 * @author Vitor Balocco
 * @author Roy Sutton
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/default-props-match-prop-types');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('default-props-match-prop-types', rule, {
  valid: parsers.all([
    // stateless components
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string.isRequired,
          bar: React.PropTypes.string.isRequired
        };
      `,
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.defaultProps = {
          foo: "foo"
        };
      `,
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes.foo = React.PropTypes.string;
        MyStatelessComponent.defaultProps = {
          foo: "foo"
        };
      `,
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.defaultProps = {
          bar: "bar"
        };
      `,
      options: [
        { allowRequiredDefaults: true },
      ],
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes.foo = React.PropTypes.string;
        MyStatelessComponent.defaultProps = {};
        MyStatelessComponent.defaultProps.foo = "foo";
      `,
    },
    {
      code: `
        function MyStatelessComponent({ foo }) {
          return <div>{foo}</div>;
        }
        MyStatelessComponent.propTypes = {};
        MyStatelessComponent.propTypes.foo = React.PropTypes.string;
        MyStatelessComponent.defaultProps = {};
        MyStatelessComponent.defaultProps.foo = "foo";
      `,
    },
    {
      code: `
        const types = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = {
          foo: "foo"
        };
      `,
    },
    {
      code: `
        const defaults = {
          foo: "foo"
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.defaultProps = defaults;
      `,
    },
    {
      code: `
        const defaults = {
          foo: "foo"
        };
        const types = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = defaults;
      `,
    },

    // createReactClass components
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: React.PropTypes.string.isRequired,
            bar: React.PropTypes.string.isRequired
          }
        });
      `,
    },
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: React.PropTypes.string,
            bar: React.PropTypes.string.isRequired
          },
          getDefaultProps: function() {
            return {
              foo: "foo"
            };
          }
        });
      `,
    },
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: React.PropTypes.string,
            bar: React.PropTypes.string
          },
          getDefaultProps: function() {
            return {
              foo: "foo",
              bar: "bar"
            };
          }
        });
      `,
    },
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          }
        });
      `,
    },

    // ES6 class component
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        Greeting.defaultProps = {
          foo: "foo"
        };
      `,
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
      `,
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          bar: React.PropTypes.string.isRequired
        };
        Greeting.propTypes.foo = React.PropTypes.string;
        Greeting.defaultProps = {
          foo: "foo"
        };
      `,
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          bar: React.PropTypes.string.isRequired
        };
        Greeting.propTypes.foo = React.PropTypes.string;
        Greeting.defaultProps = {};
        Greeting.defaultProps.foo = "foo";
      `,
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {};
        Greeting.propTypes.foo = React.PropTypes.string;
        Greeting.defaultProps = {};
        Greeting.defaultProps.foo = "foo";
      `,
    },

    // edge cases

    // not a react component
    {
      code: `
        function NotAComponent({ foo, bar }) {}
        NotAComponent.defaultProps = {
          bar: "bar"
        };
      `,
    },
    {
      code: `
        class Greeting {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.defaulProps = {
          bar: "bar"
        };
      `,
    },
    // external references
    {
      code: `
        const defaults = require("./defaults");
        const types = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = defaults;
      `,
    },
    {
      code: `
        const defaults = {
          foo: "foo"
        };
        const types = require("./propTypes");

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = defaults;
      `,
    },
    {
      code: `
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = require("./defaults").foo;

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
    },
    {
      code: `
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = require("./defaults").foo;
        MyStatelessComponent.defaultProps.bar = "bar";

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
    },
    {
      code: `
        import defaults from "./defaults";

        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = defaults;

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
    },
    {
      code: `
        import { foo } from "./defaults";

        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = foo;

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
    },
    // using spread operator
    {
      code: `
        const component = rowsOfType(GuestlistEntry, (rowData, ownProps) => ({
            ...rowData,
            onPress: () => ownProps.onPress(rowData.id),
        }));
      `,
    },
    {
      code: `
        MyStatelessComponent.propTypes = {
          ...stuff,
          foo: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = {
         foo: "foo"
        };
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
    },
    {
      code: `
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = {
         ...defaults,
        };
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
      `,
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          ...someProps,
          bar: React.PropTypes.string.isRequired
        };
      `,
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        Greeting.defaultProps = {
          ...defaults,
          bar: "bar"
        };
      `,
    },

    // with Flow annotations
    {
      code: `
        type Props = {
          foo: string
        };

        class Hello extends React.Component {
          props: Props;

          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {
          foo: string,
          bar?: string
        };

        class Hello extends React.Component {
          props: Props;

          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }

        Hello.defaultProps = {
          bar: "bar"
        };
      `,
      features: ['types'],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            foo: string,
            bar?: string
          };

          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }

        Hello.defaultProps = {
          bar: "bar"
        };
      `,
      features: ['types'],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            foo: string
          };

          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        function Hello(props: { foo?: string }) {
          return <div>Hello {props.foo}</div>;
        }

        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['types'],
    },
    {
      code: `
        function Hello(props: { foo: string }) {
          return <div>Hello {foo}</div>;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        const Hello = (props: { foo?: string }) => {
          return <div>Hello {props.foo}</div>;
        };

        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['types'],
    },
    {
      code: `
        const Hello = (props: { foo: string }) => {
          return <div>Hello {foo}</div>;
        };
      `,
      features: ['types'],
    },
    {
      code: `
        const Hello = function(props: { foo?: string }) {
          return <div>Hello {props.foo}</div>;
        };

        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['types'],
    },
    {
      code: `
        const Hello = function(props: { foo: string }) {
          return <div>Hello {foo}</div>;
        };
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {
          foo: string,
          bar?: string
        };

        type Props2 = {
          foo: string,
          baz?: string
        }

        function Hello(props: Props | Props2) {
          return <div>Hello {props.foo}</div>;
        }

        Hello.defaultProps = {
          bar: "bar",
          baz: "baz"
        };
      `,
      features: ['types'],
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
      features: ['types'],
    },
    {
      code: `
        import type Props from "fake";
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = any;

        const Hello = function({ foo }: Props) {
          return <div>Hello {foo}</div>;
        };
      `,
      features: ['types'],
    },
    {
      code: `
        import type ImportedProps from "fake";
        type Props = ImportedProps;
        function Hello(props: Props) {
          return <div>Hello {props.name.firstname}</div>;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type DefaultProps1 = {|
          bar1?: string
        |};
        type DefaultProps2 = {|
          ...DefaultProps1,
          bar2?: string
        |};
        type Props = {
          foo: string,
          ...DefaultProps2
        };

        function Hello(props: Props) {
          return <div>Hello {props.foo}</div>;
        }

        Hello.defaultProps = {
          bar1: "bar1",
          bar2: "bar2",
        };
      `,
      features: ['flow'],
    },
    {
      code: `
        type DefaultProps1 = {|
          bar1?: string
        |};
        type DefaultProps2 = {|
          ...DefaultProps1,
          bar2?: string
        |};
        type Props = {
          foo: string,
          ...DefaultProps2
        };

        class Hello extends React.Component<Props> {
          render() {
            return <div>Hello {props.foo}</div>;
          }
        }

        Hello.defaultProps = {
          bar1: "bar1",
          bar2: "bar2",
        };
      `,
      features: ['flow'],
    },
    // don't error when variable is not in scope
    {
      code: `
        import type { ImportedType } from "fake";
        type Props = ImportedType;
        function Hello(props: Props) {
          return <div>Hello {props.name.firstname}</div>;
        }
      `,
      features: ['types'],
    },
    // make sure error is not thrown with multiple assignments
    {
      code: `
        import type ImportedProps from "fake";
        type NestedProps = ImportedProps;
        type Props = NestedProps;
        function Hello(props: Props) {
          return <div>Hello {props.name.firstname}</div>;
        }
      `,
      features: ['types'],
    },
    // don't error when variable is not in scope with intersection
    {
      code: `
        import type ImportedProps from "fake";
        type Props = ImportedProps & {
          foo: string
        };
        function Hello(props: Props) {
          return <div>Hello {props.name.firstname}</div>;
        }
      `,
      features: ['types'],
    },
  ]),

  invalid: parsers.all([
    // stateless components
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.defaultProps = {
          baz: "baz"
        };
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 10,
          column: 11,
        },
      ],
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = forbidExtraProps({
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        })
        MyStatelessComponent.defaultProps = {
          baz: "baz"
        };
      `,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 10,
          column: 11,
        },
      ],
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        const propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes = forbidExtraProps(propTypes);
        MyStatelessComponent.defaultProps = {
          baz: "baz"
        };
      `,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 11,
          column: 11,
        },
      ],
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.defaultProps = {
          baz: "baz"
        };
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 10,
          column: 11,
        },
      ],
      options: [{ allowRequiredDefaults: true }],
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        MyStatelessComponent.defaultProps = {
          bar: "bar"
        };
        MyStatelessComponent.defaultProps.baz = "baz";
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'bar' },
          line: 10,
          column: 11,
        },
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 12,
          column: 9,
        },
      ],
    },
    {
      code: `
        const types = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = {
          bar: "bar"
        };
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'bar' },
          line: 12,
          column: 11,
        },
      ],
    },
    {
      code: `
        const defaults = {
          foo: "foo"
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: React.PropTypes.string.isRequired,
          bar: React.PropTypes.string
        };
        MyStatelessComponent.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 3,
          column: 11,
        },
      ],
    },
    {
      code: `
        const defaults = {
          foo: "foo"
        };
        const types = {
          foo: React.PropTypes.string.isRequired,
          bar: React.PropTypes.string
        };

        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 3,
          column: 11,
        },
      ],
    },

    // createReactClass components
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: React.PropTypes.string,
            bar: React.PropTypes.string.isRequired
          },
          getDefaultProps: function() {
            return {
              baz: "baz"
            };
          }
        });
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 12,
          column: 15,
        },
      ],
    },
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: React.PropTypes.string.isRequired,
            bar: React.PropTypes.string
          },
          getDefaultProps: function() {
            return {
              foo: "foo"
            };
          }
        });
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 12,
          column: 15,
        },
      ],
    },

    // ES6 class component
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        Greeting.defaultProps = {
          baz: "baz"
        };
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 14,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          foo: React.PropTypes.string.isRequired,
          bar: React.PropTypes.string
        };
        Greeting.defaultProps = {
          foo: "foo"
        };
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 14,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          bar: React.PropTypes.string.isRequired
        };
        Greeting.propTypes.foo = React.PropTypes.string.isRequired;
        Greeting.defaultProps = {};
        Greeting.defaultProps.foo = "foo";
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 14,
          column: 9,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {
          bar: React.PropTypes.string
        };
        Greeting.propTypes.foo = React.PropTypes.string;
        Greeting.defaultProps = {};
        Greeting.defaultProps.baz = "baz";
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 14,
          column: 9,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        Greeting.propTypes = {};
        Greeting.propTypes.foo = React.PropTypes.string.isRequired;
        Greeting.defaultProps = {};
        Greeting.defaultProps.foo = "foo";
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 12,
          column: 9,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        const props = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        Greeting.propTypes = props;
        const defaults = {
          bar: "bar"
        };
        Greeting.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'bar' },
          line: 15,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
        }
        const props = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string
        };
        const defaults = {
          baz: "baz"
        };
        Greeting.propTypes = props;
        Greeting.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 14,
          column: 11,
        },
      ],
    },

    // ES6 classes with static getter methods
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              name: React.PropTypes.string.isRequired
            };
          }
          static get defaultProps() {
            return {
              name: "name"
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'name' },
          line: 10,
          column: 15,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              foo: React.PropTypes.string,
              bar: React.PropTypes.string
            };
          }
          static get defaultProps() {
            return {
              baz: "world"
            };
          }
          render() {
            return <div>Hello {this.props.bar}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 11,
          column: 15,
        },
      ],
    },
    {
      code: `
        const props = {
          foo: React.PropTypes.string
        };
        const defaults = {
          baz: "baz"
        };

        class Hello extends React.Component {
          static get propTypes() {
            return props;
          }
          static get defaultProps() {
            return defaults;
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 6,
          column: 11,
        },
      ],
    },
    {
      code: `
        const defaults = {
          bar: "world"
        };

        class Hello extends React.Component {
          static get propTypes() {
            return {
              foo: React.PropTypes.string,
              bar: React.PropTypes.string.isRequired
            };
          }
          static get defaultProps() {
            return defaults;
          }
          render() {
            return <div>Hello {this.props.bar}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'bar' },
          line: 3,
          column: 11,
        },
      ],
    },

    // ES6 classes with property initializers
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
          static propTypes = {
            foo: React.PropTypes.string,
            bar: React.PropTypes.string.isRequired
          };
          static defaultProps = {
            bar: "bar"
          };
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'bar' },
          line: 13,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
          static propTypes = {
            foo: React.PropTypes.string,
            bar: React.PropTypes.string
          };
          static defaultProps = {
            baz: "baz"
          };
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 13,
          column: 13,
        },
      ],
    },
    {
      code: `
        const props = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string.isRequired
        };
        const defaults = {
          bar: "bar"
        };
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
          static propTypes = props;
          static defaultProps = defaults;
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'bar' },
          line: 7,
          column: 11,
        },
      ],
    },
    {
      code: `
        const props = {
          foo: React.PropTypes.string,
          bar: React.PropTypes.string
        };
        const defaults = {
          baz: "baz"
        };
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
          static propTypes = props;
          static defaultProps = defaults;
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'baz' },
          line: 7,
          column: 11,
        },
      ],
    },

    // edge cases
    {
      code: `
        let Greetings = {};
        Greetings.Hello = class extends React.Component {
          render () {
            return <div>Hello {this.props.foo}</div>;
          }
        }
        Greetings.Hello.propTypes = {
          foo: React.PropTypes.string.isRequired
        };
        Greetings.Hello.defaultProps = {
          foo: "foo"
        };
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 12,
          column: 11,
        },
      ],
    },
    {
      code: `
        var Greetings = ({ foo = "foo" }) => {
          return <div>Hello {this.props.foo}</div>;
        }
        Greetings.propTypes = {
          foo: React.PropTypes.string.isRequired
        };
        Greetings.defaultProps = {
          foo: "foo"
        };
      `,
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 9,
          column: 11,
        },
      ],
    },

    // with Flow annotations
    {
      code: `
        class Hello extends React.Component {
          props: {
            foo: string,
            bar?: string
          };

          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }

        Hello.defaultProps = {
          foo: "foo"
        };
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 14,
          column: 11,
        },
      ],
    },
    {
      code: `
        function Hello(props: { foo: string }) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.defaultProps = {
          foo: "foo"
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 6,
          column: 11,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo: string
        };

        function Hello(props: Props) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.defaultProps = {
          foo: "foo"
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 10,
          column: 11,
        },
      ],
    },
    {
      code: `
        const Hello = (props: { foo: string, bar?: string }) => {
          return <div>Hello {props.foo}</div>;
        };
        Hello.defaultProps = { foo: "foo", bar: "bar" };
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 5,
          column: 32,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo: string,
          bar?: string
        };

        type Props2 = {
          foo: string,
          baz?: string
        }

        function Hello(props: Props | Props2) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.defaultProps = { foo: "foo", frob: "frob" };
      `,
      features: ['flow'], // TODO: FIXME: change to "types" and fix failures
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 15,
          column: 32,
        },
        {
          messageId: 'defaultHasNoType',
          data: { name: 'frob' },
          line: 15,
          column: 44,
        },
      ],
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
      features: ['types'],
      errors: [
        {
          messageId: 'defaultHasNoType',
          data: { name: 'fooBar' },
        },
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
        },
      ],
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
          messageId: 'requiredHasDefault',
          data: { name: 'firstProperty' },
        },
      ],
    },
    {
      code: `
        type DefaultProps = {
          baz?: string,
          bar?: string
        };

        type Props = {
          foo: string,
          ...DefaultProps
        }

        function Hello(props: Props) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.defaultProps = { foo: "foo", frob: "frob", baz: "bar" };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 15,
          column: 32,
        },
        {
          messageId: 'defaultHasNoType',
          data: { name: 'frob' },
          line: 15,
          column: 44,
        },
      ],
    },
    {
      code: `
        type DefaultProps = {
          baz?: string,
          bar?: string
        };

        type Props = {
          foo: string,
          ...DefaultProps
        }

        class Hello extends React.Component<Props> {
          render() {
            return <div>Hello {props.foo}</div>;
          }
        }
        Hello.defaultProps = { foo: "foo", frob: "frob", baz: "bar" };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'requiredHasDefault',
          data: { name: 'foo' },
          line: 17,
          column: 32,
        },
        {
          messageId: 'defaultHasNoType',
          data: { name: 'frob' },
          line: 17,
          column: 44,
        },
      ],
    },
  ]),
});
