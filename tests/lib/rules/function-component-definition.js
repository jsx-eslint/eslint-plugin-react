/**
 * @fileoverview Standardize the way function component get defined
 * @author Stefan Wullems
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/function-component-definition');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const parsers = require('../../helpers/parsers');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('function-component-definition', rule, {

  valid: [{
    code: [
      'class Hello extends React.Component {',
      '  render() { return <div>Hello {this.props.name}</div> }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() { return <div>Hello {this.props.name}</div> }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() { return <div>Hello {this.props.name}</div> }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}]
  }, {
    code: 'var Hello = (props) => { return <div/> }',
    options: [{namedComponents: 'arrow-function'}]
  }, {
    code: 'function Hello(props) { return <div/> }',
    options: [{namedComponents: 'function-declaration'}]
  }, {
    code: 'var Hello = function(props) { return <div/> }',
    options: [{namedComponents: 'function-expression'}]
  }, {
    code: 'function Hello() { return function() { return <div/> } }',
    options: [{unnamedComponents: 'function-expression'}]
  }, {
    code: 'function Hello() { return () => { return <div/> }}',
    options: [{unnamedComponents: 'arrow-function'}]
  }, {
    code: 'var Foo = React.memo(function Foo() { return <p/> })',
    options: [{namedComponents: 'function-declaration'}]
  }, {
    code: 'function Hello(props: Test) { return <p/> }',
    options: [{namedComponents: 'function-declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = function(props: Test) { return <p/> }',
    options: [{namedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = (props: Test) => { return <p/> }',
    options: [{namedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello: React.FC<Test> = function(props) { return <p/> }',
    options: [{namedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello: React.FC<Test> = (props) => { return <p/> }',
    options: [{namedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function Hello<Test>(props: Props<Test>) { return <p/> }',
    options: [{namedComponents: 'function-declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function Hello<Test extends {}>(props: Props<Test>) { return <p/> }',
    options: [{namedComponents: 'function-declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = function<Test>(props: Props<Test>) { return <p/> }',
    options: [{namedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = function<Test extends {}>(props: Props<Test>) { return <p/> }',
    options: [{namedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = <Test extends {}>(props: Props<Test>) => { return <p/> }',
    options: [{namedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function wrapper() { return function<Test>(props: Props<Test>) { return <p/> } } ',
    options: [{unnamedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function wrapper() { return function<Test extends {}>(props: Props<Test>) { return <p/> } } ',
    options: [{unnamedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function wrapper() { return<Test extends {}>(props: Props<Test>) => { return <p/> } } ',
    options: [{unnamedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = function(props): ReactNode { return <p/> }',
    options: [{namedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'var Hello = (props): ReactNode => { return <p/> }',
    options: [{namedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function wrapper() { return function(props): ReactNode { return <p/> } }',
    options: [{unnamedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function wrapper() { return (props): ReactNode => { return <p/> } }',
    options: [{unnamedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: 'function Hello(props): ReactNode { return <p/> }',
    options: [{namedComponents: 'function-declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }],

  invalid: [{
    code: [
      'function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'var Hello = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'var Hello = (props) =>(',
      '  <div/>',
      ')'
    ].join('\n'),
    output: [
      'function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'var Hello = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}]
  }, {
    code: [
      'var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}]
  }, {
    code: [
      'function wrap(Component) {',
      '  return function(props) {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return (props) => {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not an arrow function'}],
    options: [{unnamedComponents: 'arrow-function'}]
  }, {
    code: [
      'function wrap(Component) {',
      '  return (props) => {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return function(props) {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not a function expression'}],
    options: [{unnamedComponents: 'function-expression'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'var Hello = (props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = function(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function Hello(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = (props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = function(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = (props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function Hello(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = (props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello: React.FC<Test> = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello: React.FC<Test> = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello: React.FC<Test> = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello: React.FC<Test> = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello: React.FC<Test> = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello: React.FC<Test> = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello: React.FC<Test> = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello: React.FC<Test> = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function Hello<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = <Test extends {}>(props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function Hello<Test>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello<Test>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function Hello<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = <Test extends {}>(props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = <Test extends {}>(props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}],
    errors: [{message: 'Function component is not a function expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = function<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = <Test extends {}>(props: Test) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = function<Test>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'var Hello = function<Test>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'var Hello = function<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'function Hello<Test extends {}>(props: Test) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function wrap(Component) {',
      '  return function<Test extends {}>(props) {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return <Test extends {}>(props) => {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not an arrow function'}],
    options: [{unnamedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function wrap(Component) {',
      '  return function<Test>(props) {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return function<Test>(props) {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not an arrow function'}],
    options: [{unnamedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function wrap(Component) {',
      '  return <Test extends {}>(props) => {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return function<Test extends {}>(props) {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not a function expression'}],
    options: [{unnamedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function wrap(Component) {',
      '  return function(props): ReactNode {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return (props): ReactNode => {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not an arrow function'}],
    options: [{unnamedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
  }, {
    code: [
      'function wrap(Component) {',
      '  return (props): ReactNode => {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    output: [
      'function wrap(Component) {',
      '  return function(props): ReactNode {',
      '    return <div><Component {...props}/></div>',
      '  }',
      '}'
    ].join('\n'),
    errors: [{message: 'Function component is not a function expression'}],
    options: [{unnamedComponents: 'function-expression'}],
    parser: parsers.TYPESCRIPT_ESLINT
  },
  {
    code: [
      'export function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'export var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'export var Hello = function(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'export var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'export var Hello = (props) => {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'export function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}],
    errors: [{message: 'Function component is not a function declaration'}],
    parser: parsers.BABEL_ESLINT
  },
  {
    code: [
      'export default function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'export default function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'module.exports = function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    output: [
      'module.exports = function Hello(props) {',
      '  return <div/>',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'arrow-function'}],
    errors: [{message: 'Function component is not an arrow function'}],
    parser: parsers.BABEL_ESLINT
  }]
});
