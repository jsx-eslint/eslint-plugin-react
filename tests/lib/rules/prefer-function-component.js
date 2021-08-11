'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/prefer-function-component');

const COMPONENT_SHOULD_BE_FUNCTION = 'componentShouldBeFunction';
const ALLOW_COMPONENT_DID_CATCH = 'allowComponentDidCatch';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'latest'
    }
  }
});

ruleTester.run('prefer-function-component', rule, {
  valid: [
    {
      // Already a stateless function
      code: `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `
    },
    {
      // Already a stateless (arrow) function
      code: 'const Foo = ({foo}) => <div>{foo}</div>;'
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.PureComponent {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    },
    {
      // Extends from Component in an expression context.
      code: `
        const Foo = class extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `
    }
  ],

  invalid: [
    {
      code: `
        import { Component } from 'react';

        class Foo extends Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    },
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    },
    {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    },
    {
      code: `
        const Foo = class extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [
        {
          [ALLOW_COMPONENT_DID_CATCH]: false
        }
      ],
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    },
    {
      // Extends from Component and uses componentDidCatch
      code: `
        class Foo extends React.PureComponent {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [
        {
          [ALLOW_COMPONENT_DID_CATCH]: false
        }
      ],
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    },
    {
      // Extends from Component in an expression context.
      code: `
        const Foo = class extends React.Component {
          componentDidCatch(error, errorInfo) {
            logErrorToMyService(error, errorInfo);
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      options: [
        {
          [ALLOW_COMPONENT_DID_CATCH]: false
        }
      ],
      errors: [
        {
          messageId: COMPONENT_SHOULD_BE_FUNCTION
        }
      ]
    }
  ]
});
