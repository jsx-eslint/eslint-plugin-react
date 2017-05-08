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
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
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

var ARROW_PAREN = `
  var hello = () => (<div>
    <p>Hello</p>
  </div>);
`;

var ARROW_NO_PAREN = `
  var hello = () => <div>
    <p>Hello</p>
  </div>;
`;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-wrap-multilines', rule, {

  valid: [
    {
      code: RETURN_SINGLE_LINE
    }, {
      code: RETURN_PAREN
    }, {
      code: RETURN_NO_PAREN,
      options: [{return: false}]
    }, {
      code: DECLARATION_TERNARY_SINGLE_LINE
    }, {
      code: DECLARATION_TERNARY_PAREN
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      options: [{declaration: false}]
    }, {
      code: ASSIGNMENT_TERNARY_SINGLE_LINE
    }, {
      code: ASSIGNMENT_TERNARY_PAREN
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      options: [{assignment: false}]
    }, {
      code: DECLARATION_SINGLE_LINE
    }, {
      code: DECLARATION_PAREN
    }, {
      code: DECLARATION_NO_PAREN,
      options: [{declaration: false}]
    }, {
      code: ASSIGNMENT_SINGLE_LINE,
      options: [{declaration: false}]
    }, {
      code: ASSIGNMENT_PAREN
    }, {
      code: ASSIGNMENT_NO_PAREN,
      options: [{assignment: false}]
    }, {
      code: ARROW_PAREN,
      options: []
    }, {
      code: ARROW_SINGLE_LINE,
      options: []
    }, {
      code: ARROW_NO_PAREN,
      options: [{arrow: false}]
    }
  ],

  invalid: [
    {
      code: RETURN_NO_PAREN,
      output: RETURN_PAREN,
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: RETURN_NO_PAREN,
      output: RETURN_PAREN,
      options: [{return: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      output: DECLARATION_TERNARY_PAREN,
      errors: [
        {message: 'Missing parentheses around multilines JSX'},
        {message: 'Missing parentheses around multilines JSX'}
      ]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      output: ASSIGNMENT_TERNARY_PAREN,
      errors: [
        {message: 'Missing parentheses around multilines JSX'},
        {message: 'Missing parentheses around multilines JSX'}
      ]
    }, {
      code: DECLARATION_NO_PAREN,
      output: DECLARATION_PAREN,
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: DECLARATION_NO_PAREN,
      output: DECLARATION_PAREN,
      options: [{declaration: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: ASSIGNMENT_PAREN,
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: ASSIGNMENT_PAREN,
      options: [{assignment: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ARROW_NO_PAREN,
      output: ARROW_PAREN,
      options: [{arrow: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }
  ]
});
