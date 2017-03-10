/**
 * @fileoverview Tests for no-unused-state
 */

'use strict';

var rule = require('../../../lib/rules/no-unused-state');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

var eslintTester = new RuleTester({
  parserOptions: parserOptions,
  parser: 'babel-eslint'
});

function getErrorMessages(unusedFields) {
  return unusedFields.map(function(field) {
    return {
      message: 'Unused state field: \'' + field + '\''
    };
  });
}

eslintTester.run('no-unused-state', rule, {
  valid: [
    [
      'class NoStateTest extends React.Component {',
      '  render() {',
      '    return <SomeComponent />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class CtorStateTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    return <SomeComponent foo={this.state.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class SetStateTest extends React.Component {',
      '  onFooChange(newFoo) {',
      '    this.setState({ foo: newFoo });',
      '  }',
      '  render() {',
      '    return <SomeComponent foo={this.state.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class ClassPropertyStateTest extends React.Component {',
      '  state = { foo: 0 };',
      '  render() {',
      '    return <SomeComponent foo={this.state.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class VariableDeclarationTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const foo = this.state.foo;',
      '    return <SomeComponent foo={foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class DestructuringTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const {foo: myFoo} = this.state;',
      '    return <SomeComponent foo={myFoo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class ShorthandDestructuringTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const {foo} = this.state;',
      '    return <SomeComponent foo={foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class AliasDeclarationTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const state = this.state;',
      '    return <SomeComponent foo={state.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class AliasAssignmentTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    let state;',
      '    state = this.state;',
      '    return <SomeComponent foo={state.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class DestructuringAliasTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const {state: myState} = this;',
      '    return <SomeComponent foo={myState.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class ShorthandDestructuringAliasTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const {state} = this;',
      '    return <SomeComponent foo={state.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class RestPropertyTest extends React.Component {',
      '  constructor() {',
      '    this.state = {',
      '      foo: 0,',
      '      bar: 1,',
      '    };',
      '  }',
      '  render() {',
      '    const {foo, ...others} = this.state;',
      '    return <SomeComponent foo={foo} bar={others.bar} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class DeepDestructuringTest extends React.Component {',
      '  state = { foo: 0, bar: 0 };',
      '  render() {',
      '    const {state: {foo, ...others}} = this;',
      '    return <SomeComponent foo={foo} bar={others.bar} />;',
      '  }',
      '}'
    ].join('\n'),
    // A cleverer analysis might recognize that the following should be errors,
    // but they're out of scope for this lint rule.
    [
      'class MethodArgFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  consumeFoo(foo) {}',
      '  render() {',
      '    this.consumeFoo(this.state.foo)',
      '    return <SomeComponent />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class AssignedToObjectFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const obj = { foo: this.state.foo, bar: 0 };',
      '    return <SomeComponent bar={obj.bar} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class ComputedAccessFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0, bar: 1 };',
      '  }',
      '  render() {',
      '    const bar = \'bar\';',
      '    return <SomeComponent bar={this.state[bar]} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class JsxSpreadFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    return <SomeComponent {...this.state} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class AliasedJsxSpreadFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const state = this.state;',
      '    return <SomeComponent {...state} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class ObjectSpreadFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const attrs = { ...this.state, foo: 1 };',
      '    return <SomeComponent foo={attrs.foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class ShadowingFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    const state = this.state;',
      '    let foo;',
      '    {',
      '      const state = { foo: 5 };',
      '      foo = state.foo;',
      '    }',
      '    return <SomeComponent foo={foo} />;',
      '  }',
      '}'
    ].join('\n'),
    [
      'class TypeCastExpressionSpreadFalseNegativeTest extends React.Component {',
      '  constructor() {',
      '    this.state = { foo: 0 };',
      '  }',
      '  render() {',
      '    return <SomeComponent {...(this.state: any)} />;',
      '  }',
      '}'
    ].join('\n')
  ],

  invalid: [
    {
      code: [
        'class UnusedCtorStateTest extends React.Component {',
        '  constructor() {',
        '    this.state = { foo: 0 };',
        '  }',
        '  render() {',
        '    return <SomeComponent />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo'])
    },
    {
      code: [
        'class UnusedSetStateTest extends React.Component {',
        '  onFooChange(newFoo) {',
        '    this.setState({ foo: newFoo });',
        '  }',
        '  render() {',
        '    return <SomeComponent />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo'])
    },
    {
      code: [
        'class UnusedClassPropertyStateTest extends React.Component {',
        '  state = { foo: 0 };',
        '  render() {',
        '    return <SomeComponent />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo'])
    },
    {
      code: [
        'class UnusedStateWhenPropsAreSpreadTest extends React.Component {',
        '  constructor() {',
        '    this.state = { foo: 0 };',
        '  }',
        '  render() {',
        '    return <SomeComponent {...this.props} />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo'])
    },
    {
      code: [
        'class AliasOutOfScopeTest extends React.Component {',
        '  constructor() {',
        '    this.state = { foo: 0 };',
        '  }',
        '  render() {',
        '    const state = this.state;',
        '    return <SomeComponent />;',
        '  }',
        '  someMethod() {',
        '    const outOfScope = state.foo;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo'])
    },
    {
      code: [
        'class MultipleErrorsTest extends React.Component {',
        '  constructor() {',
        '    this.state = {',
        '      foo: 0,',
        '      bar: 1,',
        '      baz: 2,',
        '      qux: 3,',
        '    };',
        '  }',
        '  render() {',
        '    let {state} = this;',
        '    return <SomeComponent baz={state.baz} qux={state.qux} />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo', 'bar'])
    },
    {
      code: [
        'class MultipleErrorsForSameKeyTest extends React.Component {',
        '  constructor() {',
        '    this.state = { foo: 0 };',
        '  }',
        '  onFooChange(newFoo) {',
        '    this.setState({ foo: newFoo });',
        '  }',
        '  render() {',
        '    return <SomeComponent />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo', 'foo'])
    },
    {
      code: [
        'class UnusedRestPropertyFieldTest extends React.Component {',
        '  constructor() {',
        '    this.state = {',
        '      foo: 0,',
        '      bar: 1,',
        '    };',
        '  }',
        '  render() {',
        '    const {bar, ...others} = this.state;',
        '    return <SomeComponent bar={bar} />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['foo'])
    },
    {
      code: [
        'class TypeCastExpressionTest extends React.Component {',
        '  constructor() {',
        '    this.state = {',
        '      foo: 0,',
        '      bar: 1,',
        '      baz: 2,',
        '      qux: 3,',
        '    };',
        '  }',
        '  render() {',
        '    const foo = ((this: any).state: any).foo;',
        '    const {bar, ...others} = (this.state: any);',
        '    let baz;',
        '    baz = (others: any)[\'baz\'];',
        '    return <SomeComponent foo={foo} bar={bar} baz={baz} />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['qux'])
    },
    {
      code: [
        'class UnusedDeepDestructuringTest extends React.Component {',
        '  state = { foo: 0, bar: 0 };',
        '  render() {',
        '    const {state: {foo}} = this;',
        '    return <SomeComponent foo={foo} />;',
        '  }',
        '}'
      ].join('\n'),
      errors: getErrorMessages(['bar'])
    }
  ]
});
