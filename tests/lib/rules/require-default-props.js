/**
 * @fileoverview Enforce a defaultProps definition for every prop that is not a required prop.
 * @author Vitor Balocco
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/require-default-props');

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

ruleTester.run('require-default-props', rule, {
  valid: parsers.all([
    // stateless components as function declarations
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string.isRequired,
          bar: PropTypes.string.isRequired
        };
      `,
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
          bar: PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes.foo = PropTypes.string;
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
          bar: PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes.foo = PropTypes.string;
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
        MyStatelessComponent.propTypes.foo = PropTypes.string;
        MyStatelessComponent.defaultProps = {};
        MyStatelessComponent.defaultProps.foo = "foo";
      `,
    },
    {
      code: `
        const types = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },
    {
      code: `
        function MyStatelessComponent({ foo = "test", bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },
    {
      code: `
        function MyStatelessComponent({ foo = "test", bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
        };
      `,
      options: [
        {
          forbidDefaultForRequired: true,
          ignoreFunctionalComponents: true,
        },
      ],
    },
    {
      code: `
        export function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },
    {
      code: `
        export default function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },

    // stateless components as function expressions
    {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        const MyComponent = function({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        };

        MyComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };

        export default MyComponent;
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },
    {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        export const MyComponent = function({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        };

        MyComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },

    // stateless components as arrow function expressions
    {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        const MyComponent = ({ foo, bar }) => {
          return <div>{foo}{bar}</div>;
        };

        MyComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };

        export default MyComponent;
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },
    {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        export const MyComponent = ({ foo, bar }) => {
          return <div>{foo}{bar}</div>;
        };

        MyComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };

        export default MyComponent;
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },

    // createReactClass components
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: PropTypes.string.isRequired,
            bar: PropTypes.string.isRequired
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
            foo: PropTypes.string,
            bar: PropTypes.string.isRequired
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
            foo: PropTypes.string,
            bar: PropTypes.string
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
    {
      code: `
        var Greeting = createReactClass({
          render: function() {
            return <div>Hello {this.props.foo} {this.props.bar}</div>;
          },
          propTypes: {
            foo: PropTypes.string,
            bar: PropTypes.string
          },
          getDefaultProps: function() {
            return {
              foo: "foo",
              bar: "bar"
            };
          }
        });
      `,
      options: [{ ignoreFunctionalComponents: true }],
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
          foo: PropTypes.string.isRequired,
          bar: PropTypes.string.isRequired
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
        Greeting.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
          bar: PropTypes.string.isRequired
        };
        Greeting.propTypes.foo = PropTypes.string;
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
          bar: PropTypes.string.isRequired
        };
        Greeting.propTypes.foo = PropTypes.string;
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
        Greeting.propTypes.foo = PropTypes.string;
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
        Greeting.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
        Greeting.defaultProps = {
          foo: "foo"
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
    },

    // edge cases

    // not a react component
    {
      code: `
        function NotAComponent({ foo, bar }) {}
        NotAComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
        Greeting.propTypes = {
          bar: PropTypes.string.isRequired
        };
      `,
    },
    // external references
    {
      code: `
        const defaults = require("./defaults");
        const types = {
          foo: PropTypes.string,
          bar: PropTypes.string
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
          foo: PropTypes.string
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
          foo: PropTypes.string
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
          foo: PropTypes.string
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
          foo: PropTypes.string
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
          foo: PropTypes.string
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
          foo: PropTypes.string
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
          bar: PropTypes.string.isRequired
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
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
    // make sure defaultProps are correctly detected with quoted properties
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.bar}</div>;
        }
        Hello.propTypes = {
          bar: PropTypes.string
        };
        Hello.defaultProps = {
          "bar": "bar"
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {
            foo: PropTypes.string.isRequired
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['class fields'],
      options: [{ forbidDefaultForRequired: true }],
    },
    // test support for React PropTypes as Component's class generic
    {
      code: `
        type HelloProps = {
          foo: string,
          bar?: string
        };
        class Hello extends React.Component<HelloProps> {
          static defaultProps = {
            bar: "bar"
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ forbidDefaultForRequired: true }],
    },
    {
      code: `
        type HelloProps = {
          foo: string,
          bar?: string
        };
        class Hello extends Component<HelloProps> {
          static defaultProps = {
            bar: "bar"
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ forbidDefaultForRequired: true }],
    },
    {
      code: `
        type HelloProps = {
          foo: string,
          bar?: string
        };
        type HelloState = {
          dummyState: string
        };
        class Hello extends Component<HelloProps, HelloState> {
          static defaultProps = {
            bar: "bar"
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ forbidDefaultForRequired: true }],
    },
    {
      code: `
        type HelloProps = {
          foo?: string,
          bar?: string
        };
        class Hello extends Component<HelloProps> {
          static defaultProps = {
            foo: "foo",
            bar: "bar"
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ forbidDefaultForRequired: true }],
    },
    {
      code: `
        type Props = {
          +name?: string,
        };
        function Hello(props: Props) {
          return <div>Hello {props.name}</div>;
        }
        Hello.defaultProps = {
          name: 'foo'
        };
      `,
      features: ['flow'],
    },
    {
      code: `
        import React from "react";

        interface Props {
          name: string;
        }

        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };

        export default MyComponent;
      `,
      features: ['ts'],
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 6,
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        });
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 6,
          column: 11,
        },
      ],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        const propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes = forbidExtraProps(propTypes);
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 6,
          column: 11,
        },
      ],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
        MyStatelessComponent.propTypes.baz = React.propTypes.string;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 6,
          column: 11,
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'baz' },
          line: 9,
          column: 9,
        },
      ],
    },
    {
      code: `
        const types = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
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
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string
        };
        MyStatelessComponent.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 10,
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
          foo: PropTypes.string,
          bar: PropTypes.string
        };
        function MyStatelessComponent({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        MyStatelessComponent.propTypes = types;
        MyStatelessComponent.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 7,
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
            foo: PropTypes.string,
            bar: PropTypes.string.isRequired
          }
        });
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 7,
          column: 13,
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
            foo: PropTypes.string,
            bar: PropTypes.string.isRequired
          }
        });
      `,
      options: [{ ignoreFunctionalComponents: true }],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 7,
          column: 13,
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
            foo: PropTypes.string,
            bar: PropTypes.string
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
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 8,
          column: 13,
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 10,
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
      `,
      options: [{ ignoreFunctionalComponents: true }],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 10,
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
          foo: PropTypes.string,
          bar: PropTypes.string
        };
        Greeting.defaultProps = {
          foo: "foo"
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 11,
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
          bar: PropTypes.string.isRequired
        };
        Greeting.propTypes.foo = PropTypes.string;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
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
        Greeting.propTypes = {
          bar: PropTypes.string
        };
        Greeting.propTypes.foo = PropTypes.string;
        Greeting.defaultProps = {};
        Greeting.defaultProps.foo = "foo";
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 10,
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
        Greeting.propTypes = {};
        Greeting.propTypes.foo = PropTypes.string;
        Greeting.defaultProps = {};
        Greeting.defaultProps.bar = "bar";
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 10,
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
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
        Greeting.propTypes = props;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 10,
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
          foo: PropTypes.string,
          bar: PropTypes.string
        };
        const defaults = {
          foo: "foo"
        };
        Greeting.propTypes = props;
        Greeting.defaultProps = defaults;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 11,
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
              name: PropTypes.string
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'name' },
          line: 5,
          column: 15,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      options: [{ ignoreFunctionalComponents: true }],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'name' },
          line: 5,
          column: 15,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              foo: PropTypes.string,
              bar: PropTypes.string
            };
          }
          static get defaultProps() {
            return {
              bar: "world"
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 5,
          column: 15,
        },
      ],
    },
    {
      code: `
        const props = {
          foo: PropTypes.string
        };
        class Hello extends React.Component {
          static get propTypes() {
            return props;
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 3,
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
              foo: PropTypes.string,
              bar: PropTypes.string
            };
          }
          static get defaultProps() {
            return defaults;
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 8,
          column: 15,
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
            foo: PropTypes.string,
            bar: PropTypes.string.isRequired
          };
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 9,
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
            foo: PropTypes.string,
            bar: PropTypes.string.isRequired
          };
        }
      `,
      features: ['class fields'],
      options: [{ ignoreFunctionalComponents: true }],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 9,
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
            foo: PropTypes.string,
            bar: PropTypes.string
          };
          static defaultProps = {
            foo: "foo"
          };
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 10,
          column: 13,
        },
      ],
    },
    {
      code: `
        const props = {
          foo: PropTypes.string,
          bar: PropTypes.string.isRequired
        };
        class Greeting extends React.Component {
          render() {
            return (
              <h1>Hello, {this.props.foo} {this.props.bar}</h1>
            );
          }
          static propTypes = props;
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 3,
          column: 11,
        },
      ],
    },
    {
      code: `
        const props = {
          foo: PropTypes.string,
          bar: PropTypes.string
        };
        const defaults = {
          foo: "foo"
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
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 4,
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
          foo: PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 9,
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
          foo: PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 6,
          column: 11,
        },
      ],
    },

    // component with no declared props followed by a failing component
    {
      code: `
        var ComponentWithNoProps = ({ bar = "bar" }) => {
          return <div>Hello {this.props.foo}</div>;
        }
        var Greetings = ({ foo = "foo" }) => {
          return <div>Hello {this.props.foo}</div>;
        }
        Greetings.propTypes = {
          foo: PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
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
            foo?: string,
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
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
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
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo?: string
        };
        class Hello extends React.Component {
          props: Props;
          static defaultProps: { foo: string };
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 3,
          column: 11,
        },
      ],
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
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            foo?: string,
            bar?: string
          };
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 4,
          column: 13,
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            foo?: string
          };
          static defaultProps: { foo: string };
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo?: string,
          bar?: string
        };
        class Hello extends React.Component {
          props: Props;
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
        Hello.defaultProps = {
          foo: "foo"
        };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo?: string,
          bar?: string
        };
        class Hello extends React.Component {
          props: Props;
          static defaultProps: { foo: string, bar: string };
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
        Hello.defaultProps = {
          foo: "foo"
        };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            foo?: string,
            bar?: string
          };
          static defaultProps: { foo: string, bar: string };
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
        Hello.defaultProps = {
          foo: "foo"
        };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      code: `
        function Hello(props: { foo?: string }) {
          return <div>Hello {props.foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 2,
          column: 33,
        },
      ],
    },
    {
      code: `
        function Hello({ foo = "foo" }: { foo?: string }) {
          return <div>Hello {foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 2,
          column: 43,
        },
      ],
    },
    {
      code: `
        function Hello(props: { foo?: string, bar?: string }) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 2,
          column: 47,
        },
      ],
    },
    {
      code: `
        function Hello(props: { foo?: string, bar?: string }) {
          return <div>Hello {props.foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 2,
          column: 33,
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 2,
          column: 47,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo?: string
        };
        function Hello(props: Props) {
          return <div>Hello {props.foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 3,
          column: 11,
        },
      ],
    },
    {
      code: `
        const Hello = (props: { foo?: string }) => {
          return <div>Hello {props.foo}</div>;
        };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 2,
          column: 33,
        },
      ],
    },
    {
      code: `
        const Hello = (props: { foo?: string, bar?: string }) => {
          return <div>Hello {props.foo}</div>;
        };
        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 2,
          column: 47,
        },
      ],
    },
    {
      code: `
        const Hello = function(props: { foo?: string }) {
          return <div>Hello {props.foo}</div>;
        };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 2,
          column: 41,
        },
      ],
    },
    {
      code: `
        const Hello = function(props: { foo?: string, bar?: string }) {
          return <div>Hello {props.foo}</div>;
        };
        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 2,
          column: 55,
        },
      ],
    },
    {
      code: `
        type Props = {
          foo?: string,
          bar?: string
        };
        function Hello(props: Props) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.defaultProps = { foo: "foo" };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 4,
          column: 11,
        },
      ],
    },

    // UnionType
    {
      code: `
        function Hello(props: { one?: string } | { two?: string }) {
          return <div>Hello {props.foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'one' },
          line: 2,
          column: 33,
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'two' },
          line: 2,
          column: 52,
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
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
          line: 4,
          column: 11,
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'baz' },
          line: 8,
          column: 11,
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
        Hello.defaultProps = {
          bar: "bar"
        };
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'baz' },
          line: 8,
          column: 11,
        },
      ],
    },
    {
      code: `
        type HelloProps = {
          two?: string,
          three: string
        };
        function Hello(props: { one?: string } | HelloProps) {
          return <div>Hello {props.foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'two' },
          line: 3,
          column: 11,
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'one' },
          line: 6,
          column: 33,
        },
      ],
    },
    {
      code: `
        type HelloProps = {
          two?: string,
          three: string
        };
        function Hello(props: ExternalProps | HelloProps) {
          return <div>Hello {props.foo}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'two' },
          line: 3,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {
            foo: PropTypes.string
          };
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          static defaultProps() {
            return {
              name: 'John'
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              'first-name': PropTypes.string
            };
          }
          render() {
            return <div>Hello {this.props['first-name']}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'first-name' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string.isRequired
        };
        Hello.defaultProps = {
          foo: 'bar'
        };
      `,
      options: [{ forbidDefaultForRequired: true }],
      errors: [
        {
          messageId: 'noDefaultWithRequired',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.foo}</div>;
        }
        Hello.propTypes = {
          foo: PropTypes.string.isRequired
        };
        Hello.defaultProps = {
          foo: 'bar'
        };
      `,
      options: [{ forbidDefaultForRequired: true }],
      errors: [
        {
          messageId: 'noDefaultWithRequired',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        const Hello = (props) => {
          return <div>Hello {props.foo}</div>;
        };
        Hello.propTypes = {
          foo: PropTypes.string.isRequired
        };
        Hello.defaultProps = {
          foo: 'bar'
        };
      `,
      options: [{ forbidDefaultForRequired: true }],
      errors: [
        {
          messageId: 'noDefaultWithRequired',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {
            foo: PropTypes.string.isRequired
          }
          static defaultProps = {
            foo: 'bar'
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['class fields'],
      options: [{ forbidDefaultForRequired: true }],
      errors: [
        {
          messageId: 'noDefaultWithRequired',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes () {
            return {
              foo: PropTypes.string.isRequired
            };
          }
          static get defaultProps() {
            return {
              foo: 'bar'
            };
          }
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      options: [{ forbidDefaultForRequired: true }],
      errors: [
        {
          messageId: 'noDefaultWithRequired',
          data: { name: 'foo' },
        },
      ],
    },
    // test support for React PropTypes as Component's class generic
    {
      code: `
        type HelloProps = {
          foo: string,
          bar?: string
        };
        class Hello extends React.Component<HelloProps> {
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        type HelloProps = {
          foo: string,
          bar?: string
        };
        class Hello extends Component<HelloProps> {
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        type HelloProps = {
          foo: string,
          bar?: string
        };
        type HelloState = {
          dummyState: string
        };
        class Hello extends Component<HelloProps, HelloState> {
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        type HelloProps = {
          foo?: string,
          bar?: string
        };
        class Hello extends Component<HelloProps> {
          render() {
            return <div>Hello {this.props.foo}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'foo' },
        },
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        type Props = {
          +name?: string,
        };
        function Hello(props: Props) {
          return <div>Hello {props.name}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        const MyComponent= (props) => {
          switch (props.usedProp) {
            case 1:
              return (<div />);
            default:
              return <div />;
          }
        };

        MyComponent.propTypes = {
          usedProp: PropTypes.string,
        };

        export default MyComponent;
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'usedProp' },
        },
      ],
    },
    {
      code: `
        Foo.propTypes = {
          a: PropTypes.string,
        }

        export default function Foo(props) {
          return <p>{props.a}</p>
        };
      `,
      errors: [
        {
          messageId: 'shouldHaveDefault',
          data: { name: 'a' },
        },
      ],
    },
  ]),
});
