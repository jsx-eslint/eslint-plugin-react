/**
 * @fileoverview Enforce ES5 or ES6 class for returning value in render function.
 * @author Mark Orel
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-render-return');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('require-render-return', rule, {

  valid: [{
    code: `
      class Hello extends React.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `
  }, {
    code: `
      class Hello extends React.Component {
        render = () => {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        render = () => (
          <div>Hello {this.props.name}</div>
        )
      }
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      var Hello = createReactClass({
        displayName: 'Hello',
        render: function() {
          return <div></div>
        }
      });
    `
  }, {
    code: `
      function Hello() {
        return <div></div>;
      }
    `
  }, {
    code: `
      var Hello = () => (
        <div></div>
      );
    `,
    parser: 'babel-eslint'
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          switch (this.props.name) {
            case 'Foo':
              return <div>Hello Foo</div>;
            default:
              return <div>Hello {this.props.name}</div>;
          }
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          if (this.props.name === 'Foo') {
            return <div>Hello Foo</div>;
          } else {
            return <div>Hello {this.props.name}</div>;
          }
        }
      });
    `
  }, {
    code: `
      class Hello {
        render() {}
      }
    `
  }, {
    // ES6 class without a render method
    code: 'class Hello extends React.Component {}'
  }, {
    // ES5 class without a render method
    code: 'var Hello = createReactClass({});'
  }, {
    code: `
      var render = require('./render');
      var Hello = createReactClass({
        render
      });
    `
  }, {
    code: `
      class Foo extends Component {
        render
      }
    `,
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: `
      var Hello = createReactClass({
        displayName: 'Hello',
        render: function() {}
      });
    `,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render() {} 
      }
    `,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render() {
          const names = this.props.names.map(function(name) {
            return <div>{name}</div>
          });
        } 
      }
    `,
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render = () => {
          <div>Hello {this.props.name}</div>
        }
      }
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Your render method should have return statement'
    }]
  }]
});
