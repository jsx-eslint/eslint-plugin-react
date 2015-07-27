/**
 * @fileoverview Tests for react-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint').ESLintTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/react-in-jsx-scope', {
  valid: [
    {code: 'var React, App; <App />;', ecmaFeatures: {jsx: true}},
    {code: 'var React; <img />;', ecmaFeatures: {jsx: true}},
    {code: 'var React; <x-gif />;', ecmaFeatures: {jsx: true}},
    {code: 'var React, App, a=1; <App attr={a} />;', ecmaFeatures: {jsx: true}},
    {code: 'var React, App, a=1; function elem() { return <App attr={a} />; }', ecmaFeatures: {jsx: true}},
    {code: 'var React, App; <App />;', ecmaFeatures: {globalReturn: true, jsx: true}},
    {code: '/** @jsx Foo */ var Foo, App; <App />;', ecmaFeatures: {jsx: true}},
    {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;', ecmaFeatures: {jsx: true}},
    {code: [
      'import React from \'react/addons\';',
      'const Button = React.createClass({',
      '  render() {',
      '    return (',
      '      <button {...this.props}>{this.props.children}</button>',
      '    )',
      '  }',
      '});',
      'export default Button;'
    ].join('\n'),
    ecmaFeatures: {
      blockBindings: true,
      objectLiteralShorthandMethods: true,
      modules: true,
      jsx: true
    }}
  ],
  invalid: [
    {code: 'var App, a = <App />;',
     errors: [{message: '\'React\' must be in scope when using JSX'}], ecmaFeatures: {jsx: true}},
    {code: 'var a = <App />;',
     errors: [{message: '\'React\' must be in scope when using JSX'}], ecmaFeatures: {jsx: true}},
    {code: 'var a = <img />;',
     errors: [{message: '\'React\' must be in scope when using JSX'}], ecmaFeatures: {jsx: true}},
    {code: '/** @jsx React.DOM */ var a = <img />;',
     errors: [{message: '\'React\' must be in scope when using JSX'}], ecmaFeatures: {jsx: true}},
    {code: '/** @jsx Foo.bar */ var React, a = <img />;',
     errors: [{message: '\'Foo\' must be in scope when using JSX'}], ecmaFeatures: {jsx: true}}
  ]
});
