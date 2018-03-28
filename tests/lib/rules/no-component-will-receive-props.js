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
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

function errorMessage(node) {
  return `${node} should not use componentWillReceiveProps.`;
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
        }
      `,
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends React.PureComponent {
        }
      `,
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.Component {
          };
        }
      `,
      parserOptions: parserOptions
    },
    {
      code: `
        function Foo() {
          return <div>test</div>
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
        class Foo extends React.Component {
          componentWillReceiveProps() {
          }
        }
      `,
      errors: [{message: errorMessage('Foo')}],
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
    }
  ]
});
