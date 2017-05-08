/**
 * @fileoverview Prevent string definitions for references and prevent referencing this.refs
 * @author Tom Hastjarjanto
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-string-refs');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-refs', rule, {

  valid: [{
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '     var component = this.hello;',
      '  },',
      '  render: function() {',
      '    return <div ref={c => this.hello = c}>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }
  ],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '     var component = this.refs.hello;',
      '  },',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Using this.refs is deprecated.'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div ref="hello">Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div ref={\'hello\'}>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '     var component = this.refs.hello;',
      '  },',
      '  render: function() {',
      '    return <div ref="hello">Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Using this.refs is deprecated.'
    }, {
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }]
});
