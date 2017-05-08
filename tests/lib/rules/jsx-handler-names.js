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
ruleTester.run('jsx-handler-names', rule, {
  valid: [{
    code: [
      '<TestComponent onChange={this.handleChange} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent onChange={this.props.onChange} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent onChange={this.props.onFoo} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent isSelected={this.props.isSelected} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent shouldDisplay={this.state.shouldDisplay} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent shouldDisplay={arr[0].prop} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent onChange={props.onChange} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent ref={this.handleRef} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent ref={this.somethingRef} />'
    ].join('\n')
  }, {
    code: [
      '<TestComponent test={this.props.content} />'
    ].join('\n'),
    options: [{
      eventHandlerPrefix: 'on',
      eventHandlerPropPrefix: 'on'
    }]
  }, {
    code: [
      '<TestComponent onChange={props::handleChange} />'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '<TestComponent onChange={::props.onChange} />'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '<TestComponent onChange={props.foo::handleChange} />'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '<TestComponent only={this.only} />'
    ].join('\n')
  }],

  invalid: [{
    code: [
      '<TestComponent onChange={this.doSomethingOnChange} />'
    ].join('\n'),
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: [
      '<TestComponent onChange={this.handlerChange} />'
    ].join('\n'),
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: [
      '<TestComponent only={this.handleChange} />'
    ].join('\n'),
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}]
  }, {
    code: [
      '<TestComponent handleChange={this.handleChange} />'
    ].join('\n'),
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}]
  }, {
    code: [
      '<TestComponent onChange={this.onChange} />'
    ].join('\n'),
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: [
      '<TestComponent onChange={props::onChange} />'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: [
      '<TestComponent onChange={props.foo::onChange} />'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }]
});
