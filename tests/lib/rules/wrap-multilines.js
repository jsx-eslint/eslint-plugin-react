/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

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
      return (\n\
        <div>\n\
          <p>Hello {this.props.name}</p>\n\
        </div>\n\
      );\
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
  var hello = (\n\
    <div>\n\
      <p>Hello</p>\n\
    </div>\n\
  );';

var DECLARATION_NO_PAREN = '\
  var hello = <div>\n\
    <p>Hello</p>\n\
  </div>;';

var ASSIGNMENT_SINGLE_LINE = 'var hello; hello = <p>Hello</p>;';

var ASSIGNMENT_PAREN = '\
  var hello;\
  hello = (\n\
    <div>\n\
      <p>Hello</p>\n\
    </div>\n\
  );';

var ASSIGNMENT_NO_PAREN = '\
  var hello;\
  hello = <div>\n\
    <p>Hello</p>\n\
  </div>;';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/wrap-multilines', {

  valid: [
    {
      code: RETURN_SINGLE_LINE,
      ecmaFeatures: {jsx: true}
    }, {
      code: RETURN_PAREN,
      ecmaFeatures: {jsx: true}
    }, {
      code: RETURN_NO_PAREN,
      args: [1, {return: false}],
      ecmaFeatures: {jsx: true}
    }, {
      code: DECLARATION_SINGLE_LINE,
      ecmaFeatures: {jsx: true}
    }, {
      code: DECLARATION_PAREN,
      ecmaFeatures: {jsx: true}
    }, {
      code: DECLARATION_NO_PAREN,
      args: [1, {declaration: false}],
      ecmaFeatures: {jsx: true}
    }, {
      code: ASSIGNMENT_SINGLE_LINE,
      args: [1, {declaration: false}],
      ecmaFeatures: {jsx: true}
    }, {
      code: ASSIGNMENT_PAREN,
      ecmaFeatures: {jsx: true}
    }, {
      code: ASSIGNMENT_NO_PAREN,
      args: [1, {assignment: false}],
      ecmaFeatures: {jsx: true}
    }
  ],

  invalid: [
    {
      code: RETURN_NO_PAREN,
      ecmaFeatures: {jsx: true},
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: RETURN_NO_PAREN,
      ecmaFeatures: {jsx: true},
      args: [1, {return: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: DECLARATION_NO_PAREN,
      ecmaFeatures: {jsx: true},
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: DECLARATION_NO_PAREN,
      ecmaFeatures: {jsx: true},
      args: [1, {declaration: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      ecmaFeatures: {jsx: true},
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      ecmaFeatures: {jsx: true},
      args: [1, {assignment: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }
  ]
});
