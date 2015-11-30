/**
 * @fileoverview Tests for jsx-handler-names
 * @author Jake Marsh
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-handler-names');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-handler-names', rule, {
  valid: [{
    code: [
      '<TestComponent onChange={this.handleChange} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      '<TestComponent onChange={this.props.onChange} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      '<TestComponent onChange={this.props.onFoo} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      '<TestComponent isSelected={this.props.isSelected} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      '<TestComponent shouldDisplay={this.state.shouldDisplay} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      '<TestComponent shouldDisplay={arr[0].prop} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      '<TestComponent onChange={this.doSomethingOnChange} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Handler function for onChange prop key must be named handleChange'}]
  }, {
    code: [
      '<TestComponent handleChange={this.handleChange} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Prop key for handleChange must be named onChange'}]
  }, {
    code: [
      '<TestComponent onChange={this.onChange} />'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{message: 'Handler function for onChange prop key must be named handleChange'}]
  }]
});
