/**
 * @fileoverview Test file for jsx-no-useless-fragment
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/jsx-no-useless-fragment');
const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('jsx-no-useless-fragment', rule, {
  valid: parsers.all([
    {
      code: '<><Foo /><Bar /></>',
    },
    {
      code: '<>foo<div /></>',
    },
    {
      code: '<> <div /></>',
    },
    {
      code: '<>{"moo"} </>',
    },
    {
      code: '<NotFragment />',
    },
    {
      code: '<React.NotFragment />',
    },
    {
      code: '<NotReact.Fragment />',
    },
    {
      code: '<Foo><><div /><div /></></Foo>',
    },
    {
      code: '<div p={<>{"a"}{"b"}</>} />',
    },
    {
      code: '<Fragment key={item.id}>{item.value}</Fragment>',
    },
    {
      code: '<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />',
    },
    {
      code: '<>{foos.map(foo => foo)}</>',
    },
    {
      code: '<>{moo}</>',
      options: [{ allowExpressions: true }],
    },
    {
      code: `
        <>
          {moo}
        </>
      `,
      options: [{ allowExpressions: true }],
    },
  ]),
  invalid: parsers.all([].concat(
    {
      code: '<></>',
      output: null,
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXFragment' }],
    },
    {
      code: '<>{}</>',
      output: null,
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXFragment' }],
    },
    {
      code: '<p>moo<>foo</></p>',
      output: '<p>moofoo</p>',
      errors: [
        { messageId: 'NeedsMoreChildren', type: 'JSXFragment' },
        { messageId: 'ChildOfHtmlElement', type: 'JSXFragment' },
      ],
    },
    {
      code: '<>{meow}</>',
      output: null,
      errors: [{ messageId: 'NeedsMoreChildren' }],
    },
    {
      code: '<p><>{meow}</></p>',
      output: '<p>{meow}</p>',
      errors: [
        { messageId: 'NeedsMoreChildren', type: 'JSXFragment' },
        { messageId: 'ChildOfHtmlElement', type: 'JSXFragment' },
      ],
    },
    {
      code: '<><div/></>',
      output: '<div/>',
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXFragment' }],
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
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXFragment' }],
    },
    {
      code: '<Fragment />',
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXElement' }],
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
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXElement' }],
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
          fragment: 'SomeFragment',
        },
      },
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXElement' }],
    },
    {
      // Not safe to fix this case because `Eeee` might require child be ReactElement
      code: '<Eeee><>foo</></Eeee>',
      output: null,
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXFragment' }],
    },
    {
      code: '<div><>foo</></div>',
      output: '<div>foo</div>',
      errors: [
        { messageId: 'NeedsMoreChildren', type: 'JSXFragment' },
        { messageId: 'ChildOfHtmlElement', type: 'JSXFragment' },
      ],
    },
    {
      code: '<div><>{"a"}{"b"}</></div>',
      output: '<div>{"a"}{"b"}</div>',
      errors: [{ messageId: 'ChildOfHtmlElement', type: 'JSXFragment' }],
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
      errors: [{ messageId: 'ChildOfHtmlElement', type: 'JSXFragment' }],
    },
    {
      code: '<div><Fragment>{"a"}{"b"}</Fragment></div>',
      output: '<div>{"a"}{"b"}</div>',
      errors: [{ messageId: 'ChildOfHtmlElement', type: 'JSXElement' }],
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
      errors: [
        { messageId: 'ChildOfHtmlElement', type: 'JSXFragment', line: 3 },
        { messageId: 'ChildOfHtmlElement', type: 'JSXFragment', line: 7 },
      ],
    },
    {
      code: '<div>a <>{""}{""}</> a</div>',
      output: '<div>a {""}{""} a</div>',
      errors: [{ messageId: 'ChildOfHtmlElement', type: 'JSXFragment' }],
    },
    {
      code: `
        const Comp = () => (
          <html>
            <React.Fragment />
          </html>
        );
      `,
      output: `
        const Comp = () => (
          <html>
            ${/* the trailing whitespace here is intentional */ ''}
          </html>
        );
      `,
      errors: [
        { messageId: 'NeedsMoreChildren', type: 'JSXElement', line: 4 },
        { messageId: 'ChildOfHtmlElement', type: 'JSXElement', line: 4 },
      ],
    },
    // Ensure allowExpressions still catches expected violations
    {
      code: '<><Foo>{moo}</Foo></>',
      options: [{ allowExpressions: true }],
      errors: [{ messageId: 'NeedsMoreChildren', type: 'JSXFragment' }],
      output: '<Foo>{moo}</Foo>',
    }
  )),
});
