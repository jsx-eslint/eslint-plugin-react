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
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Constants/Code Snippets
// ------------------------------------------------------------------------------

const MISSING_PARENS = 'Missing parentheses around multilines JSX';
const PARENS_NEW_LINES = 'Parentheses around JSX should be on separate lines';

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

const RETURN_PAREN_NEW_LINE = `
  var Hello = createReactClass({
    render: function() {
      return (
        <div>
          <p>Hello {this.props.name}</p>
        </div>
      );
    }
  });
`;

const DECLARATION_TERNARY_SINGLE_LINE = 'var hello = foo ? <p>Hello</p> : <p>Hi</p>;';

const DECLARATION_TERNARY_PAREN = `
  var hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`;

const DECLARATION_TERNARY_NO_PAREN = `
  var hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`;

const DECLARATION_TERNARY_PAREN_NEW_LINE = `
  var hello = foo ? (
    <div>
    <p>Hello</p>
    </div>
  ) : (
    <div>
      <p>Hi</p>
    </div>
  );
`;

const ASSIGNMENT_TERNARY_SINGLE_LINE = 'var hello; hello = foo ? <p>Hello</p> : <p>Hi</p>;';

const ASSIGNMENT_TERNARY_PAREN = `
  var hello;
  hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`;

const ASSIGNMENT_TERNARY_NO_PAREN = `
  var hello;
  hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`;

const ASSIGNMENT_TERNARY_PAREN_NEW_LINE = `
  var hello;
  hello = foo ? (
    <div>
      <p>Hello</p>
    </div>
  ) : (
    <div>
      <p>Hi</p>
    </div>
  );
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

const DECLARATION_PAREN_NEW_LINE = `
  var hello = (
    <div>
      <p>Hello</p>
    </div>
  );
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

const ASSIGNMENT_PAREN_NEW_LINE = `
  var hello;
  hello = (
    <div>
      <p>Hello</p>
    </div>
  );
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

const ARROW_PAREN_NEW_LINE = `
  var hello = () => (
    <div>
      <p>Hello</p>
    </div>
  );
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

const CONDITION_PAREN_NEW_LINE = `
  <div>
    {foo ? (
      <div>
        <p>Hello</p>
      </div>
    ) : null}
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

const LOGICAL_PAREN_NEW_LINE_AUTOFIX = `
  <div>
    {foo && (
<div>
        <p>Hello World</p>
      </div>
)}
  </div>
`;

const LOGICAL_PAREN_NEW_LINE = `
  <div>
    {foo && (
      <div>
        <p>Hello World</p>
      </div>
    )}
  </div>
`;

const ATTR_SINGLE_LINE = '<div prop={<p>Hello</p>}></div>';

const ATTR_PAREN = `
  <div prop={
    (<div>
      <p>Hello</p>
    </div>)
  }>
    <p>Hello</p>
  </div>
`;

const ATTR_NO_PAREN = `
  <div prop={
    <div>
      <p>Hello</p>
    </div>
  }>
    <p>Hello</p>
  </div>
`;

const ATTR_PAREN_NEW_LINE = `
  <div prop={(
    <div>
      <p>Hello</p>
    </div>
  )}>
    <p>Hello</p>
  </div>
`;

const ATTR_PAREN_NEW_LINE_AUTOFIX = `
  <div prop={(
<div>
      <p>Hello</p>
    </div>
)}>
    <p>Hello</p>
  </div>
`;

function addNewLineSymbols(code) {
  return code.replace(/\(</g, '(\n<').replace(/>\)/g, '>\n)');
}

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
      code: RETURN_SINGLE_LINE,
      options: [{return: true}]
    }, {
      code: RETURN_PAREN,
      options: [{return: true}]
    }, {
      code: RETURN_NO_PAREN,
      options: [{return: 'ignore'}]
    }, {
      code: RETURN_NO_PAREN,
      options: [{return: false}]
    }, {
      code: DECLARATION_TERNARY_SINGLE_LINE
    }, {
      code: DECLARATION_TERNARY_PAREN
    }, {
      code: DECLARATION_TERNARY_SINGLE_LINE,
      options: [{declaration: true}]
    }, {
      code: DECLARATION_TERNARY_PAREN,
      options: [{declaration: true}]
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      options: [{declaration: 'ignore'}]
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      options: [{declaration: false}]
    }, {
      code: ASSIGNMENT_TERNARY_SINGLE_LINE
    }, {
      code: ASSIGNMENT_TERNARY_PAREN
    }, {
      code: ASSIGNMENT_TERNARY_SINGLE_LINE,
      options: [{assignment: true}]
    }, {
      code: ASSIGNMENT_TERNARY_PAREN,
      options: [{assignment: true}]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      options: [{assignment: 'ignore'}]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      options: [{assignment: false}]
    }, {
      code: DECLARATION_SINGLE_LINE
    }, {
      code: DECLARATION_PAREN
    }, {
      code: DECLARATION_SINGLE_LINE,
      options: [{declaration: true}]
    }, {
      code: DECLARATION_PAREN,
      options: [{declaration: true}]
    }, {
      code: DECLARATION_NO_PAREN,
      options: [{declaration: 'ignore'}]
    }, {
      code: DECLARATION_NO_PAREN,
      options: [{declaration: false}]
    }, {
      code: ASSIGNMENT_SINGLE_LINE,
      options: [{declaration: 'ignore'}]
    }, {
      code: ASSIGNMENT_SINGLE_LINE,
      options: [{declaration: false}]
    }, {
      code: ASSIGNMENT_PAREN
    }, {
      code: ASSIGNMENT_PAREN,
      options: [{assignment: true}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      options: [{assignment: 'ignore'}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      options: [{assignment: false}]
    }, {
      code: ARROW_PAREN
    }, {
      code: ARROW_SINGLE_LINE
    }, {
      code: ARROW_PAREN,
      options: [{arrow: true}]
    }, {
      code: ARROW_SINGLE_LINE,
      options: [{arrow: true}]
    }, {
      code: ARROW_NO_PAREN,
      options: [{arrow: 'ignore'}]
    }, {
      code: ARROW_NO_PAREN,
      options: [{arrow: false}]
    }, {
      code: CONDITION_SINGLE_LINE
    }, {
      code: CONDITION_SINGLE_LINE,
      options: [{condition: true}]
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
      options: [{prop: true}]
    }, {
      code: RETURN_PAREN_NEW_LINE,
      options: [{return: 'parens-new-line'}]
    }, {
      code: DECLARATION_TERNARY_PAREN_NEW_LINE,
      options: [{declaration: 'parens-new-line'}]
    }, {
      code: ASSIGNMENT_TERNARY_PAREN_NEW_LINE,
      options: [{assignment: 'parens-new-line'}]
    }, {
      code: DECLARATION_PAREN_NEW_LINE,
      options: [{declaration: 'parens-new-line'}]
    }, {
      code: ASSIGNMENT_PAREN_NEW_LINE,
      options: [{assignment: 'parens-new-line'}]
    }, {
      code: ARROW_PAREN_NEW_LINE,
      options: [{arrow: 'parens-new-line'}]
    }, {
      code: CONDITION_PAREN_NEW_LINE,
      options: [{condition: 'parens-new-line'}]
    }, {
      code: LOGICAL_PAREN_NEW_LINE,
      options: [{logical: 'parens-new-line'}]
    }, {
      code: ATTR_PAREN_NEW_LINE,
      options: [{prop: 'parens-new-line'}]
    }
  ],

  invalid: [
    {
      code: RETURN_NO_PAREN,
      output: RETURN_PAREN,
      errors: [{message: MISSING_PARENS}]
    }, {
      code: RETURN_NO_PAREN,
      output: RETURN_PAREN,
      options: [{return: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      output: DECLARATION_TERNARY_PAREN,
      errors: [
        {message: MISSING_PARENS},
        {message: MISSING_PARENS}
      ]
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      output: DECLARATION_TERNARY_PAREN,
      options: [{declaration: true}],
      errors: [
        {message: MISSING_PARENS},
        {message: MISSING_PARENS}
      ]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      output: ASSIGNMENT_TERNARY_PAREN,
      errors: [
        {message: MISSING_PARENS},
        {message: MISSING_PARENS}
      ]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      output: ASSIGNMENT_TERNARY_PAREN,
      options: [{assignment: true}],
      errors: [
        {message: MISSING_PARENS},
        {message: MISSING_PARENS}
      ]
    }, {
      code: DECLARATION_NO_PAREN,
      output: DECLARATION_PAREN,
      errors: [{message: MISSING_PARENS}]
    }, {
      code: DECLARATION_NO_PAREN,
      output: DECLARATION_PAREN,
      options: [{declaration: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: ASSIGNMENT_PAREN,
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: ASSIGNMENT_PAREN,
      options: [{assignment: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ARROW_NO_PAREN,
      output: ARROW_PAREN,
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ARROW_NO_PAREN,
      output: ARROW_PAREN,
      options: [{arrow: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: CONDITION_NO_PAREN,
      output: CONDITION_PAREN,
      options: [{condition: 'parens'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: CONDITION_NO_PAREN,
      output: CONDITION_PAREN,
      options: [{condition: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: LOGICAL_NO_PAREN,
      output: LOGICAL_PAREN,
      options: [{logical: 'parens'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: LOGICAL_NO_PAREN,
      output: LOGICAL_PAREN,
      options: [{logical: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ATTR_NO_PAREN,
      output: ATTR_PAREN,
      options: [{prop: 'parens'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ATTR_NO_PAREN,
      output: ATTR_PAREN,
      options: [{prop: true}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: RETURN_NO_PAREN,
      output: addNewLineSymbols(RETURN_PAREN),
      options: [{return: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: RETURN_PAREN,
      output: addNewLineSymbols(RETURN_PAREN),
      options: [{return: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: DECLARATION_TERNARY_NO_PAREN,
      output: addNewLineSymbols(DECLARATION_TERNARY_PAREN),
      options: [{declaration: 'parens-new-line'}],
      errors: [
        {message: MISSING_PARENS},
        {message: MISSING_PARENS}
      ]
    }, {
      code: DECLARATION_TERNARY_PAREN,
      output: addNewLineSymbols(DECLARATION_TERNARY_PAREN),
      options: [{declaration: 'parens-new-line'}],
      errors: [
        {message: PARENS_NEW_LINES},
        {message: PARENS_NEW_LINES}
      ]
    }, {
      code: ASSIGNMENT_TERNARY_NO_PAREN,
      output: addNewLineSymbols(ASSIGNMENT_TERNARY_PAREN),
      options: [{assignment: 'parens-new-line'}],
      errors: [
        {message: MISSING_PARENS},
        {message: MISSING_PARENS}
      ]
    }, {
      code: ASSIGNMENT_TERNARY_PAREN,
      output: addNewLineSymbols(ASSIGNMENT_TERNARY_PAREN),
      options: [{assignment: 'parens-new-line'}],
      errors: [
        {message: PARENS_NEW_LINES},
        {message: PARENS_NEW_LINES}
      ]
    }, {
      code: DECLARATION_NO_PAREN,
      output: addNewLineSymbols(DECLARATION_PAREN),
      options: [{declaration: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: DECLARATION_PAREN,
      output: addNewLineSymbols(DECLARATION_PAREN),
      options: [{declaration: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: ASSIGNMENT_NO_PAREN,
      output: addNewLineSymbols(ASSIGNMENT_PAREN),
      options: [{assignment: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ASSIGNMENT_PAREN,
      output: addNewLineSymbols(ASSIGNMENT_PAREN),
      options: [{assignment: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: ARROW_PAREN,
      output: addNewLineSymbols(ARROW_PAREN),
      options: [{arrow: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: ARROW_NO_PAREN,
      output: addNewLineSymbols(ARROW_PAREN),
      options: [{arrow: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: CONDITION_PAREN,
      output: addNewLineSymbols(CONDITION_PAREN),
      options: [{condition: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: CONDITION_NO_PAREN,
      output: addNewLineSymbols(CONDITION_PAREN),
      options: [{condition: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: LOGICAL_PAREN,
      output: addNewLineSymbols(LOGICAL_PAREN),
      options: [{logical: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: LOGICAL_NO_PAREN,
      output: LOGICAL_PAREN_NEW_LINE_AUTOFIX,
      options: [{logical: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }, {
      code: ATTR_PAREN,
      output: addNewLineSymbols(ATTR_PAREN),
      options: [{prop: 'parens-new-line'}],
      errors: [{message: PARENS_NEW_LINES}]
    }, {
      code: ATTR_NO_PAREN,
      output: ATTR_PAREN_NEW_LINE_AUTOFIX,
      options: [{prop: 'parens-new-line'}],
      errors: [{message: MISSING_PARENS}]
    }]
});
