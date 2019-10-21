/**
 * @fileoverview Tests for jsx-handler-names
 * @author Jake Marsh
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-handler-names');

const parsers = require('../../helpers/parsers');

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
    code: '<TestComponent onChange={handleChange} />',
    options: [{
      checkLocalVariables: true
    }]
  }, {
    code: '<TestComponent onChange={takeCareOfChange} />',
    options: [{
      checkLocalVariables: false
    }]
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
    parser: parsers.BABEL_ESLINT
  }, {
    code: '<TestComponent onChange={::props.onChange} />',
    parser: parsers.BABEL_ESLINT
  }, {
    code: '<TestComponent onChange={props.foo::handleChange} />',
    parser: parsers.BABEL_ESLINT
  }, {
    code: '<TestComponent only={this.only} />'
  }, {
    code: '<TestComponent onChange={this.someChange} />',
    options: [{
      eventHandlerPrefix: false,
      eventHandlerPropPrefix: 'on'
    }]
  }, {
    code: '<TestComponent somePrefixChange={this.someChange} />',
    options: [{
      eventHandlerPrefix: false,
      eventHandlerPropPrefix: 'somePrefix'
    }]
  }, {
    code: '<TestComponent someProp={this.handleChange} />',
    options: [{
      eventHandlerPropPrefix: false
    }]
  }, {
    code: '<TestComponent someProp={this.somePrefixChange} />',
    options: [{
      eventHandlerPrefix: 'somePrefix',
      eventHandlerPropPrefix: false
    }]
  }, {
    code: '<TestComponent someProp={props.onChange} />',
    options: [{
      eventHandlerPropPrefix: false
    }]
  }],

  invalid: [{
    code: '<TestComponent onChange={this.doSomethingOnChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={this.handlerChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={takeCareOfChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}],
    options: [{
      checkLocalVariables: true
    }]
  }, {
    code: '<TestComponent only={this.handleChange} />',
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}]
  }, {
    code: '<TestComponent handleChange={this.handleChange} />',
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}]
  }, {
    code: '<TestComponent whenChange={handleChange} />',
    errors: [{message: 'Prop key for handleChange must begin with \'on\''}],
    options: [{
      checkLocalVariables: true
    }]
  }, {
    code: '<TestComponent onChange={handleChange} />',
    errors: [{message: 'Prop key for handleChange must begin with \'when\''}],
    options: [{
      checkLocalVariables: true,
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'when'
    }]
  }, {
    code: '<TestComponent onChange={this.onChange} />',
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={props::onChange} />',
    parser: parsers.BABEL_ESLINT,
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }, {
    code: '<TestComponent onChange={props.foo::onChange} />',
    parser: parsers.BABEL_ESLINT,
    errors: [{message: 'Handler function for onChange prop key must begin with \'handle\''}]
  }]
});
