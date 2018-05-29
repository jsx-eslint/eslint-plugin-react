/**
 * @fileoverview Tests for no-children-prop
 * @author Benjamin Stepp
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-children-prop');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const JSX_ERROR = 'Do not pass children as props. Instead, nest children between the opening and closing tags.';
const CREATE_ELEMENT_ERROR = 'Do not pass children as props. Instead, pass them as additional arguments to React.createElement.';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-children-prop', rule, {
  valid: [
    {
      code: '<div />;'
    },
    {
      code: '<div></div>;'
    },
    {
      code: 'React.createElement("div", {});'
    },
    {
      code: 'React.createElement("div", undefined);'
    },
    {
      code: '<div className="class-name"></div>;'
    },
    {
      code: 'React.createElement("div", {className: "class-name"});'
    },
    {
      code: '<div>Children</div>;'
    },
    {
      code: 'React.createElement("div", "Children");'
    },
    {
      code: 'React.createElement("div", {}, "Children");'
    },
    {
      code: 'React.createElement("div", undefined, "Children");'
    },
    {
      code: '<div className="class-name">Children</div>;'
    },
    {
      code: 'React.createElement("div", {className: "class-name"}, "Children");'
    },
    {
      code: '<div><div /></div>;'
    },
    {
      code: 'React.createElement("div", React.createElement("div"));'
    },
    {
      code: 'React.createElement("div", {}, React.createElement("div"));'
    },
    {
      code: 'React.createElement("div", undefined, React.createElement("div"));'
    },
    {
      code: '<div><div /><div /></div>;'
    },
    {
      code: 'React.createElement("div", React.createElement("div"), React.createElement("div"));'
    },
    {
      code: 'React.createElement("div", {}, React.createElement("div"), React.createElement("div"));'
    },
    {
      code: 'React.createElement("div", undefined, React.createElement("div"), React.createElement("div"));'
    },
    {
      code: 'React.createElement("div", [React.createElement("div"), React.createElement("div")]);'
    },
    {
      code: 'React.createElement("div", {}, [React.createElement("div"), React.createElement("div")]);'
    },
    {
      code: 'React.createElement("div", undefined, [React.createElement("div"), React.createElement("div")]);'
    },
    {
      code: '<MyComponent />'
    },
    {
      code: 'React.createElement(MyComponent);'
    },
    {
      code: 'React.createElement(MyComponent, {});'
    },
    {
      code: 'React.createElement(MyComponent, undefined);'
    },
    {
      code: '<MyComponent>Children</MyComponent>;'
    },
    {
      code: 'React.createElement(MyComponent, "Children");'
    },
    {
      code: 'React.createElement(MyComponent, {}, "Children");'
    },
    {
      code: 'React.createElement(MyComponent, undefined, "Children");'
    },
    {
      code: '<MyComponent className="class-name"></MyComponent>;'
    },
    {
      code: 'React.createElement(MyComponent, {className: "class-name"});'
    },
    {
      code: '<MyComponent className="class-name">Children</MyComponent>;'
    },
    {
      code: 'React.createElement(MyComponent, {className: "class-name"}, "Children");'
    },
    {
      code: '<MyComponent className="class-name" {...props} />;'
    },
    {
      code: 'React.createElement(MyComponent, {className: "class-name", ...props});'
    }
  ],
  invalid: [
    {
      code: '<div children="Children" />;',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: '<div children={<div />} />;',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: '<div children={[<div />, <div />]} />;',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: '<div children="Children">Children</div>;',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: 'React.createElement("div", {children: "Children"});',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    },
    {
      code: 'React.createElement("div", {children: "Children"}, "Children");',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    },
    {
      code: 'React.createElement("div", {children: React.createElement("div")});',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    },
    {
      code: 'React.createElement("div", {children: [React.createElement("div"), React.createElement("div")]});',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    },
    {
      code: '<MyComponent children="Children" />',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: 'React.createElement(MyComponent, {children: "Children"});',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    },
    {
      code: '<MyComponent className="class-name" children="Children" />;',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: 'React.createElement(MyComponent, {children: "Children", className: "class-name"});',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    },
    {
      code: '<MyComponent {...props} children="Children" />;',
      errors: [{message: JSX_ERROR}]
    },
    {
      code: 'React.createElement(MyComponent, {...props, children: "Children"})',
      errors: [{message: CREATE_ELEMENT_ERROR}]
    }
  ]
});
