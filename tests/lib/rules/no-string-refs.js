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

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
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
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true
    }
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
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
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
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
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
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
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
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Using this.refs is deprecated.'
    }, {
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }]
});
