/**
 * @fileoverview Tests for no-children-prop
 * @author Benjamin Stepp
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-children-prop');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var JSX_ERROR = 'Do not pass children as props. Instead, nest children between the opening and closing tags.';
var CREATE_ELEMENT_ERROR = 'Do not pass children as props. Instead, pass them as additional arguments to React.createElement.';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-children-prop', rule, {
  valid: [
    {
      code: '<div />;',
      parserOptions: parserOptions
    },
    {
      code: '<div></div>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {});',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", undefined);',
      parserOptions: parserOptions
    },
    {
      code: '<div className="class-name"></div>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {className: "class-name"});',
      parserOptions: parserOptions
    },
    {
      code: '<div>Children</div>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", "Children");',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {}, "Children");',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", undefined, "Children");',
      parserOptions: parserOptions
    },
    {
      code: '<div className="class-name">Children</div>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {className: "class-name"}, "Children");',
      parserOptions: parserOptions
    },
    {
      code: '<div><div /></div>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", React.createElement("div"));',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {}, React.createElement("div"));',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", undefined, React.createElement("div"));',
      parserOptions: parserOptions
    },
    {
      code: '<div><div /><div /></div>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", React.createElement("div"), React.createElement("div"));',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {}, React.createElement("div"), React.createElement("div"));',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", undefined, React.createElement("div"), React.createElement("div"));',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", [React.createElement("div"), React.createElement("div")]);',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {}, [React.createElement("div"), React.createElement("div")]);',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", undefined, [React.createElement("div"), React.createElement("div")]);',
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent />',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent);',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {});',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, undefined);',
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent>Children</MyComponent>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, "Children");',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {}, "Children");',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, undefined, "Children");',
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent className="class-name"></MyComponent>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {className: "class-name"});',
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent className="class-name">Children</MyComponent>;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {className: "class-name"}, "Children");',
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent className="class-name" {...props} />;',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {className: "class-name", ...props});',
      parserOptions: parserOptions
    }
  ],
  invalid: [
    {
      code: '<div children="Children" />;',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: '<div children={<div />} />;',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: '<div children={[<div />, <div />]} />;',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: '<div children="Children">Children</div>;',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {children: "Children"});',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {children: "Children"}, "Children");',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {children: React.createElement("div")});',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {children: [React.createElement("div"), React.createElement("div")]});',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent children="Children" />',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {children: "Children"});',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent className="class-name" children="Children" />;',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {children: "Children", className: "class-name"});',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: '<MyComponent {...props} children="Children" />;',
      errors: [{message: JSX_ERROR}],
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement(MyComponent, {...props, children: "Children"})',
      errors: [{message: CREATE_ELEMENT_ERROR}],
      parserOptions: parserOptions
    }
  ]
});
