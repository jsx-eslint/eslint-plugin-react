/**
 * @fileoverview Tests for jsx-uses-vars
 * @author Yannick Croissant
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
eslint.defineRule('jsx-uses-vars', require('../../../lib/rules/jsx-uses-vars'));
eslintTester.addRuleTest('node_modules/eslint/lib/rules/no-unused-vars', {
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
      ecmaFeatures: {
        jsx: true
      }
    },
    {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        React.render(<App/>);',
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
          var a=1;\
          React.render(<img src={a} />);',
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: '\
        /*eslint jsx-uses-vars:1*/\
        var App;\
        function f() {\
          return <App />;\
        }\
        f();',
      ecmaFeatures: {
        jsx: true
      }
    }
  ],
  invalid: [
    {
      code: '/*eslint jsx-uses-vars:1*/ var App;',
      errors: [{message: 'App is defined but never used'}], ecmaFeatures: {jsx: true}
    }
  ]
});
