/**
 * @fileoverview Tests for forbid-dom-props
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/forbid-dom-props');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ID_ERROR_MESSAGE = 'Prop `id` is forbidden on DOM Nodes';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-element-props', rule, {

  valid: [{
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <Foo id="foo" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo id="bar" style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style', 'id']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <this.Foo bar="baz" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'class First extends createReactClass {',
      '  render() {',
      '    return <this.foo id="bar" />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'const First = (props) => (',
      '  <this.Foo {...props} />',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'const First = (props) => (',
      '  <div name="foo" />',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div id="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['id']}],
    errors: [{
      message: ID_ERROR_MESSAGE,
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'class First extends createReactClass {',
      '  render() {',
      '    return <div id="bar" />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{forbid: ['id']}],
    errors: [{
      message: ID_ERROR_MESSAGE,
      line: 3,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const First = (props) => (',
      '  <div id="foo" />',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}],
    errors: [{
      message: ID_ERROR_MESSAGE,
      line: 2,
      column: 8,
      type: 'JSXAttribute'
    }]
  }]
});
