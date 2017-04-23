/**
 * @fileoverview Prevent direct mutation of this.state
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-direct-mutation-state');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-direct-mutation-state', rule, {

  valid: [{
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    var obj = {state: {}};',
      '    obj.state.name = "foo";',
      '    return <div>Hello {obj.state.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = "foo";',
      'module.exports = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello {',
      '  getFoo() {',
      '    this.state.foo = \'bar\'',
      '    return this.state.foo;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    this.state.foo = "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    this.state.person.name= "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    this.state.person.name.first = "bar"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    this.state.person.name.first = "bar"',
      '    this.state.person.name.last = "baz"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate state directly. Use setState().',
      line: 3,
      column: 5
    }, {
      message: 'Do not mutate state directly. Use setState().',
      line: 4,
      column: 5
    }]
  }
  /**
   * Would be nice to prevent this too
  , {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    var that = this;',
      '    that.state.person.name.first = "bar"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }*/
  ]
});
