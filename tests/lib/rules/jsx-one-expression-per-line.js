/**
 * @fileoverview Limit to one expression per line in JSX
 * @author Mark Ivan Allen <Vydia.com>
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-one-expression-per-line');

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
ruleTester.run('jsx-one-expression-per-line', rule, {
  valid: parsers.all([
    {
      code: '<App />',
    },
    {
      code: `
\t\t\t\t<AllTabs>
\t\t\t\t\tFail
\t\t\t\t</AllTabs>
      `,
    },
    {
      code: `
\t\t\t\t<TagsWithTabs>
          Fail
\t\t\t\t</TagsWithTabs>
      `,
    },
    {
      code: `
        <ClosedTagWithTabs>
          Fail
\t\t\t\t</ClosedTagWithTabs>
      `,
    },
    {
      code: `
\t\t\t\t<OpenTagWithTabs>
          OK
        </OpenTagWithTabs>
      `,
    },
    {
      code: `
        <TextWithTabs>
\t\t\t\t\t\tOK
        </TextWithTabs>
      `,
    },
    {
      code: `
        <AllSpaces>
          OK
        </AllSpaces>
      `,
    },
    {
      code: '<App></App>',
    },
    {
      code: '<App foo="bar" />',
    },
    {
      code: `
        <App>
          <Foo />
        </App>
      `,
    },
    {
      code: `
        <App>
          <Foo />
          <Bar />
        </App>
      `,
    },
    {
      code: `
        <App>
          <Foo></Foo>
        </App>
      `,
    },
    {
      code: `
        <App>
          foo bar baz  whatever
        </App>
      `,
    },
    {
      code: `
        <App>
          <Foo>
          </Foo>
        </App>
      `,
    },
    {
      code: `
        <App
          foo="bar"
        >
        <Foo />
        </App>
      `,
    },
    {
      code: `
        <
        App
        >
          <
            Foo
          />
        </
        App
        >
      `,
    },
    {
      code: '<App>foo</App>',
      options: [{ allow: 'literal' }],
    },
    {
      code: '<App>123</App>',
      options: [{ allow: 'literal' }],
    },
    {
      code: '<App>foo</App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<App>{"foo"}</App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<App>{foo && <Bar />}</App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<App><Foo /></App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<></>',
      features: ['fragment'],
    },
    {
      code: `
        <>
          <Foo />
        </>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      code: `
        <>
          <Foo />
          <Bar />
        </>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        <App>{"foo"}</App>
      `,
      output: `
        <App>
{"foo"}
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>foo</App>
      `,
      output: `
        <App>
foo
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          foo {"bar"}
        </div>
      `,
      output: `
        <div>
          foo${' '/* intentional trailing space */}
{' '}
{"bar"}
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          {"foo"} bar
        </div>
      `,
      output: `
        <div>
          {"foo"}
{' '}
bar
</div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' bar        ' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo /><Bar />
        </App>
      `,
      output: `
        <App>
          <Foo />
<Bar />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          <span />foo
        </div>
      `,
      output: `
        <div>
          <span />
foo
</div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo        ' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          <span />{"foo"}
        </div>
      `,
      output: `
        <div>
          <span />
{"foo"}
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          {"foo"} { I18n.t('baz') }
        </div>
      `,
      output: `
        <div>
          {"foo"}${' '/* intentional trailing space */}
{' '}
{ I18n.t('baz') }
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ I18n.t(\'baz\') }' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <Text style={styles.foo}>{ bar } <Text/> { I18n.t('baz') }</Text>
      `,
      output: `
        <Text style={styles.foo}>
{ bar }${' '/* intentional trailing space */}
{' '}
<Text/>${' '/* intentional trailing space */}
{' '}
{ I18n.t('baz') }
</Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ bar }' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Text' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ I18n.t(\'baz\') }' },
        },
      ],
      parserOptions,

    },
    {
      code: `
        <Text style={styles.foo}> <Bar/> <Baz/></Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar/>${' '/* intentional trailing space */}
{' '}
<Baz/>
</Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Baz' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <Text style={styles.foo}> <Bar/> <Baz/> <Bunk/> <Bruno/> </Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar/>${' '/* intentional trailing space */}
{' '}
<Baz/>${' '/* intentional trailing space */}
{' '}
<Bunk/>${' '/* intentional trailing space */}
{' '}
<Bruno/>
{' '}
 </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Baz' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bunk' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bruno' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <Text style={styles.foo}> <Bar /></Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar />
</Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <Text style={styles.foo}> <Bar />
        </Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar />
        </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <Text style={styles.foo}>
          <Bar /> <Baz />
        </Text>
      `,
      output: `
        <Text style={styles.foo}>
          <Bar />${' '/* intentional trailing space */}
{' '}
<Baz />
        </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Baz' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <Text style={styles.foo}>
          { bar } { I18n.t('baz') }
        </Text>
      `,
      output: `
        <Text style={styles.foo}>
          { bar }${' '/* intentional trailing space */}
{' '}
{ I18n.t('baz') }
        </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ I18n.t(\'baz\') }' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          foo<input />
        </div>
      `,
      output: `
        <div>
          foo
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          {"foo"}<span />
        </div>
      `,
      output: `
        <div>
          {"foo"}
<span />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'span' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          foo <input />
        </div>
      `,
      output: `
        <div>
          foo${' '/* intentional trailing space */}
{' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          <input /> foo
        </div>
      `,
      output: `
        <div>
          <input />
{' '}
foo
</div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' foo        ' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          <span /> <input />
        </div>
      `,
      output: `
        <div>
          <span />${' '/* intentional trailing space */}
{' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          <span />
        {' '}<input />
        </div>
      `,
      output: `
        <div>
          <span />
        {' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          {"foo"} <input />
        </div>
      `,
      output: `
        <div>
          {"foo"}${' '/* intentional trailing space */}
{' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <div>
          <input /> {"foo"}
        </div>
      `,
      output: `
        <div>
          <input />${' '/* intentional trailing space */}
{' '}
{"foo"}
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo></Foo><Bar></Bar>
        </App>
      `,
      output: `
        <App>
          <Foo></Foo>
<Bar></Bar>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
        <Foo></Foo></App>
      `,
      output: `
        <App>
        <Foo></Foo>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App><Foo />
        </App>
      `,
      output: `
        <App>
<Foo />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
        <Foo/></App>
      `,
      output: `
        <App>
        <Foo/>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App><Foo
        />
        </App>
      `,
      output: `
        <App>
<Foo
        />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App
        >
        <Foo /></App>
      `,
      output: `
        <App
        >
        <Foo />
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App
        >
        <Foo
        /></App>
      `,
      output: `
        <App
        >
        <Foo
        />
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App
        ><Foo />
        </App>
      `,
      output: `
        <App
        >
<Foo />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo></Foo
        ></App>
      `,
      output: `
        <App>
          <Foo></Foo
        >
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo></
        Foo></App>
      `,
      output: `
        <App>
          <Foo></
        Foo>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo></
        Foo></App>
      `,
      output: `
        <App>
          <Foo></
        Foo>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo></
        Foo><Bar />
        </App>
      `,
      output: `
        <App>
          <Foo></
        Foo>
<Bar />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo>
            <Bar /></Foo>
        </App>
      `,
      output: `
        <App>
          <Foo>
            <Bar />
</Foo>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo>
            <Bar> baz </Bar>
          </Foo>
        </App>
      `,
      output: `
        <App>
          <Foo>
            <Bar>
{' '}
baz
{' '}
</Bar>
          </Foo>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz ' },
        },
      ],
      parserOptions,
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>
          foo {"bar"} baz
        </App>
      `,
      output: `
        <App>
          foo${' '/* intentional trailing space */}
{' '}
{"bar"} baz
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      parserOptions,
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>
          foo {"bar"}
        </App>
      `,
      output: `
        <App>
          foo${' '/* intentional trailing space */}
{' '}
{"bar"}
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
      ],
      parserOptions,
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>
          foo
        {' '}
        {"bar"} baz
        </App>
      `,
      output: `
        <App>
          foo
        {' '}
        {"bar"}
{' '}
baz
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      parserOptions,
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>

          foo {"bar"} baz

        </App>
      `,
      output: `
        <App>

          foo${' '/* intentional trailing space */}
{' '}
{"bar"} baz

        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      parserOptions,
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>

          foo
        {' '}
        {"bar"} baz

        </App>
      `,
      output: `
        <App>

          foo
        {' '}
        {"bar"}
{' '}
baz

</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>{
          foo
        }</App>
      `,
      output: `
        <App>
{
          foo
        }
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{          foo        }' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App> {
          foo
        } </App>
      `,
      output: `
        <App>${' '/* intentional trailing space */}
{' '}
{
          foo
        }
{' '}
 </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{          foo        }' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App>
        {' '}
        {
          foo
        } </App>
      `,
      output: `
        <App>
        {' '}
        {
          foo
        }
{' '}
 </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{          foo        }' },
        },
      ],
      parserOptions,
    },
    {
      code: `
        <App><Foo /></App>
      `,
      output: `
        <App>
<Foo />
</App>
      `,
      options: [{ allow: 'none' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
    },
    {
      code: `
        <App>foo</App>
      `,
      output: `
        <App>
foo
</App>
      `,
      options: [{ allow: 'none' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo' },
        },
      ],
    },
    {
      code: `
        <App>{"foo"}</App>
      `,
      output: `
        <App>
{"foo"}
</App>
      `,
      options: [{ allow: 'none' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
    },
    {
      code: `
        <App>foo
        </App>
      `,
      output: `
        <App>
foo
</App>
      `,
      options: [{ allow: 'literal' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo        ' },
        },
      ],
    },
    {
      code: `
        <App><Foo /></App>
      `,
      output: `
        <App>
<Foo />
</App>
      `,
      options: [{ allow: 'literal' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
    },
    {
      code: `
        <App
          foo="1"
          bar="2"
        >baz</App>
      `,
      options: [{ allow: 'literal' }],
      output: `
        <App
          foo="1"
          bar="2"
        >
baz
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'baz' },
        },
      ],
    },
    {
      code: `
        <App>foo
        bar
        </App>
      `,
      options: [{ allow: 'literal' }],
      output: `
        <App>
foo
        bar
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo        bar        ' },
        },
      ],
    },
    {
      code: `
        <>{"foo"}</>
      `,
      output: `
        <>
{"foo"}
</>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      parserOptions,
    },
    {
      code: `
        <App>
          <Foo /><></>
        </App>
      `,
      output: `
        <App>
          <Foo />
<></>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '<></>' },
        },
      ],
      features: ['fragment'],
      parserOptions,
    },
    {
      code: `
        <
        ><Foo />
        </>
      `,
      output: `
        <
        >
<Foo />
        </>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      features: ['fragment', 'no-ts-old'],
      parserOptions,
    },
    {
      code: `
        <div>
        <MyComponent>a</MyComponent>
        <MyOther>{a}</MyOther>
        </div>
      `,
      output: `
        <div>
        <MyComponent>
a
</MyComponent>
        <MyOther>
{a}
</MyOther>
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'a' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{a}' },
        },
      ],
      parserOptions,
    },
  ]),
});
