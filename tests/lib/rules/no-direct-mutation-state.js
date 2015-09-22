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

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-direct-mutation-state', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    var obj = {state: {}};',
      '    obj.state.name = "foo";',
      '    return <div>Hello {obj.state.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Hello = "foo";',
      'module.exports = {};'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.state.foo = "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.state.person.name= "bar"',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    this.state.person.name.first = "bar"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }
  /**
   * Would be nice to prevent this too
  , {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    var that = this;',
      '    that.state.person.name.first = "bar"',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Do not mutate state directly. Use setState().'
    }]
  }*/
  ]
});
