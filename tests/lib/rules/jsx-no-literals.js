/**
 * @fileoverview Prevent using unwrapped literals in a React component definition
 * @author Caleb morris
 * @author David Buchan-Swanson
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
    {
      code: `
        <div>&mdash;</div>
      `,
      options: [{ noStrings: true, allowedStrings: ['&mdash;', '—'] }],
    },
    {
      code: `
        <div>—</div>
      `,
      options: [{ noStrings: true, allowedStrings: ['&mdash;', '—'] }],
    },
    {
      code: `
        <img src="image.jpg" alt="text" />
      `,
      options: [{ restrictedAttributes: ['className', 'id'] }],
    },
    {
      code: `
        <div className="allowed" />
      `,
      options: [{ restrictedAttributes: ['className'], allowedStrings: ['allowed'] }],
    },
    {
      code: `
        <div className="test" title="hello" />
      `,
      options: [{
        noStrings: true,
        ignoreProps: true,
        restrictedAttributes: ['className'],
        allowedStrings: ['test'],
      }],
    },
    {
      code: `
        <div className="test" id="foo" />
      `,
      options: [{ restrictedAttributes: [] }],
    },
    {
      code: `
        <T>foo</T>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        <T>foo <div>bar</div></T>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        <T>foo <div>{'bar'}</div></T>
      `,
      options: [{ elementOverrides: { T: { allowElement: true, applyToNestedElements: false } } }],
    },
    {
      code: `
        <div>
          <div>{'foo'}</div>
          <T>{2}</T>
        </div>
      `,
      options: [{ elementOverrides: { T: { noStrings: true } } }],
    },
    {
      code: `
        <T>{2}<div>{2}</div></T>
      `,
      options: [{ elementOverrides: { T: { noStrings: true } } }],
    },
    {
      code: `
        <T>{2}<div>{'foo'}</div></T>
      `,
      options: [{ elementOverrides: { T: { noStrings: true, applyToNestedElements: false } } }],
    },
    {
      code: `
        <div>
          <div>{'foo'}</div>
          <T>foo</T>
        </div>
      `,
      options: [{ elementOverrides: { T: { allowedStrings: ['foo'] } } }],
    },
    {
      code: `
        <T>foo<div>foo</div></T>
      `,
      options: [{ elementOverrides: { T: { allowedStrings: ['foo'] } } }],
    },
    {
      code: `
        <T>foo<div>{'foo'}</div></T>
      `,
      options: [{ elementOverrides: { T: { allowedStrings: ['foo'], applyToNestedElements: false } } }],
    },
    {
      code: `
        <div>
          <div foo={2} />
          <T foo="bar" />
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, ignoreProps: true } } }],
    },
    {
      code: `
        <T foo="bar"><div foo="bar" /></T>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, ignoreProps: true } } }],
    },
    {
      code: `
        <T foo="bar"><div foo={2} /></T>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, ignoreProps: true, applyToNestedElements: false } } }],
    },
    {
      code: `
        <div>
          <div foo="foo" />
          <T foo={2} />
        </div>
      `,
      options: [{ elementOverrides: { T: { noAttributeStrings: true } } }],
    },
    {
      code: `
        <T foo={2}><div foo={2} /></T>
      `,
      options: [{ elementOverrides: { T: { noAttributeStrings: true } } }],
    },
    {
      code: `
        <T foo={2}><div foo="foo" /></T>
      `,
      options: [{ elementOverrides: { T: { noAttributeStrings: true, applyToNestedElements: false } } }],
    },
    {
      code: `
        <T>foo<U>foo</U></T>
      `,
      options: [{ elementOverrides: { T: { allowedStrings: ['foo'] }, U: { allowedStrings: ['foo'] } } }],
    },
    {
      code: `
        import { T } from 'foo';
        <T>{'foo'}</T>
      `,
    },
    {
      code: `
        import { T as U } from 'foo';
        <U>foo</U>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        const { T: U } = require('foo');
        <U>foo</U>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        const { T: U } = require('foo').Foo;
        <U>foo</U>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        const { T: U } = require('foo').Foo.Foo;
        <U>foo</U>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        const foo = 2;
        <T>foo</T>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
    },
    {
      code: `
        <T.U>foo</T.U>
      `,
      options: [{ elementOverrides: { 'T.U': { allowElement: true } } }],
    },
    {
      code: `
        import { T as U } from 'foo';
        <U.U>foo</U.U>
      `,
      options: [{ elementOverrides: { 'T.U': { allowElement: true } } }],
    },
    {
      code: `
        <React.Fragment>foo</React.Fragment>
      `,
      options: [{ elementOverrides: { Fragment: { allowElement: true } } }],
    },
    {
      code: `
        <React.Fragment>foo</React.Fragment>
      `,
      options: [{ elementOverrides: { 'React.Fragment': { allowElement: true } } }],
    },
    {
      code: `
        <div>{'foo'}</div>
      `,
      options: [{ elementOverrides: { div: { allowElement: true } } }],
    },
    {
      code: `
        <div>
          <Input type="text" />
          <Button className="primary" />
          <Image src="photo.jpg" />
        </div>
      `,
      options: [{
        elementOverrides: {
          Input: { restrictedAttributes: ['placeholder'] },
          Button: { restrictedAttributes: ['type'] },
        },
      }],
    },
    {
      code: `
        <div title="container">
          <Button className="btn" />
        </div>
      `,
      options: [{
        restrictedAttributes: ['className'],
        elementOverrides: {
          Button: { restrictedAttributes: ['disabled'] },
        },
      }],
    },
    {
      code: `
        <Button className="btn" />
      `,
      options: [{
        noAttributeStrings: true,
        elementOverrides: {
          Button: { restrictedAttributes: ['type'] },
        },
      }],
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
    /* eslint-disable no-template-curly-in-string */
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
    /* eslint-enable no-template-curly-in-string */
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
    {
      code: 'export const WithChildren = ({}) => <div>baz bob</div>;',
      options: [{ noAttributeStrings: true }],
      errors: [
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'baz bob' },
        },
      ],
    },
    {
      code: 'export const WithAttributes = ({}) => <div title="foo bar" />;',
      options: [{ noAttributeStrings: true }],
      errors: [
        {
          messageId: 'noStringsInAttributes',
          data: { text: '"foo bar"' },
        },
      ],
    },
    {
      code: `
        export const WithAttributesAndChildren = ({}) => (
          <div title="foo bar">baz bob</div>
        );
      `,
      options: [{ noAttributeStrings: true }],
      errors: [
        {
          messageId: 'noStringsInAttributes',
          data: { text: '"foo bar"' },
        },
        {
          messageId: 'literalNotInJSXExpression',
          data: { text: 'baz bob' },
        },
      ],
    },
    {
      code: `
        <div className="test" />
      `,
      options: [{ restrictedAttributes: ['className'] }],
      errors: [{
        messageId: 'restrictedAttributeString',
        data: { text: '"test"', attribute: 'className' },
      }],
    },
    {
      code: `
        <div className="test" id="foo" title="bar" />
      `,
      options: [{ restrictedAttributes: ['className', 'id'] }],
      errors: [
        { messageId: 'restrictedAttributeString', data: { text: '"test"', attribute: 'className' } },
        { messageId: 'restrictedAttributeString', data: { text: '"foo"', attribute: 'id' } },
      ],
    },
    {
      code: `
        <div src="image.jpg" />
      `,
      options: [{
        noAttributeStrings: true,
        restrictedAttributes: ['className'],
      }],
      errors: [{ messageId: 'noStringsInAttributes', data: { text: '"image.jpg"' } }],
    },
    {
      code: `
        <div title="text">test</div>
      `,
      options: [{
        restrictedAttributes: ['title'],
        noStrings: true,
      }],
      errors: [
        { messageId: 'restrictedAttributeString', data: { text: '"text"', attribute: 'title' } },
        { messageId: 'noStringsInJSX', data: { text: 'test' } },
      ],
    },
    {
      code: `
        <div className="test" title="hello" />
      `,
      options: [{ noStrings: true, ignoreProps: false, restrictedAttributes: ['className'] }],
      errors: [
        { messageId: 'restrictedAttributeString', data: { text: '"test"', attribute: 'className' } },
        { messageId: 'invalidPropValue', data: { text: 'title="hello"' } },
      ],
    },
    {
      code: `
        <div className="test" title="hello" />
      `,
      options: [{ noStrings: true, ignoreProps: true, restrictedAttributes: ['className'] }],
      errors: [
        { messageId: 'restrictedAttributeString', data: { text: '"test"', attribute: 'className' } },
      ],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>bar</T>
        </div>
      `,
      options: [{ elementOverrides: { T: {} } }],
      errors: [
        { messageId: 'literalNotInJSXExpression', data: { text: 'foo' } },
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'bar', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>bar</T>
        </div>
      `,
      options: [{ elementOverrides: { T: { allowElement: true } } }],
      errors: [
        { messageId: 'literalNotInJSXExpression', data: { text: 'foo' } },
      ],
    },
    {
      code: `
        <T>foo <div>bar</div></T>
      `,
      options: [{ elementOverrides: { T: { allowElement: true, applyToNestedElements: false } } }],
      errors: [{ messageId: 'literalNotInJSXExpression', data: { text: 'bar' } }],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>{'bar'}</T>
        </div>
      `,
      options: [{ elementOverrides: { T: { noStrings: true } } }],
      errors: [
        { messageId: 'literalNotInJSXExpression', data: { text: 'foo' } },
        { messageId: 'noStringsInJSXInElement', data: { text: '\'bar\'', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>{'bar'}<div>{'baz'}</div></T>
        </div>
      `,
      options: [{ elementOverrides: { T: { noStrings: true } } }],
      errors: [
        { messageId: 'literalNotInJSXExpression', data: { text: 'foo' } },
        { messageId: 'noStringsInJSXInElement', data: { text: '\'bar\'', element: 'T' } },
        { messageId: 'noStringsInJSXInElement', data: { text: '\'baz\'', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>{'bar'}<div>{'baz'}</div></T>
        </div>
      `,
      options: [{ elementOverrides: { T: { noStrings: true, applyToNestedElements: false } } }],
      errors: [
        { messageId: 'literalNotInJSXExpression', data: { text: 'foo' } },
        { messageId: 'noStringsInJSXInElement', data: { text: '\'bar\'', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div>{'foo'}</div>
          <T>{'foo'}</T>
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, allowedStrings: ['foo'] } } }],
      errors: [
        { messageId: 'noStringsInJSX', data: { text: '\'foo\'' } },
      ],
    },
    {
      code: `
        <div>
          <div>{'foo'}</div>
          <T>{'foo'}<div>{'foo'}</div></T>
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, allowedStrings: ['foo'] } } }],
      errors: [
        { messageId: 'noStringsInJSX', data: { text: '\'foo\'' } },
      ],
    },
    {
      code: `
        <div>
          <div>{'foo'}</div>
          <T>{'foo'}<div>{'foo'}</div></T>
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, allowedStrings: ['foo'], applyToNestedElements: false } } }],
      errors: [
        { messageId: 'noStringsInJSX', data: { text: '\'foo\'' } },
        { messageId: 'noStringsInJSX', data: { text: '\'foo\'' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar" />
          <T foo2="bar" />
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, ignoreProps: true } } }],
      errors: [
        { messageId: 'invalidPropValue', data: { text: 'foo1="bar"' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar" />
          <T foo2="bar"><div foo3="bar" /></T>
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, ignoreProps: true } } }],
      errors: [
        { messageId: 'invalidPropValue', data: { text: 'foo1="bar"' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar" />
          <T foo2="bar"><div foo3="bar" /></T>
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: { noStrings: true, ignoreProps: true, applyToNestedElements: false } } }],
      errors: [
        { messageId: 'invalidPropValue', data: { text: 'foo1="bar"' } },
        { messageId: 'invalidPropValue', data: { text: 'foo3="bar"' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar1" />
          <T foo2="bar2" />
        </div>
      `,
      options: [{ elementOverrides: { T: { noAttributeStrings: true } } }],
      errors: [
        { messageId: 'noStringsInAttributesInElement', data: { text: '"bar2"', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar1" />
          <T foo2="bar2"><div foo3="bar3" /></T>
        </div>
      `,
      options: [{ elementOverrides: { T: { noAttributeStrings: true } } }],
      errors: [
        { messageId: 'noStringsInAttributesInElement', data: { text: '"bar2"', element: 'T' } },
        { messageId: 'noStringsInAttributesInElement', data: { text: '"bar3"', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar1" />
          <T foo2="bar2"><div foo3="bar3" /></T>
        </div>
      `,
      options: [{ elementOverrides: { T: { noAttributeStrings: true, applyToNestedElements: false } } }],
      errors: [
        { messageId: 'noStringsInAttributesInElement', data: { text: '"bar2"', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div>{'foo'}</div>
          <T>{'bar'}</T>
        </div>
      `,
      options: [{ noStrings: true, elementOverrides: { T: {} } }],
      errors: [
        { messageId: 'noStringsInJSX', data: { text: '\'foo\'' } },
      ],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>foo</T>
        </div>
      `,
      options: [{ allowedStrings: ['foo'], elementOverrides: { T: {} } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div>foo</div>
          <T>foo</T>
          <T>bar</T>
          <T>baz</T>
        </div>
      `,
      options: [{ allowedStrings: ['foo'], elementOverrides: { T: { allowedStrings: ['bar'] } } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'T' } },
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'baz', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar1" />
          <T foo2="bar2" />
        </div>
      `,
      options: [{ noStrings: true, ignoreProps: true, elementOverrides: { T: { noStrings: true } } }],
      errors: [
        { messageId: 'invalidPropValueInElement', data: { text: 'foo2="bar2"', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar1" />
          <T foo2="bar2" />
        </div>
      `,
      options: [{ noAttributeStrings: true, elementOverrides: { T: {} } }],
      errors: [
        { messageId: 'noStringsInAttributes', data: { text: '"bar1"' } },
      ],
    },
    {
      code: `
        <div>
          <T>foo</T>
          <U>bar</U>
        </div>
      `,
      options: [{ elementOverrides: { T: {}, U: {} } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'T' } },
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'bar', element: 'U' } },
      ],
    },
    {
      code: `
        <div>
          <T>foo</T>
          <U>bar</U>
        </div>
      `,
      options: [{ elementOverrides: { T: {}, U: { allowElement: true } } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'T' } },
      ],
    },
    {
      code: `
        <T>foo <U>bar</U></T>
      `,
      options: [{ elementOverrides: { T: {}, U: { allowElement: true } } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'T' } },
      ],
    },
    {
      code: `
        <T>{'foo'}<U>{'bar'}</U></T>
      `,
      options: [{ elementOverrides: { T: { noStrings: true }, U: {} } }],
      errors: [
        { messageId: 'noStringsInJSXInElement', data: { text: '\'foo\'', element: 'T' } },
      ],
    },
    {
      code: `
        <T>foo<U>foo</U></T>
      `,
      options: [{ elementOverrides: { T: { allowedStrings: ['foo'] }, U: {} } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'U' } },
      ],
    },
    {
      code: `
        <T>foo<U>foo</U></T>
      `,
      options: [{ elementOverrides: { T: {}, U: { allowedStrings: ['foo'] } } }],
      errors: [
        { messageId: 'literalNotInJSXExpressionInElement', data: { text: 'foo', element: 'T' } },
      ],
    },
    {
      code: `
        <div>
          <Fragment>foo</Fragment>
          <React.Fragment>foo</React.Fragment>
        </div>
      `,
      options: [{ elementOverrides: { 'React.Fragment': { allowElement: true } } }],
      errors: [{ messageId: 'literalNotInJSXExpression', data: { text: 'foo' } }],
    },
    {
      code: `
        <div>foo</div>
      `,
      options: [{ elementOverrides: { div: { allowElement: true } } }],
      errors: [{ messageId: 'literalNotInJSXExpression', data: { text: 'foo' } }],
    },
    {
      code: `
        <div>
          <div type="text" />
          <Button type="submit" />
        </div>
      `,
      options: [{
        elementOverrides: {
          Button: { restrictedAttributes: ['type'] },
        },
      }],
      errors: [
        { messageId: 'restrictedAttributeStringInElement', data: { text: '"submit"', attribute: 'type', element: 'Button' } },
      ],
    },
    {
      code: `
        <div>
          <Input placeholder="Enter text" type="password" />
          <Button type="submit" disabled="true" />
        </div>
      `,
      options: [{
        elementOverrides: {
          Input: { restrictedAttributes: ['placeholder'] },
          Button: { restrictedAttributes: ['disabled'] },
        },
      }],
      errors: [
        { messageId: 'restrictedAttributeStringInElement', data: { text: '"Enter text"', attribute: 'placeholder', element: 'Input' } },
        { messageId: 'restrictedAttributeStringInElement', data: { text: '"true"', attribute: 'disabled', element: 'Button' } },
      ],
    },
    {
      code: `
        <div>
          <div className="wrapper" id="main" />
          <Button className="btn" id="submit-btn" />
        </div>
      `,
      options: [{
        restrictedAttributes: ['className'],
        elementOverrides: {
          Button: { restrictedAttributes: ['id'] },
        },
      }],
      errors: [
        { messageId: 'restrictedAttributeString', data: { text: '"wrapper"', attribute: 'className' } },
        { messageId: 'restrictedAttributeStringInElement', data: { text: '"submit-btn"', attribute: 'id', element: 'Button' } },
      ],
    },
    {
      code: `
        <div>
          <div foo1="bar1" />
          <T foo2="bar2" />
        </div>
      `,
      options: [{
        noAttributeStrings: true,
        elementOverrides: {
          T: { restrictedAttributes: ['foo2'] },
        },
      }],
      errors: [
        { messageId: 'noStringsInAttributes', data: { text: '"bar1"' } },
        { messageId: 'restrictedAttributeStringInElement', data: { text: '"bar2"', attribute: 'foo2', element: 'T' } },
      ],
    },
  ]),
});
