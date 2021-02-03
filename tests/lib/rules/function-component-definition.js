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
    // shouldn't trigger this rule since functions stating with a lowercase
    // letter are not considered components
    code: `
    const selectAvatarByUserId = (state, id) => {
      const user = selectUserById(state, id)
      return null
    }
    `,
    options: [{namedComponents: 'function-declaration'}]
  }, {
    // shouldn't trigger this rule since functions stating with a lowercase
    // letter are not considered components
    code: `
      function ensureValidSourceType(sourceType: string) {
        switch (sourceType) {
          case 'ALBUM':
          case 'PLAYLIST':
            return sourceType;
          default:
            return null;
        }
      }
    `,
    options: [{namedComponents: 'arrow-function'}],
    parser: parsers.TYPESCRIPT_ESLINT
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
  },
  // https://github.com/yannickcr/eslint-plugin-react/issues/2765
  {
    code: [
      'const obj = {',
      '  serialize: (el) => {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: (el) => {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: (el) => {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}]
  },
  {
    code: [
      'const obj = {',
      '  serialize: function (el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: function (el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: function (el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}]
  }, {
    code: [
      'const obj = {',
      '  serialize(el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-declaration'}]
  }, {
    code: [
      'const obj = {',
      '  serialize(el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'arrow-function'}]
  }, {
    code: [
      'const obj = {',
      '  serialize(el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{namedComponents: 'function-expression'}]
  }, {
    code: [
      'const obj = {',
      '  serialize(el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'arrow-function'}]
  }, {
    code: [
      'const obj = {',
      '  serialize(el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'function-expression'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: (el) => {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'arrow-function'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: (el) => {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'function-expression'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: function (el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'arrow-function'}]
  }, {
    code: [
      'const obj = {',
      '  serialize: function (el) {',
      '    return <p/>',
      '  }',
      '}'
    ].join('\n'),
    options: [{unnamedComponents: 'function-expression'}]
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'function-declaration'}]
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'function-expression'}]
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-expression'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'function-declaration'}],
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
    errors: [{messageId: 'arrow-function'}],
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
    errors: [{messageId: 'arrow-function'}],
    parser: parsers.BABEL_ESLINT
  }]
});
