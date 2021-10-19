/**
 * @fileoverview Prevent usage of unsafe lifecycle methods
 * @author Sergei Startsev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unsafe');

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
ruleTester.run('no-unsafe', rule, {
  valid: parsers.all([
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate() {}
          render() {}
        }
      `,
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        const Foo = createReactClass({
          componentDidUpdate: function() {},
          render: function() {}
        });
      `,
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        class Foo extends Bar {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        class Foo extends Bar {
          UNSAFE_componentWillMount() {}
          UNSAFE_componentWillReceiveProps() {}
          UNSAFE_componentWillUpdate() {}
        }
      `,
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        const Foo = bar({
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {},
        });
      `,
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        const Foo = bar({
          UNSAFE_componentWillMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          UNSAFE_componentWillUpdate: function() {},
        });
      `,
      settings: { react: { version: '16.4.0' } },
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
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        class Foo extends React.Component {
          UNSAFE_componentWillMount() {}
          UNSAFE_componentWillReceiveProps() {}
          UNSAFE_componentWillUpdate() {}
        }
      `,
      settings: { react: { version: '16.2.0' } },
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
      settings: { react: { version: '16.4.0' } },
    },
    {
      code: `
        const Foo = createReactClass({
          UNSAFE_componentWillMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          UNSAFE_componentWillUpdate: function() {},
        });
      `,
      settings: { react: { version: '16.2.0' } },
    },
  ]),

  invalid: parsers.all([
    // React.Component
    {
      code: `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      options: [{ checkAliases: true }],
      settings: { react: { version: '16.4.0' } },
      errors: [
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'componentWillMount',
            newMethod: 'componentDidMount',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 9,
          type: 'ClassDeclaration',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'componentWillReceiveProps',
            newMethod: 'getDerivedStateFromProps',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 9,
          type: 'ClassDeclaration',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'componentWillUpdate',
            newMethod: 'componentDidUpdate',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 9,
          type: 'ClassDeclaration',
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          UNSAFE_componentWillMount() {}
          UNSAFE_componentWillReceiveProps() {}
          UNSAFE_componentWillUpdate() {}
        }
      `,
      settings: { react: { version: '16.3.0' } },
      errors: [
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'UNSAFE_componentWillMount',
            newMethod: 'componentDidMount',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 9,
          type: 'ClassDeclaration',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'UNSAFE_componentWillReceiveProps',
            newMethod: 'getDerivedStateFromProps',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 9,
          type: 'ClassDeclaration',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'UNSAFE_componentWillUpdate',
            newMethod: 'componentDidUpdate',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 9,
          type: 'ClassDeclaration',
        },
      ],
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
      options: [{ checkAliases: true }],
      settings: { react: { version: '16.3.0' } },
      errors: [
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'componentWillMount',
            newMethod: 'componentDidMount',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 38,
          type: 'ObjectExpression',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'componentWillReceiveProps',
            newMethod: 'getDerivedStateFromProps',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 38,
          type: 'ObjectExpression',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'componentWillUpdate',
            newMethod: 'componentDidUpdate',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 38,
          type: 'ObjectExpression',
        },
      ],
    },
    {
      code: `
        const Foo = createReactClass({
          UNSAFE_componentWillMount: function() {},
          UNSAFE_componentWillReceiveProps: function() {},
          UNSAFE_componentWillUpdate: function() {},
        });
      `,
      settings: { react: { version: '16.3.0' } },
      errors: [
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'UNSAFE_componentWillMount',
            newMethod: 'componentDidMount',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 38,
          type: 'ObjectExpression',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'UNSAFE_componentWillReceiveProps',
            newMethod: 'getDerivedStateFromProps',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 38,
          type: 'ObjectExpression',
        },
        {
          messageId: 'unsafeMethod',
          data: {
            method: 'UNSAFE_componentWillUpdate',
            newMethod: 'componentDidUpdate',
            details: 'See https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html.',
          },
          line: 2,
          column: 38,
          type: 'ObjectExpression',
        },
      ],
    },
  ]),
});
