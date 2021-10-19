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
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-handler-names', rule, {
  valid: parsers.all([
    {
      code: '<TestComponent onChange={this.handleChange} />',
    },
    {
      // TODO: make this an invalid test
      code: '<TestComponent onChange={this.handle123Change} />',
    },
    {
      code: '<TestComponent onChange={this.props.onChange} />',
    },
    {
      code: `
        <TestComponent
          onChange={
            this
              .handleChange
          } />
      `,
    },
    {
      code: `
        <TestComponent
          onChange={
            this
              .props
              .handleChange
          } />
      `,
    },
    {
      code: '<TestComponent onChange={handleChange} />',
      options: [{ checkLocalVariables: true }],
    },
    {
      code: '<TestComponent onChange={takeCareOfChange} />',
      options: [{ checkLocalVariables: false }],
    },
    {
      code: '<TestComponent onChange={event => window.alert(event.target.value)} />',
      options: [{ checkInlineFunction: false }],
    },
    {
      code: '<TestComponent onChange={() => handleChange()} />',
      options: [
        {
          checkInlineFunction: true,
          checkLocalVariables: true,
        },
      ],
    },
    {
      code: '<TestComponent onChange={() => this.handleChange()} />',
      options: [{ checkInlineFunction: true }],
    },
    {
      code: '<TestComponent onChange={() => 42} />',
    },
    {
      code: '<TestComponent onChange={this.props.onFoo} />',
    },
    {
      code: '<TestComponent isSelected={this.props.isSelected} />',
    },
    {
      code: '<TestComponent shouldDisplay={this.state.shouldDisplay} />',
    },
    {
      code: '<TestComponent shouldDisplay={arr[0].prop} />',
    },
    {
      code: '<TestComponent onChange={props.onChange} />',
    },
    {
      code: '<TestComponent ref={this.handleRef} />',
    },
    {
      code: '<TestComponent ref={this.somethingRef} />',
    },
    {
      code: '<TestComponent test={this.props.content} />',
      options: [
        {
          eventHandlerPrefix: 'on',
          eventHandlerPropPrefix: 'on',
        },
      ],
    },
    {
      code: '<TestComponent onChange={props::handleChange} />',
      features: ['bind operator'],
    },
    {
      code: '<TestComponent onChange={::props.onChange} />',
      features: ['bind operator'],
    },
    {
      code: '<TestComponent onChange={props.foo::handleChange} />',
      features: ['bind operator'],
    },
    {
      code: '<TestComponent onChange={() => props::handleChange()} />',
      features: ['bind operator'],
      options: [{ checkInlineFunction: true }],
    },
    {
      code: '<TestComponent onChange={() => ::props.onChange()} />',
      features: ['bind operator'],
      options: [{ checkInlineFunction: true }],
    },
    {
      code: '<TestComponent onChange={() => props.foo::handleChange()} />',
      features: ['bind operator'],
      options: [{ checkInlineFunction: true }],
    },
    {
      code: '<TestComponent only={this.only} />',
    },
    {
      code: '<TestComponent onChange={this.someChange} />',
      options: [
        {
          eventHandlerPrefix: false,
          eventHandlerPropPrefix: 'on',
        },
      ],
    },
    {
      code: '<TestComponent somePrefixChange={this.someChange} />',
      options: [
        {
          eventHandlerPrefix: false,
          eventHandlerPropPrefix: 'somePrefix',
        },
      ],
    },
    {
      code: '<TestComponent someProp={this.handleChange} />',
      options: [{ eventHandlerPropPrefix: false }],
    },
    {
      code: '<TestComponent someProp={this.somePrefixChange} />',
      options: [
        {
          eventHandlerPrefix: 'somePrefix',
          eventHandlerPropPrefix: false,
        },
      ],
    },
    {
      code: '<TestComponent someProp={props.onChange} />',
      options: [{ eventHandlerPropPrefix: false }],
    },
  ]),

  invalid: parsers.all([
    {
      code: '<TestComponent onChange={this.doSomethingOnChange} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={this.handlerChange} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={this.handle} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={this.handle2} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={this.handl3Change} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={this.handle4change} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={takeCareOfChange} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
      options: [{ checkLocalVariables: true }],
    },
    {
      code: '<TestComponent onChange={() => this.takeCareOfChange()} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
      options: [{ checkInlineFunction: true }],
    },
    {
      code: '<TestComponent only={this.handleChange} />',
      errors: [
        { message: 'Prop key for handleChange must begin with \'on\'' },
      ],
    },
    {
      code: '<TestComponent only={this.handleChange} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'on' },
        },
      ],
    },
    {
      code: '<TestComponent handleChange={this.handleChange} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'on' },
        },
      ],
    },
    {
      code: '<TestComponent whenChange={handleChange} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'on' },
        },
      ],
      options: [{ checkLocalVariables: true }],
    },
    {
      code: '<TestComponent whenChange={() => handleChange()} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'on' },
        },
      ],
      options: [
        {
          checkInlineFunction: true,
          checkLocalVariables: true,
        },
      ],
    },
    {
      code: '<TestComponent onChange={handleChange} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'when' },
        },
      ],
      options: [
        {
          checkLocalVariables: true,
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'when',
        },
      ],
    },
    {
      code: '<TestComponent onChange={() => handleChange()} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'when' },
        },
      ],
      options: [
        {
          checkInlineFunction: true,
          checkLocalVariables: true,
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'when',
        },
      ],
    },
    {
      code: '<TestComponent onChange={this.onChange} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={props::onChange} />',
      features: ['bind operator'],
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={props.foo::onChange} />',
      features: ['bind operator'],
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
  ]),
});
