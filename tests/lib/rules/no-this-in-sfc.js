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
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-this-in-sfc', rule, {
  valid: [{
    code: `
    import React from 'react';
    function Foo(props) {
      const { foo } = props;
      return <div bar={foo} />;
    }`
  }, {
    code: `
    import React from 'react';
    function Foo({ foo }) {
      return <div bar={foo} />;
    }`
  }, {
    code: `
    import React from 'react';
    class Foo extends React.Component {
      render() {
        const { foo } = this.props;
        return <div bar={foo} />;
      }
    }`
  }, {
    code: `
    import React from 'react';
    const Foo = createReactClass({
      render: function() {
        return <div>{this.props.foo}</div>;
      }
    });`
  }, {
    code: `
    import React from 'react';
    const Foo = React.createClass({
      render: function() {
        return <div>{this.props.foo}</div>;
      }
    });`,
    settings: {react: {createClass: 'createClass'}}
  }, {
    code: `
    function foo(bar) {
      this.bar = bar;
      this.props = 'baz';
      this.getFoo = function() {
        return this.bar + this.props;
      }
    }
    `
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      return props.foo ? <span>{props.bar}</span> : null;
    }`
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      if (props.foo) {
        return <div>{props.bar}</div>;
      }
      return null;
    }`
  }, {
    code: `
    function Foo(props) {
      if (props.foo) {
        something();
      }
      return null;
    }`
  }, {
    code: `
    import React from 'react';
    const Foo = (props) => <span>{props.foo}</span>`
  }, {
    code: `
    import React from 'react';
    const Foo = ({ foo }) => <span>{foo}</span>`
  }, {
    code: `
    import React from 'react';
    const Foo = (props) => props.foo ? <span>{props.bar}</span> : null;`
  }, {
    code: `
    import React from 'react';
    const Foo = ({ foo, bar }) => foo ? <span>{bar}</span> : null;`
  }, {
    code: `
    function Foo(props) {
      if (this.props.foo) {
        something();
      }
      return null;
    }`
  }, {
    code: `
    class Foo {
      bar() { 
        return () => {
          this.reset();
          return null;
        };
      }
    }`
  }],
  invalid: [{
    code: `
    import React from 'react';
    function Foo(props) {
      const { foo } = this.props;
      return <div>{foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      return <div>{this.props.foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      return <div>{this.state.foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      const { foo } = this.state;
      return <div>{foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      return props.foo ? <div>{this.props.bar}</div> : null;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      if (props.foo) {
        return <div>{this.props.bar}</div>;
      }
      return null;
    }`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    const Foo = (props) => <span>{this.props.foo}</span>`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    const Foo = (props) => this.props.foo ? <span>{props.bar}</span> : null;`,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
    import React from 'react';
    function Foo(props) {
      function onClick(bar) {
        this.props.onClick();
      }
      return <div onClick={onClick}>{this.props.foo}</div>;
    }`,
    errors: [{message: ERROR_MESSAGE}, {message: ERROR_MESSAGE}]
  }]
});
