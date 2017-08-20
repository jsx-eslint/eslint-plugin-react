/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-wrap-multilines');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
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

const RETURN_SINGLE_LINE = `
  var Hello = createReactClass({
    render: function() {
      return <p>Hello {this.props.name}</p>;
    }
  });
`;

const RETURN_PAREN = `
  var Hello = createReactClass({
    render: function() {
      return (<div>
        <p>Hello {this.props.name}</p>
      </div>);
    }
  });
`;

const RETURN_NO_PAREN = `
  var Hello = createReactClass({
    render: function() {
      return <div>
        <p>Hello {this.props.name}</p>
      </div>;
    }
  });
`;

const DECLARATION_SINGLE_LINE = 'var hello = <p>Hello</p>;';

const DECLARATION_PAREN = `
  var hello = (<div>
    <p>Hello</p>
  </div>);
`;

const DECLARATION_NO_PAREN = `
  var hello = <div>
    <p>Hello</p>
  </div>;
`;

const ASSIGNMENT_SINGLE_LINE = 'var hello; hello = <p>Hello</p>;';

const ASSIGNMENT_PAREN = `
  var hello;
  hello = (<div>
    <p>Hello</p>
  </div>);
`;

const ASSIGNMENT_NO_PAREN = `
  var hello;
  hello = <div>
    <p>Hello</p>
  </div>;
`;

const ARROW_SINGLE_LINE = 'var hello = () => <p>Hello</p>;';

const ARROW_PAREN = `
  var hello = () => (<div>
    <p>Hello</p>
  </div>);
`;

const ARROW_NO_PAREN = `
  var hello = () => <div>
    <p>Hello</p>
  </div>;
`;

const CONDITION_SINGLE_LINE = 'foo ? <p>Hello</p> : null;';

const CONDITION_PAREN = `
  <div>
    {foo ? (<div>
        <p>Hello</p>
      </div>) : null}
  </div>
`;

const CONDITION_NO_PAREN = `
  <div>
    {foo ? <div>
        <p>Hello</p>
      </div> : null}
  </div>
`;

const LOGICAL_SINGLE_LINE = 'foo && <p>Hello</p>;';

const LOGICAL_PAREN = `
  <div>
    {foo &&
      (<div>
        <p>Hello World</p>
      </div>)
    }
  </div>
`;

const LOGICAL_NO_PAREN = `
  <div>
    {foo &&
      <div>
        <p>Hello World</p>
      </div>
    }
  </div>
`;

const ATTR_SINGLE_LINE = '<div attr={<p>Hello</p>}></div>';

const ATTR_PAREN = `
  <div attr={
    (<div>
      <p>Hello</p>
    </div>)
  }>
    <p>Hello</p>
  </div>
`;

const ATTR_NO_PAREN = `
  <div attr={
    <div>
      <p>Hello</p>
    </div>
  }>
    <p>Hello</p>
  </div>
`;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
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
    }, {
      code: CONDITION_SINGLE_LINE
    }, {
      code: CONDITION_NO_PAREN
    }, {
      code: CONDITION_PAREN,
      options: [{condition: true}]
    }, {
      code: LOGICAL_SINGLE_LINE
    }, {
      code: LOGICAL_NO_PAREN
    }, {
      code: LOGICAL_PAREN,
      options: [{logical: true}]
    }, {
      code: ATTR_SINGLE_LINE
    }, {
      code: ATTR_NO_PAREN
    }, {
      code: ATTR_PAREN,
      options: [{attr: true}]
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
    }, {
      code: CONDITION_NO_PAREN,
      output: CONDITION_PAREN,
      options: [{condition: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: LOGICAL_NO_PAREN,
      output: LOGICAL_PAREN,
      options: [{logical: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }, {
      code: ATTR_NO_PAREN,
      output: ATTR_PAREN,
      options: [{attr: true}],
      errors: [{message: 'Missing parentheses around multilines JSX'}]
    }
  ]
});
