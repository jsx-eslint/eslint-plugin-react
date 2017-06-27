/**
 * @fileoverview Prevent using unwrapped literals in a React component definition
 * @author Caleb morris
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
    }
  ]
});
