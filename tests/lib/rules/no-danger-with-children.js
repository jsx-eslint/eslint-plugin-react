/**
 * @fileoverview Report when a DOM element is using both children and dangerouslySetInnerHTML
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-danger-with-children');
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
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-danger-with-children', rule, {
  valid: [
    {
      code: '<div>Children</div>'
    },
    {
      code: '<div {...props} />',
      globals: {
        props: true
      }
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} />'
    },
    {
      code: '<div children="Children" />'
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const moreProps = { className: "eslint" };',
        'const props = { children: "Children", ...moreProps };',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const otherProps = { children: "Children" };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: '<Hello>Children</Hello>'
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />'
    },
    {
      code: 'React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });'
    },
    {
      code: 'React.createElement("div", {}, "Children");'
    },
    {
      code: 'React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });'
    },
    {
      code: 'React.createElement("Hello", {}, "Children");'
    }
  ],
  invalid: [
    {
      code: [
        '<div dangerouslySetInnerHTML={{ __html: "HTML" }}>',
        '  Children',
        '</div>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props}>Children</div>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };',
        '<div {...props} />'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>',
        '  Children',
        '</Hello>'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'React.createElement(',
        '  "div",',
        '  { dangerouslySetInnerHTML: { __html: "HTML" } },',
        '  "Children"',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
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
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'React.createElement(',
        '  "Hello",',
        '  { dangerouslySetInnerHTML: { __html: "HTML" } },',
        '  "Children"',
        ');'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
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
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { dangerouslySetInnerHTML: { __html: "HTML" } };',
        'React.createElement("div", props, "Children");'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };',
        'React.createElement("div", props);'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    },
    {
      code: [
        'const moreProps = { children: "Children" };',
        'const otherProps = { ...moreProps };',
        'const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };',
        'React.createElement("div", props);'
      ].join('\n'),
      errors: [{message: 'Only set one of `children` or `props.dangerouslySetInnerHTML`'}]
    }
  ]
});
