/**
 * @fileoverview Ensure proper position of the first property in JSX
 * @author Joachim Seminck
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-first-prop-new-line');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
  jsx: true,
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-first-prop-new-line', rule, {
  valid: parsers.all([
    {
      code: '<Foo />',
      options: ['never'],
    },
    {
      code: '<Foo prop="bar" />',
      options: ['never'],
    },
    {
      code: '<Foo {...this.props} />',
      options: ['never'],
    },
    {
      code: '<Foo a a a />',
      options: ['never'],
    },
    {
      code: `
        <Foo a
          b 
        />
      `,
      options: ['never'],
    },
    {
      code: '<Foo />',
      options: ['multiline'],
    },
    {
      code: '<Foo prop="one" />',
      options: ['multiline'],
    },
    {
      code: '<Foo {...this.props} />',
      options: ['multiline'],
    },
    {
      code: '<Foo a a a />',
      options: ['multiline'],
    },
    {
      code: `
        <Foo
          propOne="one"
          propTwo="two"
        />
      `,
      options: ['multiline'],
    },
    {
      code: `
        <Foo
          {...this.props}
          propTwo="two"
        />
      `,
      options: ['multiline'],
    },
    {
      code: `
        <Foo bar />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: `
        <Foo bar baz />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: `
        <Foo prop={{
        }} />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: `
        <Foo 
          foo={{
          }}
          bar
        />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: '<Foo />',
      options: ['always'],
    },
    {
      code: `
        <Foo
          propOne="one"
          propTwo="two"
        />
      `,
      options: ['always'],
    },
    {
      code: `
        <Foo
          {...this.props}
          propTwo="two"
        />
      `,
      options: ['always'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        <Foo propOne="one" propTwo="two" />
      `,
      output: `
        <Foo
propOne="one" propTwo="two" />
      `,
      options: ['always'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
        <Foo propOne="one"
          propTwo="two"
        />
      `,
      output: `
        <Foo
propOne="one"
          propTwo="two"
        />
      `,
      options: ['always'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
        <Foo
          propOne="one"
          propTwo="two"
        />
      `,
      output: `
        <Foo propOne="one"
          propTwo="two"
        />
      `,
      options: ['never'],
      errors: [{ messageId: 'propOnSameLine' }],
    },
    {
      code: `
        <Foo prop={{
        }} />
      `,
      output: `
        <Foo
prop={{
        }} />
      `,
      options: ['multiline'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
        <Foo bar={{
        }} baz />
      `,
      output: `
        <Foo
bar={{
        }} baz />
      `,
      options: ['multiline-multiprop'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
  ]),
});
