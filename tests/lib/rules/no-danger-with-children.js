/**
 * @fileoverview Report when a DOM element is using both children and dangerouslySetInnerHTML
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-danger-with-children');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-danger-with-children', rule, {
  valid: [
    {
      code: '<div>Children</div>',
      parserOptions: parserOptions
    },
    {
      code: '<div {...props} />',
      parserOptions: parserOptions,
      globals: {
        props: true
      }
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} />',
      parserOptions: parserOptions
    },
    {
      code: '<div children="Children" />',
      parserOptions: parserOptions
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props} />'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'const moreProps = { className: "eslint" };',
        'const props = { children: "Children", ...moreProps };',
        '<div {...props} />'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'const otherProps = { children: "Children" };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: '<Hello>Children</Hello>',
      parserOptions: parserOptions
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("div", {}, "Children");',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });',
      parserOptions: parserOptions
    },
    {
      code: 'React.createElement("Hello", {}, "Children");',
      parserOptions: parserOptions
    }
  ],
  invalid: [
    {
      code: [
        '<div dangerouslySetInnerHTML={{ __html: "HTML" }}>',
        '  Children',
        '</div>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props}>Children</div>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props} />'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>',
        '  Children',
        '</Hello>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'React.createElement(',
        '  "div",',
        '  { dangerouslySetInnerHTML: { __html: "HTML" } },',
        '  "Children"',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'React.createElement(',
        '  "div",',
        '  {',
        '    dangerouslySetInnerHTML: { __html: "HTML" },',
        '    children: "Children",',
        '  }',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'React.createElement(',
        '  "Hello",',
        '  { dangerouslySetInnerHTML: { __html: "HTML" } },',
        '  "Children"',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'React.createElement(',
        '  "Hello",',
        '  {',
        '    dangerouslySetInnerHTML: { __html: "HTML" },',
        '    children: "Children",',
        '  }',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        'React.createElement("div", props, "Children");'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };',
        'React.createElement("div", props);'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    },
    {
      code: [
        'const moreProps = { children: "Children" };',
        'const otherProps = { ...moreProps };',
        'const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };',
        'React.createElement("div", props);'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}],
      parserOptions: parserOptions
    }
  ]
});
