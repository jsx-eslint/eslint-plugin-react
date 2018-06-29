/**
 * @fileoverview Prevent usage of UNSAFE_ methods
 * @author Sergei Startsev
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unsafe');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

function errorMessage(method) {
  return `${method} is unsafe for use in async rendering, see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html`;
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unsafe', rule, {
  valid: [
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate() {}
          render() {}
        }
      `,
      settings: {react: {version: '16.4.0'}}
    },
    {
      code: `
        const Foo = createReactClass({
          componentDidUpdate: function() {},
          render: function() {}
        });
      `,
      settings: {react: {version: '16.4.0'}}
    },
    {
      code: `
        class Foo extends Bar {
          UNSAFE_componentWillMount() {}
          UNSAFE_componentWillReceiveProps() {}
          UNSAFE_componentWillUpdate() {}
        }
      `,
      settings: {react: {version: '16.4.0'}}
    },
    {
      code: `
        const Foo = bar({
          UNSAFE_componentWillMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          UNSAFE_componentWillUpdate: function() {},
        });
      `,
      settings: {react: {version: '16.4.0'}}
    },
    {
      code: `
        class Foo extends React.Component {
          UNSAFE_componentWillMount() {}
          UNSAFE_componentWillReceiveProps() {}
          UNSAFE_componentWillUpdate() {}
        }
      `,
      settings: {react: {version: '16.2.0'}}
    },
    {
      code: `
          const Foo = createReactClass({
            UNSAFE_componentWillMount: function() {},
            UNSAFE_componentWillReceiveProps: function() {},
            UNSAFE_componentWillUpdate: function() {},
          });
        `,
      settings: {react: {version: '16.2.0'}}
    }
  ],

  invalid: [
    {
      code: `
      class Foo extends React.Component {
        UNSAFE_componentWillMount() {}
        UNSAFE_componentWillReceiveProps() {}
        UNSAFE_componentWillUpdate() {}
      }
    `,
      settings: {react: {version: '16.3.0'}},
      errors: [
        {
          message: errorMessage('UNSAFE_componentWillMount'),
          line: 2,
          column: 7,
          type: 'ClassDeclaration'
        },
        {
          message: errorMessage('UNSAFE_componentWillReceiveProps'),
          line: 2,
          column: 7,
          type: 'ClassDeclaration'
        },
        {
          message: errorMessage('UNSAFE_componentWillUpdate'),
          line: 2,
          column: 7,
          type: 'ClassDeclaration'
        }
      ]
    },
    {
      code: `
        const Foo = createReactClass({
          UNSAFE_componentWillMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          UNSAFE_componentWillUpdate: function() {},
        });
      `,
      settings: {react: {version: '16.3.0'}},
      errors: [
        {
          message: errorMessage('UNSAFE_componentWillMount'),
          line: 2,
          column: 38,
          type: 'ObjectExpression'
        },
        {
          message: errorMessage('UNSAFE_componentWillReceiveProps'),
          line: 2,
          column: 38,
          type: 'ObjectExpression'
        },
        {
          message: errorMessage('UNSAFE_componentWillUpdate'),
          line: 2,
          column: 38,
          type: 'ObjectExpression'
        }
      ]
    }
  ]
});
