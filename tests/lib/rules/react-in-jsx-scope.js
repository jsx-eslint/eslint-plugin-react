/**
 * @fileoverview Tests for react-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/react-in-jsx-scope');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

var settings = {
  react: {
    pragma: 'Foo'
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('react-in-jsx-scope', rule, {
  valid: [
    {code: 'var React, App; <App />;', parserOptions: parserOptions},
    {code: 'var React; <img />;', parserOptions: parserOptions},
    {code: 'var React; <x-gif />;', parserOptions: parserOptions},
    {code: 'var React, App, a=1; <App attr={a} />;', parserOptions: parserOptions},
    {code: 'var React, App, a=1; function elem() { return <App attr={a} />; }', parserOptions: parserOptions},
    {code: 'var React, App; <App />;', parserOptions: parserOptions},
    {code: '/** @jsx Foo */ var Foo, App; <App />;', parserOptions: parserOptions},
    {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;', parserOptions: parserOptions},
    {code: [
      'import React from \'react/addons\';',
      'const Button = createReactClass({',
      '  render() {',
      '    return (',
      '      <button {...this.props}>{this.props.children}</button>',
      '    )',
      '  }',
      '});',
      'export default Button;'
    ].join('\n'), parserOptions: parserOptions},
    {code: 'var Foo, App; <App />;', settings: settings, parserOptions: parserOptions}
  ],
  invalid: [{
    code: 'var App, a = <App />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: 'var a = <App />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: 'var a = <img />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: '/** @jsx React.DOM */ var a = <img />;',
    errors: [{message: '\'React\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: '/** @jsx Foo.bar */ var React, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}], parserOptions: parserOptions
  }, {
    code: 'var React, a = <img />;',
    errors: [{message: '\'Foo\' must be in scope when using JSX'}], settings: settings, parserOptions: parserOptions
  }]
});
