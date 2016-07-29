/**
 * @fileoverview Tests for jsx-uses-vars
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var rule = require('eslint/lib/rules/no-unused-vars');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
eslint.defineRule('jsx-uses-vars', require('../../../lib/rules/jsx-uses-vars'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        function foo() {\
          var App;\
          var bar = React.render(<App/>);\
          return bar;\
        };\
        foo()',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        React.render(<App/>);',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        React.render(<App/>);',
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
          var a=1;\
          React.render(<img src={a} />);',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        function f() {\
          return <App />;\
        }\
        f();',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        <App.Hello />',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        <App:Hello />',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        class HelloMessage {}\
        <HelloMessage />',
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        class HelloMessage {\
          render() {\
            var HelloMessage = <div>Hello</div>;\
            return HelloMessage;\
          }\
        }\
        <HelloMessage />',
      parserOptions: parserOptions
    }
  ],
  invalid: [
    {
      code: '/*eslint jsx-uses-vars:1*/ var App;',
      errors: [{message: '\'App\' is defined but never used.'}],
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        var unused;\
        React.render(<App unused=""/>);',
      errors: [{message: '\'unused\' is defined but never used.'}],
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        var Hello;\
        React.render(<App:Hello/>);',
      errors: [{message: '\'Hello\' is defined but never used.'}],
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var Button;\
        var Input;\
        React.render(<Button.Input unused=""/>);',
      errors: [{message: '\'Input\' is defined but never used.'}],
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        class unused {}',
      errors: [{message: '\'unused\' is defined but never used.'}],
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        class HelloMessage {\
          render() {\
            var HelloMessage = <div>Hello</div>;\
            return HelloMessage;\
          }\
        }',
      errors: [{
        message: '\'HelloMessage\' is defined but never used.',
        line: 1
      }],
      parserOptions: parserOptions
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        class HelloMessage {\
          render() {\
            var HelloMessage = <div>Hello</div>;\
            return HelloMessage;\
          }\
        }',
      errors: [{
        message: '\'HelloMessage\' is defined but never used.',
        line: 1
      }],
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }
  ]
});
