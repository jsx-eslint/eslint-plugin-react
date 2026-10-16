/**
 * @fileoverview Require component props to be typed as read-only.
 * @author Luke Zapart
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
      code: `
        import React from "react";

        interface Props {
          readonly name: string;
        }

        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };

        export default MyComponent;
      `,
      features: ['ts'],
    },
    {
      code: `
        import React from "react";
        type Props = {
          readonly firstName: string;
          readonly lastName: string;
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `,
      features: ['ts'],
    },
    {
      code: `
        import React from "react";
        type Props = {
          readonly name: string;
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `,
      features: ['ts'],
    },
    {
      code: `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `,
      features: ['ts'],
    },
    {
      code: `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `,
      features: ['ts'],
    },
    {
      code: `
        import React from "react";
        type Props = {
          readonly person: {
            name: string;
          }
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
      code: `
        type Props = {
          name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      output: `
        type Props = {
          readonly name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['ts'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        interface Props {
          name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      output: `
        interface Props {
          readonly name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['ts'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        import React from "react";
        type Props = {
          name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `,
      output: `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `,
      features: ['ts'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        type Props = {
          readonly firstName: string;
          lastName: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      output: `
        type Props = {
          readonly firstName: string;
          readonly lastName: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['ts'],
      errors: [
        {
          messageId: 'readOnlyProp',
          data: { name: 'lastName' },
        },
      ],
    },
  ]),
});
