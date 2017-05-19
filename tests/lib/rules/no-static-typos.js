/**
 * @fileoverview Tests for no-static-typos
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-static-typos');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Typo in static class property declaration';

var ruleTester = new RuleTester();
ruleTester.run('no-static-typos', rule, {

  valid: [{
    code: [
      'class First {',
      '  static PropTypes = {key: "myValue"};',
      '  static ContextTypes = {key: "myValue"};',
      '  static DefaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  static propTypes = {key: "myValue"};',
      '  static contextTypes = {key: "myValue"};',
      '  static defaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  propTypes = {key: "myValue"};',
      '  contextTypes = {key: "myValue"};',
      '  defaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  PropTypes = {key: "myValue"};',
      '  ContextTypes = {key: "myValue"};',
      '  DefaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  proptypes = {key: "myValue"};',
      '  contexttypes = {key: "myValue"};',
      '  defaultprops = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  static PropTypes() {};',
      '  static ContextTypes() {};',
      '  static DefaultProps() {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  static proptypes() {};',
      '  static contexttypes() {};',
      '  static defaultprops() {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'class Component extends React.Component {',
      '  static PropTypes = {};',
      '}'
    ].join('\n'),
    output: [
      'class Component extends React.Component {',
      '  static propTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static proptypes = {};',
      '}'
    ].join('\n'),
    output: [
      'class Component extends React.Component {',
      '  static propTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static ContextTypes = {};',
      '}'
    ].join('\n'),
    output: [
      'class Component extends React.Component {',
      '  static contextTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static contexttypes = {};',
      '}'
    ].join('\n'),
    output: [
      'class Component extends React.Component {',
      '  static contextTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static DefaultProps = {};',
      '}'
    ].join('\n'),
    output: [
      'class Component extends React.Component {',
      '  static defaultProps = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static defaultprops = {};',
      '}'
    ].join('\n'),
    output: [
      'class Component extends React.Component {',
      '  static defaultProps = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }]
});
