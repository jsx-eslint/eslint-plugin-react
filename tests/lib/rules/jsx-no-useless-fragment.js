/**
 * @fileoverview Test file for jsx-no-useless-fragment
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('../../../lib/rules/jsx-no-useless-fragment');
const parsers = require('../../helpers/parsers');

const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});

ruleTester.run('jsx-no-uselses-fragment', rule, {
  valid: [
    {
      code: '<><Foo /><Bar /></>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<>foo<div /></>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<> <div /></>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<>{"moo"} </>',
      parser: parsers.BABEL_ESLINT
    },
    '<NotFragment />',
    '<React.NotFragment />',
    '<NotReact.Fragment />',
    {
      code: '<Foo><><div /><div /></></Foo>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<div p={<>{"a"}{"b"}</>} />',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<Fragment key={item.id}>{item.value}</Fragment>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />',
      parser: parsers.BABEL_ESLINT
    }
  ],
  invalid: [
    {
      code: '<></>',
      output: null,
      errors: [{messageId: 'NeedsMoreChidren', type: 'JSXFragment'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<p>moo<>foo</></p>',
      output: '<p>moofoo</p>',
      errors: [{messageId: 'NeedsMoreChidren'}, {messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<>{meow}</>',
      output: null,
      errors: [{messageId: 'NeedsMoreChidren'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<p><>{meow}</></p>',
      output: '<p>{meow}</p>',
      errors: [{messageId: 'NeedsMoreChidren'}, {messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<><div/></>',
      output: '<div/>',
      errors: [{messageId: 'NeedsMoreChidren'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        <>
          <div/>
        </>
      `,
      output: `
        <div/>
      `,
      errors: [{messageId: 'NeedsMoreChidren'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<Fragment />',
      errors: [{messageId: 'NeedsMoreChidren'}]
    },
    {
      code: `
        <React.Fragment>
          <Foo />
        </React.Fragment>
      `,
      output: `
        <Foo />
      `,
      errors: [{messageId: 'NeedsMoreChidren'}]
    },
    {
      code: `
        <SomeReact.SomeFragment>
          {foo}
        </SomeReact.SomeFragment>
      `,
      settings: {
        react: {
          pragma: 'SomeReact',
          fragment: 'SomeFragment'
        }
      },
      errors: [{messageId: 'NeedsMoreChidren'}]
    },
    {
      // Not safe to fix this case because `Eeee` might require child be ReactElement
      code: '<Eeee><>foo</></Eeee>',
      output: null,
      errors: [{messageId: 'NeedsMoreChidren'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<div><>foo</></div>',
      output: '<div>foo</div>',
      errors: [{messageId: 'NeedsMoreChidren'}, {messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<div><>{"a"}{"b"}</></div>',
      output: '<div>{"a"}{"b"}</div>',
      errors: [{messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        <section>
          <Eeee />
          <Eeee />
          <>{"a"}{"b"}</>
        </section>`,
      output: `
        <section>
          <Eeee />
          <Eeee />
          {"a"}{"b"}
        </section>`,
      errors: [{messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<div><Fragment>{"a"}{"b"}</Fragment></div>',
      output: '<div>{"a"}{"b"}</div>',
      errors: [{messageId: 'ChildOfHtmlElement'}]
    },
    {
      // whitepace tricky case
      code: `
        <section>
          git<>
            <b>hub</b>.
          </>

          git<> <b>hub</b></>
        </section>`,
      output: `
        <section>
          git<b>hub</b>.

          git <b>hub</b>
        </section>`,
      errors: [{messageId: 'ChildOfHtmlElement'}, {messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<div>a <>{""}{""}</> a</div>',
      output: '<div>a {""}{""} a</div>',
      errors: [{messageId: 'ChildOfHtmlElement'}],
      parser: parsers.BABEL_ESLINT
    }
  ]
});
