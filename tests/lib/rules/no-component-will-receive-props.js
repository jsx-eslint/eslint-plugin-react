/**
 * @fileoverview Tests for no-component-will-receive-props
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-component-will-receive-props');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true
  }
};

function errorMessage(node) {
  return `${node} should not use deprecated lifecycle method componentWillReceiveProps.`;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-component-will-receive-props', rule, {
  valid: [
    {
      code: `
        class Foo extends React.Component {
        }
      `,
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillUpdate = () => {
            return true;
          }
        }
      `,
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.Component {
            componentWillUpdate() {
            }
          };
        }
      `,
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: `
        class Foo extends React.PureComponent {
          componentWillReceiveProps() {

          }
        }
      `,
      errors: [{message: errorMessage('Foo')}],
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends PureComponent {
          async componentWillReceiveProps() {
          }
        }
      `,
      errors: [{message: errorMessage('Foo')}],
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends React.PureComponent {
          componentWillReceiveProps = () => {
          }
        }
      `,
      errors: [{message: errorMessage('Foo')}],
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends React.PureComponent {
          componentWillReceiveProps = async () => {
          }
        }
      `,
      errors: [{message: errorMessage('Foo')}],
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.PureComponent {
            componentWillReceiveProps() {
            }
          };
        }
      `,
      errors: [{message: errorMessage('Bar')}],
      parserOptions: parserOptions
    },
    {
      code: `
        var Foo = class extends PureComponent {
          componentWillReceiveProps() {
          }
        }
      `,
      errors: [{message: errorMessage('Foo')}],
      parserOptions: parserOptions
    }
  ]
});
