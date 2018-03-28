/**
 * @fileoverview Tests for no-deprecated-methods
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-methods');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

function errorMessage(node, method) {
  return `${node} should not use ${method}.`;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-deprecated-methods', rule, {
  valid: [
    {
      code: `
        var Foo = createReactClass({
          render: function() {}
        })
      `,
      parserOptions: parserOptions
    },
    {
      code: `
        var Foo = createReactClassNonReact({
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        });
      `,
      parserOptions: parserOptions
    },
    {
      code: `
        var Foo = {
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        };
      `,
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      parserOptions: parserOptions
    },
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
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      options: [{
        componentWillMount: false,
        componentWillReceiveProps: false,
        componentWillUpdate: false
      }],
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: `
        function Foo() {
          return class Bar extends React.PureComponent {
            componentWillMount() {}
            componentWillReceiveProps() {}
            componentWillUpdate() {}
          };
        }
      `,
      errors: [
        {message: errorMessage('Bar', 'componentWillMount')},
        {message: errorMessage('Bar', 'componentWillReceiveProps')},
        {message: errorMessage('Bar', 'componentWillUpdate')}
      ],
      parserOptions: parserOptions
    },
    {
      code: `
        var Foo = createReactClass({
           componentWillMount: function() {},
           componentWillReceiveProps: function() {},
           componentWillUpdate: function() {}
        })
      `,
      errors: [
        {message: errorMessage('Foo', 'componentWillMount')},
        {message: errorMessage('Foo', 'componentWillReceiveProps')},
        {message: errorMessage('Foo', 'componentWillUpdate')}
      ],
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends React.PureComponent {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        {message: errorMessage('Foo', 'componentWillMount')},
        {message: errorMessage('Foo', 'componentWillReceiveProps')},
        {message: errorMessage('Foo', 'componentWillUpdate')}
      ],
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends PureComponent {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        {message: errorMessage('Foo', 'componentWillMount')},
        {message: errorMessage('Foo', 'componentWillReceiveProps')},
        {message: errorMessage('Foo', 'componentWillUpdate')}
      ],
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        {message: errorMessage('Foo', 'componentWillMount')},
        {message: errorMessage('Foo', 'componentWillReceiveProps')},
        {message: errorMessage('Foo', 'componentWillUpdate')}
      ],
      parserOptions: parserOptions
    },
    {
      code: `
        class Foo extends Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        {message: errorMessage('Foo', 'componentWillMount')},
        {message: errorMessage('Foo', 'componentWillReceiveProps')},
        {message: errorMessage('Foo', 'componentWillUpdate')}
      ],
      parserOptions: parserOptions
    }
  ]
});
