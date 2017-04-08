/**
 * @fileoverview Prevent mutation of this.props
 * @author Ian Schmitz
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-mutation-props');
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
ruleTester.run('no-mutation-props', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    var obj = {props: {}};',
      '    obj.props.name = "foo";',
      '    return <div>Hello {obj.props.name}</div>;',
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
      '    this.props.foo = \'bar\'',
      '    return this.props.foo;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.foo = "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate props.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.person.name= "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate props.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.person.name.first = "bar"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate props.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.props.person.name.first = "bar"',
      '    this.props.person.name.last = "baz"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not mutate props.',
      line: 3,
      column: 5
    }, {
      message: 'Do not mutate props.',
      line: 4,
      column: 5
    }]
  }
    /**
     * Would be nice to prevent this too
    , {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var that = this;',
        '    that.props.person.name.first = "bar"',
        '    return <div>Hello</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: 'Do not mutate props.'
      }]
    }*/
  ]
});
