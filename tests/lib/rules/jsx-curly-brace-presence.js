/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly braces in JSX
 * @author Jacky Ho
 */

'use strict';

/* eslint-disable quotes */ // For better readability on tests involving quotes

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-curly-brace-presence');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 2015,
  ecmaFeatures: {
    jsx: true
  }
};

const missingCurlyMessage = 'Need to wrap this literal in a JSX expression.';
const unnecessaryCurlyMessage = 'Curly braces are unnecessary here.';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-curly-brace-presence', rule, {
  valid: [
    {
      code: '<App {...props}>foo</App>'
    },
    {
      code: '<>foo</>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<App {...props}>foo</App>',
      options: [{props: 'never'}]
    },
    /*
     * There is no way to inject the space into JSX without an expression container
     * so this format should always be allowed regardless of the `children` option.
     */
    {
      code: '<App>{\' \'}</App>'
    },
    {
      code: '<App>{\' \'}\n</App>'
    },
    {
      code: '<App>{\'     \'}</App>'
    },
    {
      code: '<App>{\'     \'}\n</App>'
    },
    {
      code: '<App>{\' \'}</App>',
      options: [{children: 'never'}]
    },
    {
      code: '<App>{\'    \'}</App>',
      options: [{children: 'never'}]
    },
    {
      code: '<App>{\' \'}</App>',
      options: [{children: 'always'}]
    },
    {
      code: '<App>{\'        \'}</App>',
      options: [{children: 'always'}]
    },
    {
      code: '<App {...props}>foo</App>',
      options: [{props: 'always'}]
    },
    {
      code: '<App>{`Hello ${word} World`}</App>',
      options: [{children: 'never'}]
    },
    {
      code: `
      <React.Fragment>
        foo{' '}
        <span>bar</span>
      </React.Fragment>
    `,
      options: [{children: 'never'}]
    },
    {
      code: `
      <>
        foo{' '}
        <span>bar</span>
      </>
    `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}]
    },
    {
      code: '<App>{`Hello \\n World`}</App>',
      options: [{children: 'never'}]
    },
    {
      code: '<App>{`Hello ${word} World`}{`foo`}</App>',
      options: [{children: 'never'}]
    },
    {
      code: '<App prop={`foo ${word} bar`}>foo</App>',
      options: [{props: 'never'}]
    },
    {
      code: '<App prop={`foo ${word} bar`} />',
      options: [{props: 'never'}]
    },
    {
      code: '<App>{<myApp></myApp>}</App>',
      options: [{children: 'always'}]
    },
    {
      code: '<App>{[]}</App>'
    },
    {
      code: '<App>foo</App>'
    },
    {
      code: '<App>{"foo"}{<Component>bar</Component>}</App>'
    },
    {
      code: `<App prop='bar'>foo</App>`
    },
    {
      code: '<App prop={true}>foo</App>'
    },
    {
      code: '<App prop>foo</App>'
    },
    {
      code: `<App prop='bar'>{'foo \\n bar'}</App>`
    },
    {
      code: `<App prop={ ' ' }/>`
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: [{props: 'never'}]
    },
    {
      code: `<MyComponent prop="bar">foo</MyComponent>`,
      options: [{props: 'never'}]
    },
    {
      code: '<MyComponent>foo</MyComponent>',
      options: [{children: 'never'}]
    },
    {
      code: '<MyComponent>{<App/>}{"123"}</MyComponent>',
      options: [{children: 'never'}]
    },
    {
      code: `<App>{"foo 'bar' \\"foo\\" bar"}</App>`,
      options: [{children: 'never'}]
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{props: 'always'}]
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      options: [{children: 'always'}]
    },
    {
      code: `<MyComponent prop={"bar"}>foo</MyComponent>`,
      options: [{props: 'always'}]
    },
    {
      code: `<MyComponent>{"foo"}</MyComponent>`,
      options: [{children: 'always'}]
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      options: [{children: 'ignore'}]
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{props: 'ignore'}]
    },
    {
      code: '<MyComponent>foo</MyComponent>',
      options: [{children: 'ignore'}]
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: [{props: 'ignore'}]
    },
    {
      code: `<MyComponent prop="bar">foo</MyComponent>`,
      options: [{props: 'ignore'}]
    },
    {
      code: `<MyComponent prop='bar'>{'foo'}</MyComponent>`,
      options: [{children: 'always', props: 'never'}]
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      options: [{children: 'never', props: 'always'}]
    },
    {
      code: `<MyComponent prop={'bar'}>{'foo'}</MyComponent>`,
      options: ['always']
    },
    {
      code: `<MyComponent prop={"bar"}>{"foo"}</MyComponent>`,
      options: ['always']
    },
    {
      code: `<MyComponent prop={"bar"} attr={'foo'} />`,
      options: ['always']
    },
    {
      code: `<MyComponent prop="bar" attr='foo' />`,
      options: ['never']
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      options: ['never']
    },
    {
      code: '<MyComponent prop={`bar ${word} foo`}>{`foo ${word}`}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{"div { margin-top: 0; }"}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{"<Foo />"}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent prop={"{ style: true }"}>bar</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent prop={"< style: true >"}>foo</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent prop={"Hello \\u1026 world"}>bar</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{"Hello \\u1026 world"}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent prop={"Hello &middot; world"}>bar</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{"Hello &middot; world"}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{"Hello \\n world"}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{"space after "}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{" space before"}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{`space after `}</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent>{` space before`}</MyComponent>',
      options: ['never']
    },
    {
      code: ['<a a={"start\\', '\\', 'end"}/>'].join('/n'),
      options: ['never']
    },
    {
      code: `
        <App prop={\`
          a
          b
        \`} />
      `,
      options: ['never']
    },
    {
      code: `
        <App prop={\`
          a
          b
        \`} />
      `,
      options: ['always']
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
      options: ['never']
    },
    {
      code: `
        <App>{\`
          a
          b
        \`}</App>
      `,
      options: ['always']
    },
    {
      code: `
        <MyComponent>
          %
        </MyComponent>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}]
    },
    {
      code: `
        <MyComponent>
          { 'space after ' }
          <b>foo</b>
          { ' space before' }
        </MyComponent>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}]
    },
    {
      code: `
        <MyComponent>
          { \`space after \` }
          <b>foo</b>
          { \` space before\` }
        </MyComponent>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}]
    },
    {
      code: `
        <MyComponent>
          foo
          <div>bar</div>
        </MyComponent>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}]
    },
    {
      code: `
        <MyComponent p={<Foo>Bar</Foo>}>
        </MyComponent>
      `
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
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'always'}]
    },
    {
      code: `
        <App>
          <Component />&nbsp;
          &nbsp;
        </App>
      `,
      options: [{children: 'always'}]
    }
  ],

  invalid: [
    {
      code: '<App prop={`foo`} />',
      output: '<App prop="foo" />',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App>{<myApp></myApp>}</App>',
      output: '<App><myApp></myApp></App>',
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App>{<myApp></myApp>}</App>',
      output: '<App><myApp></myApp></App>',
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App prop={`foo`}>foo</App>',
      output: '<App prop="foo">foo</App>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App>{`foo`}</App>',
      output: '<App>foo</App>',
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<>{`foo`}</>',
      output: '<>foo</>',
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      output: '<MyComponent>foo</MyComponent>',
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      output: `<MyComponent prop="bar">foo</MyComponent>`,
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: `<MyComponent>{'foo'}</MyComponent>`,
      output: '<MyComponent>foo</MyComponent>',
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: `<MyComponent prop={'bar'}>foo</MyComponent>`,
      output: '<MyComponent prop="bar">foo</MyComponent>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: `
        <MyComponent>
          {'%'}
        </MyComponent>
      `,
      output: `
        <MyComponent>
          %
        </MyComponent>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
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
      output: `
        <MyComponent>
          foo
          <div>
            bar
          </div>
          baz
        </MyComponent>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}],
      errors: [
        {message: unnecessaryCurlyMessage},
        {message: unnecessaryCurlyMessage},
        {message: unnecessaryCurlyMessage}
      ]
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
      parser: parsers.BABEL_ESLINT,
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}, {message: unnecessaryCurlyMessage}]
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      output: '<MyComponent prop={"bar"}>foo</MyComponent>',
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent prop="foo 'bar'">foo</MyComponent>`,
      output: `<MyComponent prop={"foo 'bar'"}>foo</MyComponent>`,
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent prop='foo "bar"'>foo</MyComponent>`,
      output: `<MyComponent prop={"foo \\"bar\\""}>foo</MyComponent>`,
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent prop="foo 'bar'">foo</MyComponent>`,
      output: `<MyComponent prop={"foo 'bar'"}>foo</MyComponent>`,
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<MyComponent>foo bar </MyComponent>',
      output: `<MyComponent>{"foo bar "}</MyComponent>`,
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent prop="foo 'bar' \\n ">foo</MyComponent>`,
      output: `<MyComponent prop={"foo 'bar' \\\\n "}>foo</MyComponent>`,
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo bar \\r </MyComponent>',
      output: '<MyComponent>{"foo bar \\\\r "}</MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent>foo bar 'foo'</MyComponent>`,
      output: `<MyComponent>{"foo bar 'foo'"}</MyComponent>`,
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo bar "foo"</MyComponent>',
      output: '<MyComponent>{"foo bar \\"foo\\""}</MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo bar <App/></MyComponent>',
      output: '<MyComponent>{"foo bar "}<App/></MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo \\n bar</MyComponent>',
      output: '<MyComponent>{"foo \\\\n bar"}</MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo \\u1234 bar</MyComponent>',
      output: '<MyComponent>{"foo \\\\u1234 bar"}</MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent prop='foo \\u1234 bar' />`,
      output: '<MyComponent prop={"foo \\\\u1234 bar"} />',
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: `<MyComponent prop={'bar'}>{'foo'}</MyComponent>`,
      output: '<MyComponent prop="bar">foo</MyComponent>',
      options: ['never'],
      errors: [
        {message: unnecessaryCurlyMessage}, {message: unnecessaryCurlyMessage}
      ]
    },
    {
      code: `<MyComponent prop='bar'>foo</MyComponent>`,
      output: '<MyComponent prop={"bar"}>{"foo"}</MyComponent>',
      options: ['always'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: `<App prop={'foo'} attr={" foo "} />`,
      output: '<App prop="foo" attr=" foo " />',
      errors: [
        {message: unnecessaryCurlyMessage}, {message: unnecessaryCurlyMessage}
      ],
      options: [{props: 'never'}]
    },
    {
      code: `<App prop='foo' attr="bar" />`,
      output: '<App prop={"foo"} attr={"bar"} />',
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ],
      options: [{props: 'always'}]
    },
    {
      code: `<App prop='foo' attr={"bar"} />`,
      output: `<App prop={"foo"} attr={"bar"} />`,
      errors: [{message: missingCurlyMessage}],
      options: [{props: 'always'}]
    },
    {
      code: `<App prop={'foo'} attr='bar' />`,
      output: `<App prop={'foo'} attr={"bar"} />`,
      errors: [{message: missingCurlyMessage}],
      options: [{props: 'always'}]
    },
    {
      code: `<App prop='foo &middot; bar' />`,
      errors: [{message: missingCurlyMessage}],
      options: [{props: 'always'}]
    },
    {
      code: '<App>foo &middot; bar</App>',
      errors: [{message: missingCurlyMessage}],
      options: [{children: 'always'}]
    },
    {
      code: `<App>{'foo "bar"'}</App>`,
      output: `<App>foo "bar"</App>`,
      errors: [{message: unnecessaryCurlyMessage}],
      options: [{children: 'never'}]
    },
    {
      code: `<App>{"foo 'bar'"}</App>`,
      output: `<App>foo 'bar'</App>`,
      errors: [{message: unnecessaryCurlyMessage}],
      options: [{children: 'never'}]
    },
    {
      code: [
        '<App prop="    ',
        '   a     ',
        '     b      c',
        '        d',
        '">',
        '  a',
        '      b     c   ',
        '         d      ',
        '</App>'
      ].join('\n'),
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ],
      options: ['always']
    },
    {
      code: [
        `<App prop='    `,
        '   a     ',
        '     b      c',
        '        d',
        `'>`,
        '  a',
        '      b     c   ',
        '         d      ',
        '</App>'
      ].join('\n'),
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ],
      options: ['always']
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
        {message: missingCurlyMessage},
        {message: missingCurlyMessage},
        {message: missingCurlyMessage},
        {message: missingCurlyMessage},
        {message: missingCurlyMessage}
      ],
      options: [{children: 'always'}]
    },
    {
      code: `
        <App>
          &lt;Component&gt;
          &nbsp;<Component />&nbsp;
          &nbsp;
        </App>
      `,
      output: `
        <App>
          &lt;{"Component"}&gt;
          &nbsp;<Component />&nbsp;
          &nbsp;
        </App>
      `,
      errors: [
        {message: missingCurlyMessage}
      ],
      options: [{children: 'always'}]
    }
  ]
});
