/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly braces in JSX
 * @author Jacky Ho
 */

'use strict';

/* eslint-disable quotes */ // For better readability on tests involving quotes

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const semver = require('semver');
const eslintPkg = require('eslint/package.json');
const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-curly-brace-presence');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 2015,
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-curly-brace-presence', rule, {
  valid: parsers.all([].concat(
    {
      code: '<App {...props}>foo</App>',
    },
    {
      code: '<>foo</>',
      features: ['fragment'],
    },
    {
      code: '<App {...props}>foo</App>',
      options: [{ props: 'never' }],
    },
    /*
     * There is no way to inject the space into JSX without an expression container
     * so this format should always be allowed regardless of the `children` option.
     */
    {
      code: '<App>{\' \'}</App>',
    },
    {
      code: '<App>{\' \'}\n</App>',
    },
    {
      code: '<App>{\'     \'}</App>',
    },
    {
      code: '<App>{\'     \'}\n</App>',
    },
    {
      code: '<App>{\' \'}</App>',
      options: [{ children: 'never' }],
    },
    {
      code: '<App>{\'    \'}</App>',
      options: [{ children: 'never' }],
    },
    {
      code: '<App>{\' \'}</App>',
      options: [{ children: 'always' }],
    },
    {
      code: '<App>{\'        \'}</App>',
      options: [{ children: 'always' }],
    },
    {
      code: '<App {...props}>foo</App>',
      options: [{ props: 'always' }],
    },
    {
      code: '<App>{`Hello ${word} World`}</App>',
      options: [{ children: 'never' }],
    },
    {
      code: `
        <React.Fragment>
          foo{' '}
          <span>bar</span>
        </React.Fragment>
      `,
      options: [{ children: 'never' }],
    },
    {
      code: `
        <>
          foo{' '}
          <span>bar</span>
        </>
      `,
      features: ['fragment'],
      options: [{ children: 'never' }],
    },
    {
      code: '<App>{`Hello \\n World`}</App>',
      options: [{ children: 'never' }],
    },
    {
      code: '<App>{`Hello ${word} World`}{`foo`}</App>',
      options: [{ children: 'never' }],
    },
    {
      code: '<App prop={`foo ${word} bar`}>foo</App>',
      options: [{ props: 'never' }],
    },
    {
      code: '<App prop={`foo ${word} bar`} />',
      options: [{ props: 'never' }],
    },
    {
      code: '<App>{<myApp></myApp>}</App>',
      options: [{ children: 'always' }],
    },
    {
      code: '<App>{[]}</App>',
    },
    {
      code: '<App>foo</App>',
    },
    {
      code: '<App>{"foo"}{<Component>bar</Component>}</App>',
    },
    {
      code: `<App prop='bar'>foo</App>`,
    },
    {
      code: '<App prop={true}>foo</App>',
    },
    {
      code: '<App prop>foo</App>',
    },
    {
      code: `<App prop='bar'>{'foo \\n bar'}</App>`,
    },
    {
      code: `<App prop={ ' ' }/>`,
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: [{ props: 'never' }],
    },
    {
      code: `<MyComponent prop="bar">foo</MyComponent>`,
      options: [{ props: 'never' }],
    },
    {
      code: '<MyComponent>foo</MyComponent>',
      options: [{ children: 'never' }],
    },
    {
      code: '<MyComponent>{<App/>}{"123"}</MyComponent>',
      options: [{ children: 'never' }],
    },
    {
      code: `<App>{"foo 'bar' \\"foo\\" bar"}</App>`,
      options: [{ children: 'never' }],
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{ props: 'always' }],
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      options: [{ children: 'always' }],
    },
    {
      code: `<MyComponent prop={"bar"}>foo</MyComponent>`,
      options: [{ props: 'always' }],
    },
    {
      code: `<MyComponent>{"foo"}</MyComponent>`,
      options: [{ children: 'always' }],
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      options: [{ children: 'ignore' }],
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{ props: 'ignore' }],
    },
    {
      code: '<MyComponent>foo</MyComponent>',
      options: [{ children: 'ignore' }],
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: [{ props: 'ignore' }],
    },
    {
      code: `<MyComponent prop="bar">foo</MyComponent>`,
      options: [{ props: 'ignore' }],
    },
    {
      code: `<MyComponent prop='bar'>{'foo'}</MyComponent>`,
      options: [{ children: 'always', props: 'never' }],
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{ children: 'never', props: 'always' }],
    },
    {
      code: `<MyComponent prop={'bar'}>{'foo'}</MyComponent>`,
      options: ['always'],
    },
    {
      code: `<MyComponent prop={"bar"}>{"foo"}</MyComponent>`,
      options: ['always'],
    },
    {
      code: `<MyComponent prop={"bar"} attr={'foo'} />`,
      options: ['always'],
    },
    {
      code: `<MyComponent prop="bar" attr='foo' />`,
      options: ['never'],
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: ['never'],
    },
    {
      code: '<MyComponent prop={`bar ${word} foo`}>{`foo ${word}`}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{"div { margin-top: 0; }"}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{"<Foo />"}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent prop={"Hello \\u1026 world"}>bar</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{"Hello \\u1026 world"}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent prop={"Hello &middot; world"}>bar</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{"Hello &middot; world"}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{"Hello \\n world"}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{"space after "}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{" space before"}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{`space after `}</MyComponent>',
      options: ['never'],
    },
    {
      code: '<MyComponent>{` space before`}</MyComponent>',
      options: ['never'],
    },
    {
      code: ['<a a={"start\\', '\\', 'end"}/>'].join('/n'),
      options: ['never'],
    },
    {
      code: `
        <App prop={\`
          a
          b
        \`} />
      `,
      options: ['never'],
    },
    {
      code: `
        <App prop={\`
          a
          b
        \`} />
      `,
      options: ['always'],
    },
    {
      code: `
        <App>
          {\`
            a
            b
          \`}
        </App>
      `,
      options: ['never'],
    },
    {
      code: `
        <App>{\`
          a
          b
        \`}</App>
      `,
      options: ['always'],
    },
    {
      code: `
        <MyComponent>
          %
        </MyComponent>
      `,
      options: [{ children: 'never' }],
    },
    {
      code: `
        <MyComponent>
          { 'space after ' }
          <b>foo</b>
          { ' space before' }
        </MyComponent>
      `,
      options: [{ children: 'never' }],
    },
    {
      code: `
        <MyComponent>
          { \`space after \` }
          <b>foo</b>
          { \` space before\` }
        </MyComponent>
      `,
      options: [{ children: 'never' }],
    },
    {
      code: `
        <MyComponent>
          foo
          <div>bar</div>
        </MyComponent>
      `,
      options: [{ children: 'never' }],
    },
    {
      code: `
        <MyComponent p={<Foo>Bar</Foo>}>
        </MyComponent>
      `,
    },
    {
      code: `
        <MyComponent>
          <div>
            <p>
              <span>
                {"foo"}
              </span>
            </p>
          </div>
        </MyComponent>
      `,
      options: [{ children: 'always' }],
    },
    {
      code: `
        <App>
          <Component />&nbsp;
          &nbsp;
        </App>
      `,
      options: [{ children: 'always' }],
    },
    {
      code: `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `,
      features: ['no-ts-old'], // the old TS parser hangs forever on this one
    },
    {
      code: `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `,
      options: [{ props: 'never', children: 'never' }],
      features: ['no-ts-old'], // the old TS parser hangs forever on this one
    },
    {
      code: `
        import React from "react";

        const Component = () => {
          return <span>{"/*"}</span>;
        };
      `,
      options: [{ props: 'never', children: 'never' }],
      features: ['no-ts-old'], // the old TS parser hangs forever on this one
    },
    {
      code: `<App>{/* comment */}</App>`,
    },
    (semver.satisfies(eslintPkg.version, '> 3') ? [
      {
        code: `<App>{/* comment */ <Foo />}</App>`,
      },
      {
        code: `<App>{/* comment */ 'foo'}</App>`,
      },
      {
        code: `<App prop={/* comment */ 'foo'} />`,
      },
      {
        code: `
          <App>
            {
              // comment
              <Foo />
            }
          </App>
        `,
      },
    ] : []),
    {
      code: `<App horror=<div /> />`,
      features: ['no-ts'],
    },
    {
      code: `<App horror={<div />} />`,
    },
    {
      code: `<App horror=<div /> />`,
      options: [{ propElementValues: 'ignore' }],
      features: ['no-ts'],
    },
    {
      code: `<App horror={<div />} />`,
      options: [{ propElementValues: 'ignore' }],
    },
    {
      code: `
        <script>{\`window.foo = "bar"\`}</script>
      `,
    },
    {
      code: `
        <CollapsibleTitle
          extra={<span className="activity-type">{activity.type}</span>}
        />
      `,
      features: ['no-ts'],
      options: ['never'],
    },
    // legit as this single template literal might be used for stringifying
    {
      code: '<App label={`${label}`} />',
      options: ['never'],
    },
    {
      code: '<App>{`${label}`}</App>',
      options: ['never'],
    }
  )),

  invalid: parsers.all([].concat(
    {
      code: '<App prop={`foo`} />',
      options: [{ props: 'never' }],
      output: '<App prop="foo" />',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<App>{<myApp></myApp>}</App>',
      options: [{ children: 'never' }],
      output: '<App><myApp></myApp></App>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<App>{<myApp></myApp>}</App>',
      output: '<App><myApp></myApp></App>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<App prop={`foo`}>foo</App>',
      options: [{ props: 'never' }],
      output: '<App prop="foo">foo</App>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<App>{`foo`}</App>',
      options: [{ children: 'never' }],
      output: '<App>foo</App>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<>{`foo`}</>',
      options: [{ children: 'never' }],
      features: ['fragment'],
      output: '<>foo</>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      output: '<MyComponent>foo</MyComponent>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      output: `<MyComponent prop="bar">foo</MyComponent>`,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      options: [{ children: 'never' }],
      output: '<MyComponent>foo</MyComponent>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{ props: 'never' }],
      output: '<MyComponent prop="bar">foo</MyComponent>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `
        <MyComponent>
          {'%'}
        </MyComponent>
      `,
      options: [{ children: 'never' }],
      output: `
        <MyComponent>
          %
        </MyComponent>
      `,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `
        <MyComponent>
          {'foo'}
          <div>
            {'bar'}
          </div>
          {'baz'}
        </MyComponent>
      `,
      options: [{ children: 'never' }],
      output: `
        <MyComponent>
          foo
          <div>
            bar
          </div>
          baz
        </MyComponent>
      `,
      errors: [
        { messageId: 'unnecessaryCurly' },
        { messageId: 'unnecessaryCurly' },
        { messageId: 'unnecessaryCurly' },
      ],
    },
    {
      code: `
        <MyComponent>
          {'foo'}
          <div>
            {'bar'}
          </div>
          {'baz'}
          {'some-complicated-exp'}
        </MyComponent>
      `,
      output: `
        <MyComponent>
          foo
          <div>
            bar
          </div>
          {'baz'}
          {'some-complicated-exp'}
        </MyComponent>
      `,
      options: [{ children: 'never' }],
      features: ['no-default', 'no-ts-new', 'no-babel-new'], // TODO: FIXME: remove no-default and no-ts-new and fix
      errors: [
        { messageId: 'unnecessaryCurly', line: 3 },
        { messageId: 'unnecessaryCurly', line: 5 },
      ],
    },
    semver.satisfies(eslintPkg.version, '^7.5.0') ? { // require('@babel/eslint-parser/package.json').peerDependencies.eslint
      // TODO: figure out how to make all other parsers work this well
      code: `
        <MyComponent>
          {'foo'}
          <div>
            {'bar'}
          </div>
          {'baz'}
          {'some-complicated-exp'}
        </MyComponent>
      `,
      options: [{ children: 'never' }],
      parser: parsers['@BABEL_ESLINT'],
      parserOptions: parsers.babelParserOptions({}, new Set()),
      output: `
        <MyComponent>
          foo
          <div>
            bar
          </div>
          baz
          some-complicated-exp
        </MyComponent>
      `,
      errors: [
        { messageId: 'unnecessaryCurly', line: 3 },
        { messageId: 'unnecessaryCurly', line: 5 },
        { messageId: 'unnecessaryCurly', line: 7 },
        { messageId: 'unnecessaryCurly', line: 8 },
      ],
    } : [],
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: [{ props: 'always' }],
      output: '<MyComponent prop={"bar"}>foo</MyComponent>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<MyComponent prop="foo 'bar'">foo</MyComponent>`,
      options: [{ props: 'always' }],
      output: `<MyComponent prop={"foo 'bar'"}>foo</MyComponent>`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<MyComponent prop='foo "bar"'>foo</MyComponent>`,
      options: [{ props: 'always' }],
      output: `<MyComponent prop={"foo \\"bar\\""}>foo</MyComponent>`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<MyComponent>foo bar </MyComponent>',
      options: [{ children: 'always' }],
      output: `<MyComponent>{"foo bar "}</MyComponent>`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<MyComponent prop="foo 'bar' \\n ">foo</MyComponent>`,
      options: [{ props: 'always' }],
      output: `<MyComponent prop={"foo 'bar' \\\\n "}>foo</MyComponent>`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<MyComponent>foo bar \\r </MyComponent>',
      options: [{ children: 'always' }],
      output: '<MyComponent>{"foo bar \\\\r "}</MyComponent>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<MyComponent>foo bar 'foo'</MyComponent>`,
      options: [{ children: 'always' }],
      output: `<MyComponent>{"foo bar 'foo'"}</MyComponent>`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<MyComponent>foo bar "foo"</MyComponent>',
      options: [{ children: 'always' }],
      output: '<MyComponent>{"foo bar \\"foo\\""}</MyComponent>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<MyComponent>foo bar <App/></MyComponent>',
      options: [{ children: 'always' }],
      output: '<MyComponent>{"foo bar "}<App/></MyComponent>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<MyComponent>foo \\n bar</MyComponent>',
      options: [{ children: 'always' }],
      output: '<MyComponent>{"foo \\\\n bar"}</MyComponent>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<MyComponent>foo \\u1234 bar</MyComponent>',
      options: [{ children: 'always' }],
      output: '<MyComponent>{"foo \\\\u1234 bar"}</MyComponent>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<MyComponent prop='foo \\u1234 bar' />`,
      options: [{ props: 'always' }],
      output: '<MyComponent prop={"foo \\\\u1234 bar"} />',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<MyComponent prop={'bar'}>{'foo'}</MyComponent>`,
      options: ['never'],
      output: '<MyComponent prop="bar">foo</MyComponent>',
      errors: [
        { messageId: 'unnecessaryCurly' },
        { messageId: 'unnecessaryCurly' },
      ],
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: ['always'],
      output: '<MyComponent prop={"bar"}>{"foo"}</MyComponent>',
      errors: [
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
      ],
    },
    {
      code: `<App prop={'foo'} attr={" foo "} />`,
      options: [{ props: 'never' }],
      output: '<App prop="foo" attr=" foo " />',
      errors: [
        { messageId: 'unnecessaryCurly' },
        { messageId: 'unnecessaryCurly' },
      ],
    },
    {
      code: `<App prop='foo' attr="bar" />`,
      options: [{ props: 'always' }],
      output: '<App prop={"foo"} attr={"bar"} />',
      errors: [
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
      ],
    },
    {
      code: `<App prop='foo' attr={"bar"} />`,
      options: [{ props: 'always' }],
      output: `<App prop={"foo"} attr={"bar"} />`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<App prop={'foo'} attr='bar' />`,
      options: [{ props: 'always' }],
      output: `<App prop={'foo'} attr={"bar"} />`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<App prop='foo &middot; bar' />`,
      options: [{ props: 'always' }],
      output: `<App prop={"foo &middot; bar"} />`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: '<App>foo &middot; bar</App>',
      options: [{ children: 'always' }],
      output: '<App>{"foo &middot; bar"}</App>',
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<App>{'foo "bar"'}</App>`,
      options: [{ children: 'never' }],
      output: `<App>foo "bar"</App>`,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<App>{"foo 'bar'"}</App>`,
      options: [{ children: 'never' }],
      output: `<App>foo 'bar'</App>`,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `
        <App prop="${'    '}
           a${'     '}
             b      c
                d
        ">
          a
              b     c${'   '}
                 d${'      '}
        </App>
      `,
      options: ['always'],
      output: `
        <App prop="${'    '}
           a${'     '}
             b      c
                d
        ">
          {"a"}
              {"b     c   "}
                 {"d      "}
        </App>
      `,
      errors: [
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
      ],
    },
    {
      code: `
        <App prop='${'    '}
           a${'     '}
             b      c
                d
        '>
          a
              b     c${'   '}
                 d${'      '}
        </App>
      `,
      options: ['always'],
      output: `
        <App prop='${'    '}
           a${'     '}
             b      c
                d
        '>
          {"a"}
              {"b     c   "}
                 {"d      "}
        </App>
      `,
      errors: [
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
      ],
    },
    {
      code: `
        <App>
          foo bar
          <div>foo bar foo</div>
          <span>
            foo bar <i>foo bar</i>
            <strong>
              foo bar
            </strong>
          </span>
        </App>
      `,
      options: [{ children: 'always' }],
      output: `
        <App>
          {"foo bar"}
          <div>{"foo bar foo"}</div>
          <span>
            {"foo bar "}<i>{"foo bar"}</i>
            <strong>
              {"foo bar"}
            </strong>
          </span>
        </App>
      `,
      errors: [
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
        { messageId: 'missingCurly' },
      ],
    },
    {
      code: `
        <App>
          &lt;Component&gt;
          &nbsp;<Component />&nbsp;
          &nbsp;
        </App>
      `,
      options: [{ children: 'always' }],
      output: `
        <App>
          &lt;{"Component"}&gt;
          &nbsp;<Component />&nbsp;
          &nbsp;
        </App>
      `,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `
        <Box mb={'1rem'} />
      `,
      options: [{ props: 'never' }],
      output: `
        <Box mb="1rem" />
      `,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `
        <Box mb={'1rem {}'} />
      `,
      options: ['never'],
      output: `
        <Box mb="1rem {}" />
      `,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<MyComponent prop={"{ style: true }"}>bar</MyComponent>',
      options: ['never'],
      output: '<MyComponent prop="{ style: true }">bar</MyComponent>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: '<MyComponent prop={"< style: true >"}>foo</MyComponent>',
      options: ['never'],
      output: '<MyComponent prop="< style: true >">foo</MyComponent>',
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<App horror=<div /> />`,
      options: [{ props: 'always', children: 'always', propElementValues: 'always' }],
      features: ['no-ts'],
      output: `<App horror={<div />} />`,
      errors: [{ messageId: 'missingCurly' }],
    },
    {
      code: `<App horror={<div />} />`,
      options: [{ props: 'never', children: 'never', propElementValues: 'never' }],
      features: ['no-ts'],
      output: `<App horror=<div /> />`,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
    {
      code: `<Foo bar={"'"} />`,
      options: [{ props: 'never', children: 'never', propElementValues: 'never' }],
      output: `<Foo bar="'" />`,
      errors: [{ messageId: 'unnecessaryCurly' }],
    },
  )),
});
