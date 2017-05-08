/**
 * @fileoverview Prevent usage of isMounted
 * @author Joe Lencioni
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-is-mounted');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
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

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-is-mounted', rule, {

  valid: [{
    code: [
      'var Hello = function() {',
      '};'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someFunc = this.isMounted;',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
      '    if (!this.isMounted()) {',
      '      return;',
      '    }',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use isMounted'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  someMethod: function() {',
      '    if (!this.isMounted()) {',
      '      return;',
      '    }',
      '  },',
      '  render: function() {',
      '    return <div onClick={this.someMethod.bind(this)}>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use isMounted'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  someMethod() {',
      '    if (!this.isMounted()) {',
      '      return;',
      '    }',
      '  }',
      '  render() {',
      '    return <div onClick={this.someMethod.bind(this)}>Hello</div>;',
      '  }',
      '};'
    ].join('\n'),
    errors: [{
      message: 'Do not use isMounted'
    }]
  }]
});
