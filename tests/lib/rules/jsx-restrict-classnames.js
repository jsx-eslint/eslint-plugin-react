/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component definition.
 * @author Daniel Lo Nigro <dan.cx>
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-restrict-classnames');
var RuleTester = require('eslint').RuleTester;

var RESTRICTED_CLASSNAME_ERR = 'Prefer using component <Foo/> instead of class foo';
var RESTRICTED_CLASSNAME_PREFIX_ERR = 'className should not have a js- prefix';
var ruleOptions = [{
  className: 'foo',
  isPrefix: false,
  message: 'Prefer using component <Foo/> instead of class foo'
}, {
  className: 'js-',
  isPrefix: true,
  message: 'className should not have a js- prefix'
}];

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-restrict-classnames', rule, {

  valid: [
    {
      code: '<div></div>',
      parser: 'babel-eslint'
    },
    {
      code: '<div></div>',
      parser: 'babel-eslint',
      options: [ruleOptions]
    },
    {
      code: '<div className="bar"></div>',
      parser: 'babel-eslint',
      options: [ruleOptions]
    },
    {
      code: '<div className="prefix-bar"></div>',
      parser: 'babel-eslint',
      options: [ruleOptions]
    }
  ],

  invalid: [
    {
      code: '<div className="foo"></div>',
      errors: [{message: RESTRICTED_CLASSNAME_ERR}],
      parser: 'babel-eslint',
      options: [ruleOptions]
    },
    {
      code: '<div className="js-foo"></div>',
      errors: [{message: RESTRICTED_CLASSNAME_PREFIX_ERR}],
      parser: 'babel-eslint',
      options: [ruleOptions]
    }
  ]
});
