/**
 * @fileoverview Prevent usage of isMounted
 * @author Joe Lencioni
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-is-mounted');
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
ruleTester.run('no-is-mounted', rule, {

  valid: [{
    code: `
      var Hello = function() {
      };
    `
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div>Hello</div>;
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidUpdate: function() {
          someNonMemberFunction(arg);
          this.someFunc = this.isMounted;
        },
        render: function() {
          return <div>Hello</div>;
        }
      });
    `
  }],

  invalid: [{
    code: `
      var Hello = createReactClass({
        componentDidUpdate: function() {
          if (!this.isMounted()) {
            return;
          }
        },
        render: function() {
          return <div>Hello</div>;
        }
      });
    `,
    errors: [{
      message: 'Do not use isMounted'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        someMethod: function() {
          if (!this.isMounted()) {
            return;
          }
        },
        render: function() {
          return <div onClick={this.someMethod.bind(this)}>Hello</div>;
        }
      });
    `,
    errors: [{
      message: 'Do not use isMounted'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        someMethod() {
          if (!this.isMounted()) {
            return;
          }
        }
        render() {
          return <div onClick={this.someMethod.bind(this)}>Hello</div>;
        }
      };
    `,
    errors: [{
      message: 'Do not use isMounted'
    }]
  }]
});
