/**
 * @fileoverview Tests for react-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/react-in-jsx-scope', {
    valid: [
        {code: 'var React, App; <App />;', args: [1, {vars: 'all'}], ecmaFeatures: {jsx: true}},
        {code: 'var React; <img />;', args: [1, {vars: 'all'}], ecmaFeatures: {jsx: true}},
        {code: 'var React; <x-gif />;', args: [1, {vars: 'all'}], ecmaFeatures: {jsx: true}},
        {code: 'var React, App, a=1; <App attr={a} />;', ecmaFeatures: {jsx: true}},
        {code: 'var React, App, a=1; function elem() { return <App attr={a} />; }', ecmaFeatures: {jsx: true}},
        {code: 'var React, App; <App />;', args: [1, {vars: 'all'}], ecmaFeatures: {globalReturn: true, jsx: true}},
        {code: '/** @jsx Foo */ var Foo, App; <App />;', args: [1, {vars: 'all'}], ecmaFeatures: {jsx: true}},
        {code: '/** @jsx Foo.Bar */ var Foo, App; <App />;', args: [1, {vars: 'all'}], ecmaFeatures: {jsx: true}}
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
