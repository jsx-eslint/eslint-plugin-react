/**
 * @fileoverview Prevent string definitions for references and prevent referencing this.refs
 * @author Tom Hastjarjanto
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-string-refs');

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
ruleTester.run('no-refs', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            var component = this.hello;
          },
          render: function() {
            return <div ref={c => this.hello = c}>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div ref={\`hello\`}>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div ref={\`hello\${index}\`}>Hello {this.props.name}</div>;
          }
        });
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            var component = this.refs.hello;
          },
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'thisRefsDeprecated' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div ref="hello">Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'stringInRefDeprecated' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div ref={'hello'}>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'stringInRefDeprecated' }],
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            var component = this.refs.hello;
          },
          render: function() {
            return <div ref="hello">Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [
        { messageId: 'thisRefsDeprecated' },
        { messageId: 'stringInRefDeprecated' },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: function() {
          var component = this.refs.hello;
          },
          render: function() {
            return <div ref={\`hello\`}>Hello {this.props.name}</div>;
          }
        });
      `,
      options: [{ noTemplateLiterals: true }],
      errors: [
        { messageId: 'thisRefsDeprecated' },
        { messageId: 'stringInRefDeprecated' },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: function() {
          var component = this.refs.hello;
          },
          render: function() {
            return <div ref={\`hello\${index}\`}>Hello {this.props.name}</div>;
          }
        });
      `,
      options: [{ noTemplateLiterals: true }],
      errors: [
        { messageId: 'thisRefsDeprecated' },
        { messageId: 'stringInRefDeprecated' },
      ],
    },
  ]),
});
