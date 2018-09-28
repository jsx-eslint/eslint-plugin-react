/**
 * @fileoverview Tests for jsx-uses-vars
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const ruleNoUnusedVars = require('eslint/lib/rules/no-unused-vars');
const rulePreferConst = require('eslint/lib/rules/prefer-const');
const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('jsx-uses-vars', require('../../../lib/rules/jsx-uses-vars'));
ruleTester.run('no-unused-vars', ruleNoUnusedVars, {
  valid: [
    {
      code: `
        /* eslint jsx-uses-vars: 1 */
        function foo() {
          var App;
          var bar = React.render(<App/>);
          return bar;
        };
        foo()
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        React.render(<App/>);
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        React.render(<App/>);
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var a = 1;
        React.render(<img src={a} />);
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        function f() {
          return <App />;
        }
        f();
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        <App.Hello />
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        <App:Hello />
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        class HelloMessage {};
        <HelloMessage />
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        class HelloMessage {
          render() {
            var HelloMessage = <div>Hello</div>;
            return HelloMessage;
          }
        };
        <HelloMessage />
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        function foo() {
          var App = { Foo: { Bar: {} } };
          var bar = React.render(<App.Foo.Bar/>);
          return bar;
        };
        foo()
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        function foo() {
          var App = { Foo: { Bar: { Baz: {} } } };
          var bar = React.render(<App.Foo.Bar.Baz/>);
          return bar;
        };
        foo()
      `
    }
  ],
  invalid: [
    {
      code: '/* eslint jsx-uses-vars: 1 */ var App;',
      errors: [{message: '\'App\' is defined but never used.'}]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        var unused;
        React.render(<App unused=""/>);
      `,
      errors: [{message: '\'unused\' is defined but never used.'}]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var App;
        var Hello;
        React.render(<App:Hello/>);
      `,
      errors: [{message: '\'Hello\' is defined but never used.'}]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        var Button;
        var Input;
        React.render(<Button.Input unused=""/>);
      `,
      errors: [{message: '\'Input\' is defined but never used.'}]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        class unused {}
      `,
      errors: [{message: '\'unused\' is defined but never used.'}]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        class HelloMessage {
          render() {
            var HelloMessage = <div>Hello</div>;
            return HelloMessage;
          }
        }
      `,
      errors: [{
        message: '\'HelloMessage\' is defined but never used.',
        line: 3
      }]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        class HelloMessage {
          render() {
            var HelloMessage = <div>Hello</div>;
            return HelloMessage;
          }
        }
      `,
      errors: [{
        message: '\'HelloMessage\' is defined but never used.',
        line: 3
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        import {Hello} from 'Hello';
        function Greetings() {
          const Hello = require('Hello').default;
          return <Hello />;
        }
        Greetings();
      `,
      errors: [{
        message: '\'Hello\' is defined but never used.',
        line: 3
      }],
      parser: 'babel-eslint'
    }
  ]
});

// Check compatibility with eslint prefer-const rule (#716)
ruleTester.run('prefer-const', rulePreferConst, {
  valid: [],
  invalid: [{
    code: `
      /* eslint jsx-uses-vars:1 */
      let App = <div />;
      <App />;
    `,
    errors: [{message: '\'App\' is never reassigned. Use \'const\' instead.'}]
  }, {
    code: `
      /* eslint jsx-uses-vars:1 */
      let filters = 'foo';
      <div>{filters}</div>;
    `,
    errors: [{message: '\'filters\' is never reassigned. Use \'const\' instead.'}]
  }]
});
