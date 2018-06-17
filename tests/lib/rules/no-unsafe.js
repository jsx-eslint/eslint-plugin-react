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
      `
    },
    {
      code: `
        const Foo = createReactClass({
          componentDidUpdate: function() {},
          render: function() {}
        });
      `
    },
    {
      code: `
        class Foo extends Bar {
          UNSAFE_componentWillMount() {}
          UNSAFE_componentWillReceiveProps() {}
          UNSAFE_componentWillUpdate() {}
        }
      `
    },
    {
      code: `
        const Foo = bar({
          UNSAFE_componentWillMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          UNSAFE_componentWillUpdate: function() {},
        });
      `
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
      errors: [
        {
          message: 'Do not use UNSAFE_componentWillMount'
        },
        {
          message: 'Do not use UNSAFE_componentWillReceiveProps'
        },
        {
          message: 'Do not use UNSAFE_componentWillUpdate'
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
      errors: [
        {
          message: 'Do not use UNSAFE_componentWillMount'
        },
        {
          message: 'Do not use UNSAFE_componentWillReceiveProps'
        },
        {
          message: 'Do not use UNSAFE_componentWillUpdate'
        }
      ]
    }
  ]
});
