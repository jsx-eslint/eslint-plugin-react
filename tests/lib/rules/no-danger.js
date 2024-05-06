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
  ]),
});
