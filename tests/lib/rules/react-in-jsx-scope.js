/**
 * @fileoverview Tests for react-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/react-in-jsx-scope');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('react-in-jsx-scope', rule, {
  valid: [
    {code: 'var React, App; <App />;'},
    {code: 'var React; <img />;'},
    {code: 'var React; <>fragment</>;', parser: 'babel-eslint'},
    {code: 'var React; <x-gif />;'},
    {code: 'var React, App, a=1; <App attr={a} />;'},
    {code: 'var React, App, a=1; function elem() { return <App attr={a} />; }'},
    {code: 'var React, App; <App />;'},
    {code: '/** @jsx Foo */ var Foo, App; <App />;'},
    {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;'},
    {code: `
      import React from 'react/addons';
      const Button = createReactClass({
        render() {
          return (
            <button {...this.props}>{this.props.children}</button>
          )
        }
      });
      export default Button;
    `},
    {code: 'var Foo, App; <App />;', settings: settings}
  ],
  invalid: [{
    code: 'var App, a = <App />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}]
  }, {
    code: 'var a = <App />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}]
  }, {
    code: 'var a = <img />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}]
  }, {
    code: 'var a = <>fragment</>;',
    parser: 'babel-eslint',
    errors: [{message: '\'React\' must be in scope when using JSX'}]
  }, {
    code: '/** @jsx React.DOM */ var a = <img />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}]
  }, {
    code: '/** @jsx Foo.bar */ var React, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}]
  }, {
    code: 'var React, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}], settings: settings
  }]
});
