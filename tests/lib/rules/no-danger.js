/**
 * @fileoverview Tests for no-danger
 * @author Scott Andrews
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-danger');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-danger', rule, {
  valid: parsers.all([
    { code: 'React.createElement();' },
    { code: 'React.createElement("div");' },
    { code: 'React.createElement("div", null);' },
    { code: 'React.createElement("div", props);' },
    { code: 'React.createElement("div", { className: "hello" });' },
    { code: 'React.createElement(App, { dangerouslySetInnerHTML: { __html: "hello" } });' },
    { code: 'Other.createElement("div", { dangerouslySetInnerHTML: { __html: "hello" } });' },
    { code: 'createElement("div", { dangerouslySetInnerHTML: { __html: "hello" } });' },
    { code: 'React.createElement("div", { [dangerouslySetInnerHTML]: { __html: "hello" } });' },
    { code: 'React.createElement("div", { ...props });' },
    {
      code: 'React.createElement(Title, { dangerouslySetInnerHTML: { __html: "hello" } });',
      options: [{ customComponentNames: ['Home'] }],
    },
    { code: '<App />;' },
    { code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;' },
    { code: '<div className="bar"></div>;' },
    {
      code: '<div className="bar"></div>;',
      options: [{ customComponentNames: ['*'] }],
    },
    {
      code: `
        function App() {
          return <Title dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['Home'] }],
    },
    {
      code: `
        function App() {
          return <TextMUI dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['MUI*'] }],
    },
  ]),
  invalid: parsers.all([
    {
      code: 'React.createElement("div", { dangerouslySetInnerHTML: { __html: "hello" } });',
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'React.createElement("div", { "dangerouslySetInnerHTML": { __html: "hello" } });',
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'React.createElement("div", { ["dangerouslySetInnerHTML"]: { __html: "hello" } });',
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'import { createElement } from "react"; createElement("div", { dangerouslySetInnerHTML: { __html: "hello" } });',
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'const { createElement } = require("react"); createElement("div", { dangerouslySetInnerHTML: { __html: "hello" } });',
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'Preact.createElement("div", { dangerouslySetInnerHTML: { __html: "hello" } });',
      settings: { react: { pragma: 'Preact' } },
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'React.createElement(App, { dangerouslySetInnerHTML: { __html: "hello" } });',
      options: [{ customComponentNames: ['*'] }],
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'React.createElement(Title, { dangerouslySetInnerHTML: { __html: "hello" } });',
      options: [{ customComponentNames: ['Title'] }],
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'React.createElement(UI.Title, { dangerouslySetInnerHTML: { __html: "hello" } });',
      options: [{ customComponentNames: ['UI.*'] }],
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: 'React.createElement(UI /* comment */ . Title, { dangerouslySetInnerHTML: { __html: "hello" } });',
      options: [{ customComponentNames: ['UI.Title'] }],
      errors: [{ messageId: 'dangerousProp', data: { name: 'dangerouslySetInnerHTML' } }],
    },
    {
      code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: '<App dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;',
      options: [{ customComponentNames: ['*'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <Title dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['Title'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <TextFoo dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['*Foo'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <FooText dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['Foo*'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        function App() {
          return <TextMUI dangerouslySetInnerHTML={{ __html: "<span>hello</span>" }} />;
        }
      `,
      options: [{ customComponentNames: ['*MUI'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
        },
      ],
    },
    {
      code: `
        import type { ComponentProps } from "react";

        const Comp = "div";
        const Component = () => <></>;

        const NestedComponent = (_props: ComponentProps<"div">) => <></>;

        Component.NestedComponent = NestedComponent;

        function App() {
          return (
            <>
              <div dangerouslySetInnerHTML={{ __html: "<div>aaa</div>" }} />
              <Comp dangerouslySetInnerHTML={{ __html: "<div>aaa</div>" }} />

              <Component.NestedComponent
                dangerouslySetInnerHTML={{ __html: '<div>aaa</div>' }}
              />
            </>
          );
        }
      `,
      features: ['fragment', 'types'],
      options: [{ customComponentNames: ['*'] }],
      errors: [
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
          line: 14,
        },
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
          line: 15,
        },
        {
          messageId: 'dangerousProp',
          data: { name: 'dangerouslySetInnerHTML' },
          line: 18,
        },
      ],
    },
  ]),
});
