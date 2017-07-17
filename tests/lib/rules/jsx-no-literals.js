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
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-no-literals', rule, {

  valid: [
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {\'asdjfl\'}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>{\'test\'}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const bar = (<div>{\'hello\'}</div>);',
        '    return bar;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = createReactClass({',
        '  foo: (<div>{\'hello\'}</div>),',
        '  render() {',
        '    return this.foo;',
        '  },',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {\'asdjfl\'}',
        '        {\'test\'}',
        '        {\'foo\'}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var foo = require(\'foo\');'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        '<Foo bar=\'test\'>',
        '  {\'blarg\'}',
        '</Foo>'
      ].join('\n'),
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
      code: '<Foo bar={true} />',
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={false} />',
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={100} />',
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={null} />',
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: '<Foo bar={{}} />',
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  asdf() {}',
        '  render() {',
        '    return <Foo bar={this.asdf} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{noStrings: true}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    let foo = `bar`;',
        '    return <div />;',
        '  }',
        '}'
      ].join('\n'),
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
      code: [
        'class Comp1 extends Component {',
        '  asdf() {}',
        '  render() {',
        '    return <Foo bar={this.asdf} />;',
        '  }',
        '}'
      ].join('\n'),
      options: [{noStrings: true}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    let foo = `bar`;',
        '    return <div />;',
        '  }',
        '}'
      ].join('\n'),
      options: [{noStrings: true}]
    }

  ],

  invalid: [
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>test</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const foo = (<div>test</div>);',
        '    return foo;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const varObjectTest = { testKey : (<div>test</div>) };',
        '    return varObjectTest.testKey;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  foo: (<div>hello</div>),',
        '  render() {',
        '    return this.foo;',
        '  },',
        '});'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        asdjfl',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        asdjfl',
        '        test',
        '        foo',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {\'asdjfl\'}',
        '        test',
        '        {\'foo\'}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{message: 'Missing JSX expression container around literal string'}]
    }, {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      parser: 'babel-eslint',
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: `
        <Foo bar="test">
          {'Test'}
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      parser: 'babel-eslint',
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: `
        <Foo bar="test">
          Test
        </Foo>
      `,
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: [
        '<Foo>',
        '  {`Test`}',
        '</Foo>'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: [
        '<Foo>',
        '  {`Test`}',
        '</Foo>'
      ].join('\n'),
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: '<Foo bar={`Test`} />',
      parser: 'babel-eslint',
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }, {
      code: '<Foo bar={`Test`} />',
      options: [{noStrings: true}],
      errors: [{message: 'Strings not allowed in JSX files'}]
    }
  ]
});
