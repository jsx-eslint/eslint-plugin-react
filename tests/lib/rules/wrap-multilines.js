/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/wrap-multilines');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Code Snippets
// ------------------------------------------------------------------------------

var RETURN_SINGLE_LINE = '\
  var Hello = React.createClass({\
    render: function() {\
      return <p>Hello {this.props.name}</p>;\
    }\
  });';

var RETURN_PAREN = '\
  var Hello = React.createClass({\
    render: function() {\
      return (<div>\n\
        <p>Hello {this.props.name}</p>\n\
      </div>);\
    }\
  });';

var RETURN_NO_PAREN = '\
  var Hello = React.createClass({\
    render: function() {\
      return <div>\n\
        <p>Hello {this.props.name}</p>\n\
      </div>;\
    }\
  });';

var DECLARATION_SINGLE_LINE = 'var hello = <p>Hello</p>;';

var DECLARATION_PAREN = '\
  var hello = (<div>\n\
    <p>Hello</p>\n\
  </div>);';

var DECLARATION_NO_PAREN = '\
  var hello = <div>\n\
    <p>Hello</p>\n\
  </div>;';

var ASSIGNMENT_SINGLE_LINE = 'var hello; hello = <p>Hello</p>;';

var ASSIGNMENT_PAREN = '\
  var hello;\
  hello = (<div>\n\
    <p>Hello</p>\n\
  </div>);';

var ASSIGNMENT_NO_PAREN = '\
  var hello;\
  hello = <div>\n\
    <p>Hello</p>\n\
  </div>;';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('wrap-multilines', rule, {

  valid: [
    {
      code: RETURN_SINGLE_LINE,
      parserOptions: parserOptions
    }, {
      code: RETURN_PAREN,
      parserOptions: parserOptions
    }, {
      code: RETURN_NO_PAREN,
      options: [{return: false}],
      parserOptions: parserOptions
    }, {
      code: DECLARATION_SINGLE_LINE,
      parserOptions: parserOptions
    }, {
      code: DECLARATION_PAREN,
      parserOptions: parserOptions
    }, {
      code: DECLARATION_NO_PAREN,
      options: [{declaration: false}],
      parserOptions: parserOptions
    }, {
      code: ASSIGNMENT_SINGLE_LINE,
      options: [{declaration: false}],
      parserOptions: parserOptions
    }, {
      code: ASSIGNMENT_PAREN,
      parserOptions: parserOptions
    }, {
      code: ASSIGNMENT_NO_PAREN,
      options: [{assignment: false}],
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: RETURN_NO_PAREN,
      output: RETURN_PAREN,
      parserOptions: parserOptions,
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: RETURN_NO_PAREN,
      output: RETURN_PAREN,
      parserOptions: parserOptions,
      options: [{return: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: DECLARATION_NO_PAREN,
      output: DECLARATION_PAREN,
      parserOptions: parserOptions,
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: DECLARATION_NO_PAREN,
      output: DECLARATION_PAREN,
      parserOptions: parserOptions,
      options: [{declaration: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: ASSIGNMENT_PAREN,
      parserOptions: parserOptions,
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: ASSIGNMENT_PAREN,
      parserOptions: parserOptions,
      options: [{assignment: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }
  ]
});
