/**
 * @fileoverview Prevent using unwrapped literals in a React component definition
 * @author Caleb morris
 * @author David Buchan-Swanson
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-literals');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

function stringsMessage(str) {
  return `Strings not allowed in JSX files: “${str}”`;
}

function jsxMessage(str) {
  return `Missing JSX expression container around literal string: “${str}”`;
}

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-no-literals', rule, {

  valid: [
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
              </div>
            );
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
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
      parser: 'babel-eslint'
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{'hello'}</div>);
            return bar;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        var Hello = createReactClass({
          foo: (<div>{'hello'}</div>),
          render() {
            return this.foo;
          },
        });
      `,
      parser: 'babel-eslint'
    }, {
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
      parser: 'babel-eslint'
    }, {
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
      parser: 'babel-eslint'
    }, {
      code: `
        var foo = require('foo');
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: `
        <Foo bar="test">
          {intl.formatText(message)}
        </Foo>
      `,
      options: [{noStrings: true}]
    }, {
      code: `
        <Foo bar="test">
          {translate('my.translate.key')}
        </Foo>
      `,
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={true} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={false} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={100} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={null} />',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={{}} />',
      options: [{noStrings: true}]
    }, {
      code: `
        class Comp1 extends Component {
          asdf() {}
          render() {
            return <Foo bar={this.asdf} />;
          }
        }
      `,
      options: [{noStrings: true}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            let foo = \`bar\`;
            return <div />;
          }
        }
      `,
      options: [{noStrings: true}]
    }

  ],

  invalid: [
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            const foo = (<div>test</div>);
            return foo;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        class Comp1 extends Component {
          render() {
            const varObjectTest = { testKey : (<div>test</div>) };
            return varObjectTest.testKey;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        var Hello = createReactClass({
          foo: (<div>hello</div>),
          render() {
            return this.foo;
          },
        });
      `,
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('hello')}]
    }, {
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
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('asdjfl')}]
    }, {
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
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('asdjfl\n                test\n                foo')}]
    }, {
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
      parser: 'babel-eslint',
      errors: [{message: jsxMessage('test')}]
    }, {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      parser: 'babel-eslint',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('\'Test\'')}]
    }, {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('\'Test\'')}]
    }, {
      code: `
        <Foo bar="test">
          {'Test' + name}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('\'Test\'')}]
    }, {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      parser: 'babel-eslint',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('Test')}]
    }, {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('Test')}]
    }, {
      code: `
        <Foo>
          {\`Test\`}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`Test`')}]
    }, {
      code: '<Foo bar={`Test`} />',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`Test`')}]
    }, {
      code: '<Foo bar={`${baz}`} />',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`${baz}`')}]
    }, {
      code: '<Foo bar={`Test ${baz}`} />',
      options: [{noStrings: true}],
      errors: [{message: stringsMessage('`Test ${baz}`')}]
    }, {
      code: '<Foo bar={`foo` + \'bar\'} />',
      options: [{noStrings: true}],
      errors: [
        {message: stringsMessage('`foo`')},
        {message: stringsMessage('\'bar\'')}
      ]
    }, {
      code: '<Foo bar={`foo` + `bar`} />',
      options: [{noStrings: true}],
      errors: [
        {message: stringsMessage('`foo`')},
        {message: stringsMessage('`bar`')}
      ]
    }, {
      code: '<Foo bar={\'foo\' + `bar`} />',
      options: [{noStrings: true}],
      errors: [
        {message: stringsMessage('\'foo\'')},
        {message: stringsMessage('`bar`')}
      ]
    }
  ]
});
