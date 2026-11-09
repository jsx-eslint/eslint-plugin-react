/**
 * @fileoverview Tests for jsx-handler-names
 * @author Jake Marsh
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
    {
      code: '<ComponentFromOtherLibraryBar customPropNameBar={handleSomething} />;',
      options: [{ checkLocalVariables: true, ignoreComponentNames: ['ComponentFromOtherLibraryBar'] }],
    },
    {
      code: `
        function App() {
          return (
            <div>
              <MyLibInput customPropNameBar={handleSomething} />;
              <MyLibCheckbox customPropNameBar={handleSomething} />;
              <MyLibButtom customPropNameBar={handleSomething} />;
            </div>
          )
        }
      `,
      options: [{ checkLocalVariables: true, ignoreComponentNames: ['MyLib*'] }],
    },
    {
      code: '<A.TestComponent customPropNameBar={handleSomething} />',
      options: [{ checkLocalVariables: true, ignoreComponentNames: ['A.TestComponent'] }],
    },
    {
      code: `
        function App() {
          return (
            <div>
              <A.MyLibInput customPropNameBar={handleSomething} />;
              <A.MyLibCheckbox customPropNameBar={handleSomething} />;
              <A.MyLibButtom customPropNameBar={handleSomething} />;
            </div>
          )
        }
      `,
      options: [{ checkLocalVariables: true, ignoreComponentNames: ['A.MyLib*'] }],
    },
    {
      // a conditional handler is checked branch by branch; `undefined` is not a handler
      code: '<TestComponent onChange={isDisabled ? undefined : this.handleChange} />',
    },
    {
      code: '<TestComponent onChange={isDisabled ? null : this.handleChange} />',
    },
    {
      code: '<TestComponent onChange={isDisabled ? void 0 : this.handleChange} />',
    },
    {
      code: '<TestComponent onChange={isDisabled ? this.handleDisabledChange : this.handleChange} />',
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : this.props.onChange} />',
    },
    {
      code: `
        <TestComponent
          onChange={
            isDisabled
              ? undefined
              : this.handleChange
          } />
      `,
    },
    {
      // nested conditionals are walked too
      code: '<TestComponent onChange={isDisabled ? undefined : isAdmin ? this.handleAdminChange : this.handleChange} />',
    },
    {
      // local variables are still only checked with `checkLocalVariables`
      code: '<TestComponent onChange={isDisabled ? undefined : takeCareOfChange} />',
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : handleChange} />',
      options: [{ checkLocalVariables: true }],
    },
    {
      // inline functions are still only checked with `checkInlineFunction`
      code: '<TestComponent onChange={isDisabled ? undefined : () => this.takeCareOfChange()} />',
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : () => this.handleChange()} />',
      options: [{ checkInlineFunction: true }],
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : (event) => handleChange(event)} />',
      options: [{ checkInlineFunction: true, checkLocalVariables: true }],
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : this.onChange} />',
      options: [{ eventHandlerPrefix: 'on' }],
    },
    {
      code: '<TestComponent whenChange={isDisabled ? undefined : this.handleChange} />',
      options: [{ eventHandlerPropPrefix: 'when' }],
    },
    {
      // `ref` and ignored components are skipped for conditional handlers as well
      code: '<TestComponent ref={isDisabled ? undefined : this.someRef} />',
    },
    {
      code: '<MyLibInput onChange={isDisabled ? undefined : this.takeCareOfChange} />',
      options: [{ ignoreComponentNames: ['MyLib*'] }],
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
      code: '<TestComponent2 only={this.handleChange} />',
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
    {
      code: `
        function App() {
          return (
            <div>
              <MyLibInput customPropNameBar={handleInput} />;
              <MyLibCheckbox customPropNameBar={handleCheckbox} />;
              <MyLibButtom customPropNameBar={handleButton} />;
            </div>
          )
        }
      `,
      options: [{ checkLocalVariables: true, ignoreComponentNames: ['MyLibrary*'] }],
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleInput', handlerPropPrefix: 'on' },
        },
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleCheckbox', handlerPropPrefix: 'on' },
        },
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleButton', handlerPropPrefix: 'on' },
        },
      ],
    },
    {
      code: '<A.TestComponent onChange={onChange} />',
      options: [{ checkLocalVariables: true, ignoreComponentNames: ['B.TestComponent', 'TestComponent', 'Test*'] }],
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      // a badly named handler is reported even when it sits in a conditional branch
      code: '<TestComponent onChange={isDisabled ? undefined : this.takeCareOfChange} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
          line: 1,
          column: 51,
        },
      ],
    },
    {
      code: '<TestComponent onChange={isDisabled ? this.takeCareOfChange : this.handleChange} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
          column: 39,
        },
      ],
    },
    {
      // every offending branch is reported on its own
      code: '<TestComponent onChange={isDisabled ? this.doNothing : this.doSomething} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
          column: 39,
        },
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
          column: 56,
        },
      ],
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : isAdmin ? this.handleAdminChange : this.changed} />',
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
          column: 86,
        },
      ],
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : takeCareOfChange} />',
      options: [{ checkLocalVariables: true }],
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : () => this.takeCareOfChange()} />',
      options: [{ checkInlineFunction: true }],
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'handle' },
        },
      ],
    },
    {
      code: '<TestComponent onChange={isDisabled ? undefined : this.handleChange} />',
      options: [{ eventHandlerPrefix: 'on' }],
      errors: [
        {
          messageId: 'badHandlerName',
          data: { propKey: 'onChange', handlerPrefix: 'on' },
        },
      ],
    },
    {
      // a correctly named handler on a non-`on*` prop is reported from inside a conditional, too
      code: '<TestComponent change={isDisabled ? undefined : this.handleChange} />',
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'on' },
        },
      ],
    },
    {
      code: '<TestComponent change={isDisabled ? undefined : handleChange} />',
      options: [{ checkLocalVariables: true }],
      errors: [
        {
          messageId: 'badPropKey',
          data: { propValue: 'handleChange', handlerPropPrefix: 'on' },
        },
      ],
    },
  ]),
});
