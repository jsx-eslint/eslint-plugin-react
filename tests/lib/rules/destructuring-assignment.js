
/**
 * @fileoverview Rule to forbid or enforce destructuring assignment consistency.
 **/
'use strict';

const rule = require('../../../lib/rules/destructuring-assignment');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});

ruleTester.run('destructuring-assignment', rule, {
  valid: [{
    code: `function Component({ color }) {
      return <span>{color}</span>;
    }`
  }, {
    code: 'const Component = ({ color }) => <span>{color}</span>;'
  }, {
    code: 'const Component = ({ color }, { onChange }) => <span>{color}</span>;'
  }, {
    code: 'const Component = (props) => <span>{props.color}</span>;',
    options: [{SFC: 'never'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return this.props.children;
        }
      }
    `,
    options: [{class: 'never'}]
  }, {
    code: `
      class Component extends React.Component {
        componentDidMount() {
          this.props.onMount();
        }
        
        render() {
          const { children } = this.props;
          return children;
        }
      }
    `,
    options: [{class: 'always'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          return this.props.children;
        }
      });
    `,
    options: [{createClass: 'never'}]
  }],

  invalid: [{
    code: `function Component({ color }) {
      return <span>{color}</span>;
    }`,
    options: ['never'],
    errors: [{message: 'Must never use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = ({ color }) => <span>{color}</span>;',
    options: ['never'],
    errors: [{message: 'Must never use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = (props, { onChange }) => <span>{props.color}</span>;',
    options: ['never'],
    errors: [{message: 'Must never use destructuring context assignment in SFC argument'}]
  }, {
    code: 'const Component = (props) => <span>{props.color}</span>;',
    options: [{SFC: 'always'}],
    errors: [{message: 'Must use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = ({ color }, context) => <span>{color}</span>;',
    options: [{SFC: 'always'}],
    errors: [{message: 'Must use destructuring context assignment in SFC argument'}]
  }, {
    code: `
      class Component extends React.Component {
        render() { 
          return this.props.children;
        }
      }
    `,
    options: [{class: 'always'}],
    errors: [{message: 'Must use destructuring props assignment'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          return this.props.children;
        }
      });
    `,
    options: [{createClass: 'always'}],
    errors: [{message: 'Must use destructuring props assignment'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          const { children } = this.props;
          
          return children;
        }
      });
    `,
    options: [{createClass: 'never'}],
    errors: [{message: 'Must never use destructuring props assignment'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          const { children } = this.props;
          
          return children;
        }
      }
    `,
    options: [{class: 'never'}],
    errors: [{message: 'Must never use destructuring props assignment'}]
  }]
});
