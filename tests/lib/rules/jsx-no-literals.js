/**
 * @fileoverview Prevent using unwrapped literals in a React component definition
 * @author Caleb morris
 * @author David Buchan-Swanson
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-literals');

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
ruleTester.run('jsx-no-literals', rule, {
  valid: parsers.all([
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                <button type="button"></button>
              </div>
            );
          }
        }
      `,
      options: [
        {
          noStrings: true,
          allowedStrings: ['button', 'submit'],
        },
      ],
    },
    {
      code: `
        class Comp2 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
              </div>
            );
          }
        }
      `,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <>
                {'asdjfl'}
              </>
            );
          }
        }
      `,
      features: ['fragment'],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{'hello'}</div>);
            return bar;
          }
        }
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          foo: (<div>{'hello'}</div>),
          render() {
            return this.foo;
          },
        });
      `,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                {'test'}
                {'foo'}
              </div>
            );
          }
        }
      `,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
              </div>
            );
          }
        }
      `,
    },
    {
      code: `
        var foo = require('foo');
      `,
    },
    {
      code: `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `,
    },
    {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: '<Foo bar={true} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={false} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={100} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={null} />',
      options: [{ noStrings: true }],
    },
    {
      code: '<Foo bar={{}} />',
      options: [{ noStrings: true }],
    },
    {
      code: `
        class Comp1 extends Component {
          asdf() {}
          render() {
            return <Foo bar={this.asdf} class='xx' />;
          }
        }
      `,
      options: [{ noStrings: true, ignoreProps: true }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            let foo = \`bar\`;
            return <div />;
          }
        }
      `,
      options: [{ noStrings: true }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>asdf</div>
          }
        }
      `,
      options: [{ allowedStrings: ['asdf'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>asdf</div>
          }
        }
      `,
      options: [{ noStrings: false, allowedStrings: ['asdf'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>&nbsp;</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['&nbsp;'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                &nbsp;
              </div>
            );
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['&nbsp;'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>foo: {bar}*</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['foo: ', '*'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div>foo</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['   foo   '] }],
    },
    {
      code: `
        class Comp1 extends Component {
          asdf() {}
          render() {
            const xx = 'xx';

            return <Foo bar={this.asdf} class={xx} />;
          }
        }
      `,
      options: [{ noStrings: true, ignoreProps: false }],
    },
    {
      code: `
        <img alt='blank image'></img>
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `,
      features: ['fragment'],
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const foo = (<div>test</div>);
            return foo;
          }
        }
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const varObjectTest = { testKey : (<div>test</div>) };
            return varObjectTest.testKey;
          }
        }
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          foo: (<div>hello</div>),
          render() {
            return this.foo;
          },
        });
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'hello' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
              </div>
            );
          }
        }
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'asdjfl' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
                test
                foo
              </div>
            );
          }
        }
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: {
            text: `asdjfl
                test
                foo`,
          },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                test
                {'foo'}
              </div>
            );
          }
        }
      `,
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'test' },
        },
      ],
    },
    {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'invalidPropValue',
          data: { text: 'bar="test"' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'Test\'' },
        },
      ],
    },
    {
      code: `
        <Foo bar="test">
          {'Test' + name}
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'invalidPropValue',
          data: { text: 'bar="test"' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'Test\'' },
        },
      ],
    },
    {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'invalidPropValue',
          data: { text: 'bar="test"' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: 'Test' },
        },
      ],
    },
    {
      code: `
        <Foo>
          {\`Test\`}
        </Foo>
      `,
      options: [{ noStrings: true }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`Test`' },
        },
      ],
    },
    {
      code: '<Foo bar={`Test`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`Test`' },
        },
      ],
    },
    {
      code: '<Foo bar={`${baz}`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`${baz}`' },
        },
      ],
    },
    {
      code: '<Foo bar={`Test ${baz}`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`Test ${baz}`' },
        },
      ],
    },
    {
      code: '<Foo bar={`foo` + \'bar\'} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`foo`' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'bar\'' },
        },
      ],
    },
    {
      code: '<Foo bar={`foo` + `bar`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '`foo`' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '`bar`' },
        },
      ],
    },
    {
      code: '<Foo bar={\'foo\' + `bar`} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'foo\'' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: '`bar`' },
        },
      ],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <div bar={'foo'}>asdf</div>
          }
        }
      `,
      options: [{ noStrings: true, allowedStrings: ['asd'], ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'foo\'' },
        },
        {
          messageId: 'noStringsInJSX',
          data: { text: 'asdf' },
        },
      ],
    },
    {
      code: '<Foo bar={\'bar\'} />',
      options: [{ noStrings: true, ignoreProps: false }],
      errors: [
        {
          messageId: 'noStringsInJSX',
          data: { text: '\'bar\'' },
        },
      ],
    },
    {
      code: `
        <img alt='blank image'></img>
      `,
      options: [{ noAttributeStrings: true }],
      errors: [
        {
          messageId: 'noStringsInAttributes',
          data: { text: '\'blank image\'' },
        },
      ],
    },
  ]),
});
