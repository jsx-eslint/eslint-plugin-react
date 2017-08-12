/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly braces in JSX
 * @author Jacky Ho
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-curly-brace-presence');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
  sourceType: 'module',
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
      code: '<App {...props}>foo</App>',
      options: [{props: 'never'}]
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
      code: '<App>{<myApp></myApp>}</App>'
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
      code: '<App prop=\'bar\'>foo</App>'
    },
    {
      code: '<App prop={true}>foo</App>'
    },
    {
      code: '<App prop>foo</App>'
    },
    {
      code: '<App prop=\'bar\'>{\'foo \\n bar\'}</App>'
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      options: [{props: 'never'}]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
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
      code: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      options: [{props: 'always'}]
    },
    {
      code: '<MyComponent>{\'foo\'}</MyComponent>',
      options: [{children: 'always'}]
    },
    {
      code: '<MyComponent>{\'foo\'}</MyComponent>',
      options: [{children: 'ignore'}]
    },
    {
      code: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      options: [{props: 'ignore'}]
    },
    {
      code: '<MyComponent>foo</MyComponent>',
      options: [{children: 'ignore'}]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      options: [{props: 'ignore'}]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
      options: [{props: 'ignore'}]
    },
    {
      code: '<MyComponent prop=\'bar\'>{\'foo\'}</MyComponent>',
      options: [{children: 'always', props: 'never'}]
    },
    {
      code: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      options: [{children: 'never', props: 'always'}]
    },
    {
      code: '<MyComponent prop={\'bar\'}>{\'foo\'}</MyComponent>',
      options: ['always']
    },
    {
      code: '<MyComponent prop={\"bar\"}>{\"foo\"}</MyComponent>',
      options: ['always']
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      options: ['never']
    },
    {
      code: '<MyComponent prop={`bar ${word} foo`}>{`foo ${word}`}</MyComponent>',
      options: ['never']
    }
  ],

  invalid: [
    {
      code: '<App prop={\'foo \\u00b7 bar\'}>foo</App>',
      output: '<App prop=\'foo \\u00b7 bar\'>foo</App>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App prop={`foo \\n bar`}>foo</App>',
      output: '<App prop="foo \\n bar">foo</App>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App prop={`foo \\u00b7 bar`}>foo</App>',
      output: '<App prop="foo \\u00b7 bar">foo</App>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App prop={`foo \\\'foo\\\' bar`}>foo</App>',
      output: '<App prop="foo \\\'foo\\\' bar">foo</App>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App prop={`foo \\\"foo\\\" bar`}>foo</App>',
      output: '<App prop="foo \\\"foo\\\" bar">foo</App>',
      options: [{props: 'never'}],
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
      code: '<MyComponent>{\'foo\'}</MyComponent>',
      output: '<MyComponent>foo</MyComponent>',
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      output: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<MyComponent>{\'foo\'}</MyComponent>',
      output: '<MyComponent>foo</MyComponent>',
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      output: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      options: [{props: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}>foo</MyComponent>',
      options: [{props: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo bar </MyComponent>',
      output: '<MyComponent>{\"foo bar \"}</MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
      output: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      options: [{props: 'always,single'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo bar </MyComponent>',
      output: '<MyComponent>{\'foo bar \'}</MyComponent>',
      options: [{children: 'always,single'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo bar <App/></MyComponent>',
      output: '<MyComponent>{\"foo bar \"}<App/></MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent>foo\\nbar</MyComponent>',
      output: '<MyComponent>{\"foo\\nbar\"}</MyComponent>',
      options: [{children: 'always'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent prop={\'bar\'}>{\'foo\'}</MyComponent>',
      output: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      options: ['never'],
      errors: [
        {message: unnecessaryCurlyMessage}, {message: unnecessaryCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}>{\"foo\"}</MyComponent>',
      options: ['always'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\'bar\'}>{\'foo\'}</MyComponent>',
      options: ['always', 'single'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}>{\"foo\"}</MyComponent>',
      options: ['always', 'double'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}>{\'foo\'}</MyComponent>',
      options: [{props: 'always,double', children: 'always,single'}],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
      output: '<MyComponent prop={\'bar\'}>{\"foo\"}</MyComponent>',
      options: [{props: 'always,single', children: 'always,double'}],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
      output: '<MyComponent prop={\'bar\'}>{\"foo\"}</MyComponent>',
      options: [{props: 'always', children: 'always,double'}, 'single'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
      output: '<MyComponent prop={\'bar\'}>{\'foo\'}</MyComponent>',
      options: [{props: 'always', children: 'always'}, 'single'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}>{\"foo\"}</MyComponent>',
      options: [{props: 'always,double', children: 'always,double'}, 'single'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo<App/></MyComponent>',
      output: '<MyComponent prop={\"bar\"}>{\"foo\"}<App/></MyComponent>',
      options: ['always', 'double'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'><App/>foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}><App/>{\"foo\"}</MyComponent>',
      options: ['always', 'double'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\'>foo</MyComponent>',
      output: '<MyComponent prop={\'bar\'}>foo</MyComponent>',
      options: [{props: 'always,original'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent prop=\"bar\">foo</MyComponent>',
      output: '<MyComponent prop={\"bar\"}>foo</MyComponent>',
      options: [{props: 'always,original'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent prop=\'bar \\n "hello" foo\'>foo</MyComponent>',
      output: '<MyComponent prop={\'bar \\n "hello" foo\'}>foo</MyComponent>',
      options: [{props: 'always,original'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent prop=\"bar \\n bar \'hello\' foo \">foo</MyComponent>',
      output: '<MyComponent prop={\"bar \\n bar \'hello\' foo \"}>foo</MyComponent>',
      options: [{props: 'always,original'}],
      errors: [{message: missingCurlyMessage}]
    },
    {
      code: '<MyComponent prop=\'bar\"bar\"foo\'>foo"bar"</MyComponent>',
      output: '<MyComponent prop={\'bar\"bar\"foo\'}>{\"foo\\"bar\\"\"}</MyComponent>',
      options: ['always', 'single'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop=\'bar\"bar\"foo\'>foo"bar"</MyComponent>',
      output: '<MyComponent prop={\'bar\"bar\"foo\'}>{\"foo\\"bar\\"\"}</MyComponent>',
      options: ['always', 'double'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop="bar\'bar\'foo">foo\'bar\'</MyComponent>',
      output: '<MyComponent prop={"bar\'bar\'foo"}>{"foo\'bar\'"}</MyComponent>',
      options: ['always', 'single'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<MyComponent prop="bar\'bar\'foo">foo\'bar\'</MyComponent>',
      output: '<MyComponent prop={"bar\'bar\'foo"}>{"foo\'bar\'"}</MyComponent>',
      options: ['always', 'double'],
      errors: [
        {message: missingCurlyMessage}, {message: missingCurlyMessage}
      ]
    },
    {
      code: '<App>{\'foo "bar"\'}</App>',
      output: '<App>foo \"bar\"</App>',
      options: [{children: 'never'}],
      errors: [{message: unnecessaryCurlyMessage}]
    },
    {
      code: '<App>{\"foo \'bar\'\"}</App>',
      output: '<App>foo \'bar\'</App>',
      errors: [{message: unnecessaryCurlyMessage}],
      options: [{children: 'never'}]
    },
    {
      code: '<App prop={\"foo \'bar\' foo \"}>foo</App>',
      output: '<App prop=\"foo \'bar\' foo \">foo</App>',
      errors: [{message: unnecessaryCurlyMessage}],
      options: [{props: 'never'}]
    },
    {
      code: '<App prop={\'foo "bar"\'}>foo</App>',
      output: '<App prop=\'foo "bar"\'>foo</App>',
      errors: [{message: unnecessaryCurlyMessage}],
      options: [{props: 'never'}]
    }
  ]
});
