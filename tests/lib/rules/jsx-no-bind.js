/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component definition.
 * @author Daniel Lo Nigro <dan.cx>
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-bind');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-no-bind', rule, {

  valid: [
    // Not covered by the rule
    {
      code: '<div onClick={this._handleClick}></div>',
      parser: 'babel-eslint'
    },
    {
      code: '<div meaningOfLife={42}></div>',
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={getHandler()}></div>',
      parser: 'babel-eslint'
    },

    // bind() explicitly allowed
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      options: [{allowBind: true}],
      parser: 'babel-eslint'
    },

    // Arrow functions explicitly allowed
    {
      code: '<div onClick={() => alert("1337")}></div>',
      options: [{allowArrowFunctions: true}],
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    // .bind()
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={someGlobalFunction.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={window.lol.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },

    // Arrow functions
    {
      code: '<div onClick={() => alert("1337")}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={() => 42}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={param => { first(); second(); }}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    }
  ]
});
