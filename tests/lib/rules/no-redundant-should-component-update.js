/**
 * @fileoverview Tests for no-redundant-should-component-update
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-redundant-should-component-update');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

function errorMessage(node) {
  return `${node} does not need shouldComponentUpdate when extending React.PureComponent.`;
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-redundant-should-component-update', rule, {
  valid: [
    {
      code: [
        'class Foo extends React.Component {',
        '  shouldComponentUpdate() {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'class Foo extends React.Component {',
        '  shouldComponentUpdate = () => {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: [
        'class Foo extends React.Component {',
        '  shouldComponentUpdate() {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'function Foo() {',
        '  return class Bar extends React.Component {',
        '    shouldComponentUpdate() {',
        '      return true;',
        '    }',
        '  };',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }
  ],
  invalid: [
    {
      code: [
        'class Foo extends React.PureComponent {',
        '  shouldComponentUpdate() {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{message: errorMessage('Foo')}],
      parserOptions: parserOptions
    },
    {
      code: [
        'class Foo extends PureComponent {',
        '  shouldComponentUpdate() {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{message: errorMessage('Foo')}],
      parserOptions: parserOptions
    },
    {
      code: [
        'class Foo extends React.PureComponent {',
        '  shouldComponentUpdate = () => {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{message: errorMessage('Foo')}],
      parser: 'babel-eslint',
      parserOptions: parserOptions
    },
    {
      code: [
        'function Foo() {',
        '  return class Bar extends React.PureComponent {',
        '    shouldComponentUpdate() {',
        '      return true;',
        '    }',
        '  };',
        '}'
      ].join('\n'),
      errors: [{message: errorMessage('Bar')}],
      parserOptions: parserOptions
    },
    {
      code: [
        'function Foo() {',
        '  return class Bar extends PureComponent {',
        '    shouldComponentUpdate() {',
        '      return true;',
        '    }',
        '  };',
        '}'
      ].join('\n'),
      errors: [{message: errorMessage('Bar')}],
      parserOptions: parserOptions
    },
    {
      code: [
        'var Foo = class extends PureComponent {',
        '  shouldComponentUpdate() {',
        '    return true;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{message: errorMessage('Foo')}],
      parserOptions: parserOptions
    }
  ]
});
