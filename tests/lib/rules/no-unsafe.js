/**
 * @fileoverview Prevent usage of unsafe lifecycle methods
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

function errorMessage(method, newMethod, details) {
  return `${method} is unsafe for use in async rendering. Update the component to use ${newMethod} instead. ${details}`;
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
            componentWillMount() {}
            componentWillReceiveProps() {}
            componentWillUpdate() {}
          }
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
            componentWillMount: function() {},
            componentWillReceiveProps: function() {},
            componentWillUpdate: function() {},
          });
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
    // React.Component
    {
      code: `
          class Foo extends React.Component {
            componentWillMount() {}
            componentWillReceiveProps() {}
            componentWillUpdate() {}
          }
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
    // createReactClass
    {
      code: `
            const Foo = createReactClass({
              componentWillMount: function() {},
              componentWillReceiveProps: function() {},
              componentWillUpdate: function() {},
            });
          `,
      settings: {react: {version: '16.4.0'}}
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
    // React.Component
    {
      code: `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      options: [{checkAliases: true}],
      settings: {react: {version: '16.4.0'}},
      errors: [
        {
          message: errorMessage(
            'componentWillMount',
            'componentDidMount',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 9,
          type: 'ClassDeclaration'
        },
        {
          message: errorMessage(
            'componentWillReceiveProps',
            'getDerivedStateFromProps',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 9,
          type: 'ClassDeclaration'
        },
        {
          message: errorMessage(
            'componentWillUpdate',
            'componentDidUpdate',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 9,
          type: 'ClassDeclaration'
        }
      ]
    },
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
          message: errorMessage(
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 7,
          type: 'ClassDeclaration'
        },
        {
          message: errorMessage(
            'UNSAFE_componentWillReceiveProps',
            'getDerivedStateFromProps',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 7,
          type: 'ClassDeclaration'
        },
        {
          message: errorMessage(
            'UNSAFE_componentWillUpdate',
            'componentDidUpdate',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 7,
          type: 'ClassDeclaration'
        }
      ]
    },
    // createReactClass
    {
      code: `
          const Foo = createReactClass({
            componentWillMount: function() {},
            componentWillReceiveProps: function() {},
            componentWillUpdate: function() {},
          });
        `,
      options: [{checkAliases: true}],
      settings: {react: {version: '16.3.0'}},
      errors: [
        {
          message: errorMessage(
            'componentWillMount',
            'componentDidMount',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 40,
          type: 'ObjectExpression'
        },
        {
          message: errorMessage(
            'componentWillReceiveProps',
            'getDerivedStateFromProps',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 40,
          type: 'ObjectExpression'
        },
        {
          message: errorMessage(
            'componentWillUpdate',
            'componentDidUpdate',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 40,
          type: 'ObjectExpression'
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
          message: errorMessage(
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 38,
          type: 'ObjectExpression'
        },
        {
          message: errorMessage(
            'UNSAFE_componentWillReceiveProps',
            'getDerivedStateFromProps',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 38,
          type: 'ObjectExpression'
        },
        {
          message: errorMessage(
            'UNSAFE_componentWillUpdate',
            'componentDidUpdate',
            'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.'
          ),
          line: 2,
          column: 38,
          type: 'ObjectExpression'
        }
      ]
    }
  ]
});
