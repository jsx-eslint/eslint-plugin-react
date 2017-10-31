/**
 * @fileoverview Report "this" being used in stateless functional components.
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Stateless functional components should not use this';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-this-in-sfc');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-this-in-sfc', rule, {
  valid: [{
    code: `
    function Foo(props) {
      const { foo } = props;
      return <div bar={foo} />;
    }`
  }, {
    code: `
    class Foo extends React.Component {
      render() {
        const { foo } = this.props;
        return <div bar={foo} />;
      }
    }`
  }, {
    code: `
    const Foo = createReactClass({
      render: function() {
        return <div>{this.props.foo}</div>;
      }
    });`
  }, {
    code: `
    const Foo = React.createClass({
      render: function() {
        return <div>{this.props.foo}</div>;
      }
    });`,
    settings: {react: {createClass: 'createClass'}}
  }, {
    code: `
    function Foo (bar) {
      this.bar = bar;
      this.props = 'baz';
      this.getFoo = function() {
        return this.bar + this.props;
      }
    }
    `
  }],
  invalid: [{
    code: `
    function Foo(props) {
      const { foo } = this.props;
      return <div>{foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    function Foo(props) {
      return <div>{this.props.foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    function Foo(props) {
      return <div>{this.state.foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    function Foo(props) {
      const { foo } = this.state;
      return <div>{foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    function Foo(props) {
      function onClick(bar) {
        this.props.onClick();
      }
      return <div onClick={onClick}>{this.props.foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}, {message: ERROR_MESSAGE}]
  }]
});
