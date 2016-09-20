/**
 * @fileoverview Prevent usage of this.state within setState
 * @author Rolf Erik Lekang
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-access-state-in-setstate');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-access-state-in-setstate', rule, {
  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  onClick: function() {',
      '    this.setState(state => ({value: state.value + 1}))',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  onClick: function() {',
      '    this.setState({value: this.state.value + 1})',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Use callback in setState when referencing the previous state.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  onClick: function() {',
      '    this.setState(() => ({value: this.state.value + 1}))',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Use callback in setState when referencing the previous state.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  onClick: function() {',
      '    var nextValue = this.state.value + 1',
      '    this.setState({value: nextValue})',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Use callback in setState when referencing the previous state.'
    }]
  }, {
    code: [
      'function nextState(state) {',
      '  return {value: state.value + 1}',
      '}',
      'var Hello = React.createClass({',
      '  onClick: function() {',
      '    this.setState(nextState(this.state))',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Use callback in setState when referencing the previous state.'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  nextState: function() {',
      '    return {value: this.state.value + 1}',
      '  },',
      '  onClick: function() {',
      '    this.setState(nextState())',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Use callback in setState when referencing the previous state.'
    }]
  }]
});
