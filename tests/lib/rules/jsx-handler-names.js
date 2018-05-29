/**
 * @fileoverview Tests for jsx-handler-names
 * @author Jake Marsh
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-handler-names');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-handler-names', rule, {
  valid: [{
    code: '<TestComponent onChange={this.handleChange} />'
  }, {
    code: '<TestComponent onChange={this.props.onChange} />'
  }, {
    code: '<TestComponent onChange={this.props.onFoo} />'
  }, {
    code: '<TestComponent isSelected={this.props.isSelected} />'
  }, {
    code: '<TestComponent shouldDisplay={this.state.shouldDisplay} />'
  }, {
    code: '<TestComponent shouldDisplay={arr[0].prop} />'
  }, {
    code: '<TestComponent onChange={props.onChange} />'
  }, {
    code: '<TestComponent ref={this.handleRef} />'
  }, {
    code: '<TestComponent ref={this.somethingRef} />'
  }, {
    code: '<TestComponent test={this.props.content} />',
    options: [{
      eventHandlerPrefix: 'on',
      eventHandlerPropPrefix: 'on'
    }]
  }, {
    code: '<TestComponent onChange={props::handleChange} />',
    parser: 'babel-eslint'
  }, {
    code: '<TestComponent onChange={::props.onChange} />',
    parser: 'babel-eslint'
  }, {
    code: '<TestComponent onChange={props.foo::handleChange} />',
    parser: 'babel-eslint'
  }, {
    code: '<TestComponent only={this.only} />'
  }],

  invalid: [{
    code: '<TestComponent onChange={this.doSomethingOnChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={this.handlerChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent only={this.handleChange} />',
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}]
  }, {
    code: '<TestComponent handleChange={this.handleChange} />',
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}]
  }, {
    code: '<TestComponent onChange={this.onChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={props::onChange} />',
    parser: 'babel-eslint',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={props.foo::onChange} />',
    parser: 'babel-eslint',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }]
});
