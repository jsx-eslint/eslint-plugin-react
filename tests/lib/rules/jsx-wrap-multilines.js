/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-wrap-multilines');
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

var RETURN_SINGLE_LINE = `
  var Hello = createReactClass({
    render: function() {
      return <p>Hello {this.props.name}</p>;
    }
  });
`;

var RETURN_PAREN = `
  var Hello = createReactClass({
    render: function() {
      return (<div>
        <p>Hello {this.props.name}</p>
      </div>);
    }
  });
`;

var RETURN_NO_PAREN = `
  var Hello = createReactClass({
    render: function() {
      return <div>
        <p>Hello {this.props.name}</p>
      </div>;
    }
  });
`;

var DECLARATION_TERNARY_SINGLE_LINE = 'var hello = foo ? <p>Hello</p> : <p>Hi</p>;';

var DECLARATION_TERNARY_PAREN = `
  var hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`;

var DECLARATION_TERNARY_NO_PAREN = `
  var hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`;

var ASSIGNMENT_TERNARY_SINGLE_LINE = 'var hello; hello = foo ? <p>Hello</p> : <p>Hi</p>;';

var ASSIGNMENT_TERNARY_PAREN = `
  var hello;
  hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`;

var ASSIGNMENT_TERNARY_NO_PAREN = `
  var hello;
  hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`;

var DECLARATION_SINGLE_LINE = 'var hello = <p>Hello</p>;';

var DECLARATION_PAREN = `
  var hello = (<div>
    <p>Hello</p>
  </div>);
`;

var DECLARATION_NO_PAREN = `
  var hello = <div>
    <p>Hello</p>
  </div>;
`;

var ASSIGNMENT_SINGLE_LINE = 'var hello; hello = <p>Hello</p>;';

var ASSIGNMENT_PAREN = `
  var hello;
  hello = (<div>
    <p>Hello</p>
  </div>);
`;

var ASSIGNMENT_NO_PAREN = `
  var hello;
  hello = <div>
    <p>Hello</p>
  </div>;
`;

var ARROW_SINGLE_LINE = 'var hello = () => <p>Hello</p>;';

var ARROW_PAREN = '\
  var hello = () => (<div>\n\
    <p>Hello</p>\n\
  </div>);';

var ARROW_NO_PAREN = '\
  var hello = () => <div>\n\
    <p>Hello</p>\n\
  </div>;';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-wrap-multilines', rule, {

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
      code: DECLARATION_TERNARY_SINGLE_LINE,
      parserOptions: parserOptions
    }, {
      code: DECLARATION_TERNARY_PAREN,
      parserOptions: parserOptions
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      options: [{declaration: false}],
      parserOptions: parserOptions
    }, {
      code: ASSIGNMENT_TERNARY_SINGLE_LINE,
      parserOptions: parserOptions
    }, {
      code: ASSIGNMENT_TERNARY_PAREN,
      parserOptions: parserOptions
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      options: [{assignment: false}],
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
    }, {
      code: ARROW_PAREN,
      options: [],
      parserOptions: parserOptions
    }, {
      code: ARROW_SINGLE_LINE,
      options: [],
      parserOptions: parserOptions
    }, {
      code: ARROW_NO_PAREN,
      options: [{arrow: false}],
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
      code: DECLARATION_TERNARY_NO_PAREN,
      output: DECLARATION_TERNARY_PAREN,
      parserOptions: parserOptions,
      errors: [
        {message: 'Missing parentheses around multilines JSX'},
        {message: 'Missing parentheses around multilines JSX'}
      ]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      output: ASSIGNMENT_TERNARY_PAREN,
      parserOptions: parserOptions,
      errors: [
        {message: 'Missing parentheses around multilines JSX'},
        {message: 'Missing parentheses around multilines JSX'}
      ]
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
    }, {
      code: ARROW_NO_PAREN,
      output: ARROW_PAREN,
      parserOptions: parserOptions,
      options: [{arrow: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }
  ]
});
