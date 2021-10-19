/**
 * @fileoverview Require component props to be typed as read-only.
 * @author Luke Zapart
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/prefer-read-only-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('prefer-read-only-props', rule, {
  valid: parsers.all([
    {
      // Class component with type parameter
      code: `
        type Props = {
          +name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      // Class component with typed props property
      code: `
        class Hello extends React.Component {
          props: {
            +name: string,
          }

          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      // Functional component with typed props argument
      code: `
        function Hello(props: {+name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      features: ['flow'],
    },
    {
      // Functional component with type intersection
      code: `
        type PropsA = {+firstName: string};
        type PropsB = {+lastName: string};
        type Props = PropsA & PropsB;

        function Hello({firstName, lastName}: Props) {
          return <div>Hello {firstName} {lastName}</div>;
        }
      `,
      features: ['flow'],
    },
    {
      // Arrow function
      code: `
        const Hello = (props: {+name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      features: ['flow'],
    },
    {
      // Destructured props
      code: `
        const Hello = ({name}: {+name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      features: ['flow'],
    },
    {
      // No error, because this is not a component
      code: `
        const notAComponent = (props: {n: number}) => {
          return props.n + 1;
        };
      `,
      features: ['flow'],
    },
    {
      // No error, because there is no Props flow type
      code: `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      // No error, because PropTypes do not support variance
      code: `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.string,
        };
      `,
    },
    {
      // Class component with typed props argument
      code: `
        type Props = $ReadOnly<{
          name: string,
        }>

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      // Class component with typed props argument
      code: `
        type Props = $ReadOnly<{
          +firstName: string,
          lastName: string
        }>

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.firstName} {this.props.lastName}</div>;
          }
        }
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
    {
      // Props.name is not read-only
      code: `
        type Props = {
          name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      output: `
        type Props = {
          +name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      // Props.name is contravariant
      code: `
        type Props = {
          -name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      output: `
        type Props = {
          +name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: string,
          }

          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      output: `
        class Hello extends React.Component {
          props: {
            +name: string,
          }

          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function Hello(props: {name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      output: `
        function Hello(props: {+name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function Hello(props: {|name: string|}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      output: `
        function Hello(props: {|+name: string|}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function Hello({name}: {name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      output: `
        function Hello({name}: {+name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        type PropsA = {firstName: string};
        type PropsB = {lastName: string};
        type Props = PropsA & PropsB;

        function Hello({firstName, lastName}: Props) {
          return <div>Hello {firstName} {lastName}</div>;
        }
      `,
      output: `
        type PropsA = {+firstName: string};
        type PropsB = {+lastName: string};
        type Props = PropsA & PropsB;

        function Hello({firstName, lastName}: Props) {
          return <div>Hello {firstName} {lastName}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'firstName' },
        },
        {
          messageId: 'readOnlyProp',
          data: { name: 'lastName' },
        },
      ],
    },
    {
      code: `
        const Hello = (props: {-name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      output: `
        const Hello = (props: {+name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
  ]),
});
