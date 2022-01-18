/**
 * @fileoverview Report when a DOM element is using both children and dangerouslySetInnerHTML
 * @author David Petersen
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-danger-with-children');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-danger-with-children', rule, {
  valid: parsers.all([
    {
      code: '<div>Children</div>',
    },
    {
      code: '<div {...props} />',
      globals: {
        props: true,
      },
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} />',
    },
    {
      code: '<div children="Children" />',
    },
    {
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `,
    },
    {
      code: `
        const moreProps = { className: "eslint" };
        const props = { children: "Children", ...moreProps };
        <div {...props} />
      `,
    },
    {
      code: `
        const otherProps = { children: "Children" };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `,
    },
    {
      code: '<Hello>Children</Hello>',
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />',
    },
    {
      code: `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
        </Hello>
      `,
    },
    {
      code: 'React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });',
    },
    {
      code: 'React.createElement("div", {}, "Children");',
    },
    {
      code: 'React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });',
    },
    {
      code: 'React.createElement("Hello", {}, "Children");',
    },
    {
      code: '<Hello {...undefined}>Children</Hello>',
    },
    {
      code: 'React.createElement("Hello", undefined, "Children")',
    },
    {
      code: `
        const props = {...props, scratch: {mode: 'edit'}};
        const component = shallow(<TaskEditableTitle {...props} />);
      `,
    },
  ]),
  invalid: parsers.all([
    {
      code: `
        <div dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </div>
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props}>Children</div>
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </Hello>
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />',
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: '<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}> </Hello>',
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        React.createElement(
          "div",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        React.createElement(
          "div",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        React.createElement(
          "Hello",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        React.createElement(
          "Hello",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props, "Children");
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
    {
      code: `
        const moreProps = { children: "Children" };
        const otherProps = { ...moreProps };
        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `,
      errors: [{ messageId: 'dangerWithChildren' }],
    },
  ]),
});
