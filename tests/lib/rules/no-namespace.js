/**
 * @fileoverview Tests for jsx-no-namespace
 * @author Yacine Hmito
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-namespace');

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
ruleTester.run('no-namespace', rule, {
  valid: parsers.all([
    {
      code: '<testcomponent />',
    },
    {
      code: 'React.createElement("testcomponent")',
    },
    {
      code: '<testComponent />',
    },
    {
      code: 'React.createElement("testComponent")',
    },
    {
      code: '<test_component />',
    },
    {
      code: 'React.createElement("test_component")',
    },
    {
      code: '<TestComponent />',
    },
    {
      code: 'React.createElement("TestComponent")',
    },
    {
      code: '<object.testcomponent />',
    },
    {
      code: 'React.createElement("object.testcomponent")',
    },
    {
      code: '<object.testComponent />',
    },
    {
      code: 'React.createElement("object.testComponent")',
    },
    {
      code: '<object.test_component />',
    },
    {
      code: 'React.createElement("object.test_component")',
    },
    {
      code: '<object.TestComponent />',
    },
    {
      code: 'React.createElement("object.TestComponent")',
    },
    {
      code: '<Object.testcomponent />',
    },
    {
      code: 'React.createElement("Object.testcomponent")',
    },
    {
      code: '<Object.testComponent />',
    },
    {
      code: 'React.createElement("Object.testComponent")',
    },
    {
      code: '<Object.test_component />',
    },
    {
      code: 'React.createElement("Object.test_component")',
    },
    {
      code: '<Object.TestComponent />',
    },
    {
      code: 'React.createElement("Object.TestComponent")',
    },
    {
      code: 'React.createElement(null)',
    },
    {
      code: 'React.createElement(true)',
    },
    {
      code: 'React.createElement({})',
    },
  ]),

  invalid: parsers.all([
    {
      code: '<ns:testcomponent />',
      errors: [{ message: 'React component ns:testcomponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("ns:testcomponent")',
      errors: [{ message: 'React component ns:testcomponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<ns:testComponent />',
      errors: [{ message: 'React component ns:testComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("ns:testComponent")',
      errors: [{ message: 'React component ns:testComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<ns:test_component />',
      errors: [{ message: 'React component ns:test_component must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("ns:test_component")',
      errors: [{ message: 'React component ns:test_component must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<ns:TestComponent />',
      errors: [{ message: 'React component ns:TestComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("ns:TestComponent")',
      errors: [{ message: 'React component ns:TestComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:testcomponent />',
      errors: [{ message: 'React component Ns:testcomponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("Ns:testcomponent")',
      errors: [{ message: 'React component Ns:testcomponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:testComponent />',
      errors: [{ message: 'React component Ns:testComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("Ns:testComponent")',
      errors: [{ message: 'React component Ns:testComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:test_component />',
      errors: [{ message: 'React component Ns:test_component must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("Ns:test_component")',
      errors: [{ message: 'React component Ns:test_component must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: '<Ns:TestComponent />',
      errors: [{ message: 'React component Ns:TestComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
    {
      code: 'React.createElement("Ns:TestComponent")',
      errors: [{ message: 'React component Ns:TestComponent must not be in a namespace, as React does not support them' }],
      features: ['jsx namespace'],
    },
  ]),
});
