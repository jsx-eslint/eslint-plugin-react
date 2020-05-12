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
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prefer-read-only-props', rule, {

  valid: [
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
      parser: parsers.BABEL_ESLINT
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
      parser: parsers.BABEL_ESLINT
    },
    {
      // Functional component with typed props argument
      code: `
        function Hello(props: {+name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT
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
      parser: parsers.BABEL_ESLINT
    },
    {
      // Arrow function
      code: `
        const Hello = (props: {+name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      // Destructured props
      code: `
        const Hello = ({name}: {+name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      // No error, because this is not a component
      code: `
        const notAComponent = (props: {n: number}) => {
          return props.n + 1;
        };
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      // No error, because there is no Props flow type
      code: `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `
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
      `
    }
  ],

  invalid: [
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
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        type Props = {
          +name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `
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
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        type Props = {
          +name: string,
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `
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
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        class Hello extends React.Component {
          props: {
            +name: string,
          }

          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `
    },
    {
      code: `
        function Hello(props: {name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        function Hello(props: {+name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `
    },
    {
      code: `
        function Hello(props: {|name: string|}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        function Hello(props: {|+name: string|}) {
          return <div>Hello {props.name}</div>;
        }
      `
    },
    {
      code: `
        function Hello({name}: {name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        function Hello({name}: {+name: string}) {
          return <div>Hello {props.name}</div>;
        }
      `
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
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'firstName\' should be read-only.'
      }, {
        message: 'Prop \'lastName\' should be read-only.'
      }],
      output: `
        type PropsA = {+firstName: string};
        type PropsB = {+lastName: string};
        type Props = PropsA & PropsB;

        function Hello({firstName, lastName}: Props) {
          return <div>Hello {firstName} {lastName}</div>;
        }
      `
    },
    {
      code: `
        const Hello = (props: {-name: string}) => (
          <div>Hello {props.name}</div>
        );
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Prop \'name\' should be read-only.'
      }],
      output: `
        const Hello = (props: {+name: string}) => (
          <div>Hello {props.name}</div>
        );
      `
    }
  ]
});
