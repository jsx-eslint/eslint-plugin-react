/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Yannick Croissant
 * @author Erik Wendel
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-curly-spacing');

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
ruleTester.run('jsx-curly-spacing', rule, {
  valid: parsers.all([
    {
      code: '<App foo={bar} />;',
    },
    {
      code: '<App foo={bar}>{bar}</App>;',
    },
    {
      code: '<App foo={bar}>{ bar }</App>;',
    },
    {
      code: `
        <App foo={
        bar
        }>
        {bar}
        </App>;
      `,
    },
    {
      code: '<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;',
    },
    {
      code: '<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;',
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        }>
        {{ bar: true, baz: true }}
        </App>;
      `,
    },
    {
      code: '<App>{ foo /* comment 1 */ }</App>',
    },
    {
      code: '<App>{ /* comment 1 */ foo }</App>',
    },
    {
      code: '<App foo={bar} />;',
      options: [{ attributes: true }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: true }],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ attributes: true }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ attributes: true }],
    },
    {
      code: '<App foo={bar} />;',
      options: [{ attributes: false }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: false }],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ attributes: false }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ attributes: false }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ attributes: false }],
    },
    {
      code: '<App foo={ { bar: true, baz: true } } />;',
      options: [{ attributes: false }],
    },
    {
      code: '<App>{bar}</App>;',
      options: [{ children: true }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: true }],
    },
    {
      code: '<App>{{ bar: true, baz: true }}</App>;',
      options: [{ children: true }],
    },
    {
      code: `
        <App>{
        { bar: true, baz: true }
        }</App>;
      `,
      options: [{ children: true }],
    },
    {
      code: '<App>{bar}</App>;',
      options: [{ children: false }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: false }],
    },
    {
      code: '<App>{{ bar: true, baz: true }}</App>;',
      options: [{ children: false }],
    },
    {
      code: `
        <App>{
        { bar: true, baz: true }
        }</App>;
      `,
      options: [{ children: false }],
    },
    {
      code: '<App>{ bar }</App>;',
      options: [{ children: false }],
    },
    {
      code: '<App>{ { bar: true, baz: true } }</App>;',
      options: [{ children: false }],
    },
    {
      code: '<App foo={bar} />;',
      options: [{ when: 'never' }],
    },
    {
      code: '<App foo={bar} />;',
      options: [{ when: 'never', allowMultiline: false }],
    },
    {
      code: '<App foo={bar} />;',
      options: [{ when: 'never', allowMultiline: true }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ when: 'never', allowMultiline: true }],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ when: 'never', spacing: { objectLiterals: 'never' } }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ when: 'never', spacing: { objectLiterals: 'never' } }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ when: 'always' }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ when: 'always', allowMultiline: false }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ when: 'always', allowMultiline: true }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ when: 'always', allowMultiline: true }],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ when: 'always', spacing: { objectLiterals: 'never' } }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ when: 'always', spacing: { objectLiterals: 'never' } }],
    },
    {
      code: '<App foo={bar} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
    },
    {
      code: '<App foo={{ bar:baz }} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={ {bar:baz} } />;',
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: { when: 'always', allowMultiline: true } }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: { when: 'never', allowMultiline: true } }],
    },
    {
      code: '<App foo={bar/* comment 2 */} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always', spacing: {} } }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: [{ attributes: { when: 'always', spacing: {} } }],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ attributes: { when: 'always', spacing: { objectLiterals: 'never' } } }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: [{ attributes: { when: 'always', spacing: { objectLiterals: 'never' } } }],
    },
    {
      code: '<App>{bar}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always' } }],
    },
    {
      code: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always', allowMultiline: false } }],
    },
    {
      code: '<App>{{ bar:baz }}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: `
        <App>{
        { bar: true, baz: true }
        }</App>;
      `,
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{ {bar:baz} }</App>;',
      options: [{ children: { when: 'always' } }],
    },
    {
      code: `
        <App>{
        { bar: true, baz: true }
        }</App>;
      `,
      options: [{ children: { when: 'always' } }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: { when: 'always' } }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: { when: 'always', allowMultiline: true } }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: { when: 'never' } }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: { when: 'never', allowMultiline: true } }],
    },
    {
      code: `
        <App>{/* comment 3 */}</App>;
      `,
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{bar/* comment 4 */}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always', spacing: {} } }],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      options: [{ children: { when: 'always', spacing: {} } }],
    },
    {
      code: '<App>{{ bar: true, baz: true }}</App>;',
      options: [{ children: { when: 'always', spacing: { objectLiterals: 'never' } } }],
    },
    {
      code: `
        <App>{
        { bar: true, baz: true }
        }</App>;
      `,
      options: [{ children: { when: 'always', spacing: { objectLiterals: 'never' } } }],
    },
    {
      code: '<App {...bar} />;',
    },
    {
      code: '<App {...bar} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App { ...bar } />;',
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: '<App { ...bar } />;',
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: [{ attributes: { when: 'always', allowMultiline: true } }],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: [{ attributes: { when: 'never', allowMultiline: true } }],
    },
    {
      code: '<App {...bar/* comment 5 */} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={bar} {...baz} />;',
    },
    {
      code: '<App foo={bar} {...baz} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
    },
    {
      code: '<App foo={{ bar:baz }} {...baz} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={ {bar:baz} } { ...baz } />;',
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: `
        <App foo={
        bar
        } {
        ...bar
        } />;
      `,
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: '<App foo={bar/* comment 6 */} {...baz/* comment 7 */} />;',
      options: [{ attributes: { when: 'never' } }],
    },
    {
      code: '<App foo={3} bar={ {a: 2} } />',
      options: [{ attributes: { when: 'never', spacing: { objectLiterals: 'always' } } }],
    },
    {
      code: '<App>{bar/* comment 8 */}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{bar} {baz}</App>;',
    },
    {
      code: '<App>{bar} {baz}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{ bar } { baz }</App>;',
      options: [{ children: { when: 'always' } }],
    },
    {
      code: '<App>{ bar } { baz }</App>;',
      options: [{ children: { when: 'always', allowMultiline: false } }],
    },
    {
      code: '<App>{{ bar:baz }} {baz}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{ {bar:baz} } { baz }</App>;',
      options: [{ children: { when: 'always' } }],
    },
    {
      code: `
        <App>{
        bar
        } {
        bar
        }</App>;
      `,
      options: [{ children: { when: 'always' } }],
    },
    {
      code: '<App>{bar/* comment 9 */} {baz/* comment 10 */}</App>;',
      options: [{ children: { when: 'never' } }],
    },
    {
      code: '<App>{3} { {a: 2} }</App>',
      options: [{ children: { when: 'never', spacing: { objectLiterals: 'always' } } }],
    },
    {
      code: '<App foo={ bar }>{bar}</App>',
      options: [{ attributes: { when: 'always' } }],
    },
    {
      code: `
        <App foo={ 42 } { ...bar } baz={{ 4: 2 }}>
        {foo} {{ bar: baz }}
        </App>
      `,
      options: [
        {
          when: 'never',
          attributes: { when: 'always', spacing: { objectLiterals: 'never' } },
          children: true,
        },
      ],
    },
    {
      code: `
        <App foo={42} {...bar} baz={ { 4: 2 } }>
        {foo} { { bar: baz } }
        </App>
      `,
      options: [
        {
          when: 'never',
          spacing: { objectLiterals: 'always' },
          attributes: true,
          children: { when: 'never' },
        },
      ],
    },
    {
      code: `
        <App foo={42} {...bar} baz={ { 4: 2 } }>
        {foo} { { bar: baz } }
        </App>
      `,
      options: [
        {
          spacing: { objectLiterals: 'always' },
          attributes: { when: 'never', spacing: { objectLiterals: 'always' } },
          children: { when: 'never' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      options: ['never'],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: ['never', { spacing: { objectLiterals: 'never' } }],
    },
    {
      code: '<App foo={ bar } />;',
      options: ['always'],
    },
    {
      code: '<App foo={ bar } />;',
      options: ['always', { allowMultiline: false }],
    },
    {
      code: '<App foo={{ bar:baz }} />;',
      options: ['never'],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: ['never'],
    },
    {
      code: '<App foo={ {bar:baz} } />;',
      options: ['always'],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: ['always'],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: ['always'],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: ['never'],
    },
    {
      code: `
        <App>{/* comment 11 */}</App>;
      `,
      options: ['never'],
    },
    {
      code: '<App foo={bar/* comment 12 */} />;',
      options: ['never'],
    },
    {
      code: '<App foo={ bar } />;',
      options: ['always', { spacing: {} }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: ['always', { spacing: {} }],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      options: ['always', { spacing: { objectLiterals: 'never' } }],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      options: ['always', { allowMultiline: true }],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      options: ['always', { spacing: { objectLiterals: 'never' } }],
    },
    {
      code: '<App {...bar} />;',
      options: ['never'],
    },
    {
      code: '<App { ...bar } />;',
      options: ['always'],
    },
    {
      code: '<App { ...bar } />;',
      options: ['always', { allowMultiline: false }],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: ['always'],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: ['always'],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      options: ['never'],
    },
    {
      code: '<App {...bar/* comment 13 */} />;',
      options: ['never'],
    },
    {
      code: '<App foo={bar} {...baz} />;',
      options: ['never'],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      options: ['always'],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      options: ['always', { allowMultiline: false }],
    },
    {
      code: '<App foo={{ bar:baz }} {...baz} />;',
      options: ['never'],
    },
    {
      code: '<App foo={ {bar:baz} } { ...baz } />;',
      options: ['always'],
    },
    {
      code: `
        <App foo={
        bar
        } {
        ...bar
        }/>;
      `,
      options: ['always'],
    },
    {
      code: '<App foo={bar/* comment 14 */} {...baz/* comment 15 */} />;',
      options: ['never'],
    },
    {
      code: '<App foo={3} bar={ {a: 2} } />',
      options: ['never', { spacing: { objectLiterals: 'always' } }],
    },
    {
      code: '<App foo={ bar }>{bar}</App>',
      options: ['always'],
    },
    {
      code: `
        <App>{\`
        text
        \`}</App>
      `,
      options: [{ children: { when: 'never', allowMultiline: false } }],
    },
    {
      code: '<>{bar} {baz}</>;',
      features: ['fragment'],
    },
    {
      code: '<div onLayout={() => { /* dummy callback to fix android bug with component measuring */ }} />',
    },
  ]),

  invalid: parsers.all([
    {
      code: '<App foo={ bar }>{bar}</App>;',
      output: '<App foo={bar}>{bar}</App>;',
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar }>{ bar }</App>;',
      output: '<App foo={bar}>{ bar }</App>;',
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } }>{{ bar: true, baz: true }}</App>;',
      output: '<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;',
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } }>{ { bar: true, baz: true } }</App>;',
      output: '<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;',
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: [{ attributes: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } } />;',
      output: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ attributes: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar }</App>;',
      output: '<App>{bar}</App>;',
      options: [{ children: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<>{ bar }</>;',
      output: '<>{bar}</>;',
      features: ['fragment'],
      options: [{ children: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ { bar: true, baz: true } }</App>;',
      output: '<App>{{ bar: true, baz: true }}</App>;',
      options: [{ children: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: [{ when: 'never' }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={bar} />;
      `,
      options: [{ when: 'never', allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } } />;',
      output: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ when: 'never', spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={{ bar: true, baz: true }} />;
      `,
      options: [{ when: 'never', allowMultiline: false, spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      output: '<App foo={ { bar: true, baz: true } } />;',
      options: [{ when: 'never', spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={ { bar: true, baz: true } } />;
      `,
      options: [{ when: 'never', allowMultiline: false, spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ when: 'always' }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={ bar } />;
      `,
      options: [{ when: 'always', allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } } />;',
      output: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ when: 'always', spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={{ bar: true, baz: true }} />;
      `,
      options: [{ when: 'always', allowMultiline: false, spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      output: '<App foo={ { bar: true, baz: true } } />;',
      options: [{ when: 'always', spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={ { bar: true, baz: true } } />;
      `,
      options: [{ when: 'always', allowMultiline: false, spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: [{ attributes: true, when: 'never' }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={bar} />;
      `,
      options: [{ attributes: true, when: 'never', allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } } />;',
      output: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ attributes: true, when: 'never', spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      output: '<App foo={ { bar: true, baz: true } } />;',
      options: [{ attributes: true, when: 'never', spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: true, when: 'always' }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={ bar } />;
      `,
      options: [{ attributes: true, when: 'always', allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          data: { token: '}' },
          messageId: 'noNewlineBefore',
        },
      ],
    },
    {
      code: '<App foo={ { bar: true, baz: true } } />;',
      output: '<App foo={{ bar: true, baz: true }} />;',
      options: [{ attributes: true, when: 'always', spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={{ bar: true, baz: true }} />;',
      output: '<App foo={ { bar: true, baz: true } } />;',
      options: [{ attributes: true, when: 'always', spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: [{ attributes: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        }],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar } />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={ bar} />;',
      output: '<App foo={bar} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={bar } />;',
      output: '<App foo={bar} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={bar} />;
      `,
      options: [{ attributes: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={ bar } />;
      `,
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always', spacing: {} } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar} />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always', spacing: {} } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar } />;',
      output: '<App foo={ bar } />;',
      options: [{ attributes: { when: 'always', spacing: {} } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={ {bar: true, baz: true} } />;',
      output: '<App foo={{bar: true, baz: true}} />;',
      options: [{ attributes: { when: 'always', spacing: { objectLiterals: 'never' } } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar }</App>;',
      output: '<App>{bar}</App>;',
      options: [{ children: true, when: 'never' }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      output: `
        <App>{bar}</App>;
      `,
      options: [{ children: true, when: 'never', allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ { bar: true, baz: true } }</App>;',
      output: '<App>{{ bar: true, baz: true }}</App>;',
      options: [{ children: true, when: 'never', spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{{ bar: true, baz: true }}</App>;',
      output: '<App>{ { bar: true, baz: true } }</App>;',
      options: [{ children: true, when: 'never', spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar}</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: true, when: 'always' }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      output: `
        <App>{ bar }</App>;
      `,
      options: [{ children: true, when: 'always', allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ { bar: true, baz: true } }</App>;',
      output: '<App>{{ bar: true, baz: true }}</App>;',
      options: [{ children: true, when: 'always', spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{{ bar: true, baz: true }}</App>;',
      output: '<App>{ { bar: true, baz: true } }</App>;',
      options: [{ children: true, when: 'always', spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar }</App>;',
      output: '<App>{bar}</App>;',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar }</App>;',
      output: '<App>{bar}</App>;',
      options: [{ children: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar}</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar}</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar}</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar }</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App>{ bar}</App>;',
      output: '<App>{bar}</App>;',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App>{bar }</App>;',
      output: '<App>{bar}</App>;',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      output: `
        <App>{bar}</App>;
      `,
      options: [{ children: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{
        bar
        }</App>;
      `,
      output: `
        <App>{ bar }</App>;
      `,
      options: [{ children: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar}</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always', spacing: {} } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar}</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always', spacing: {} } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar }</App>;',
      output: '<App>{ bar }</App>;',
      options: [{ children: { when: 'always', spacing: {} } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App>{ {bar: true, baz: true} }</App>;',
      output: '<App>{{bar: true, baz: true}}</App>;',
      options: [{ children: { when: 'always', spacing: { objectLiterals: 'never' } } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App { ...bar } />;',
      output: '<App {...bar} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App { ...bar } />;',
      output: '<App {...bar} />;',
      options: [{ attributes: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App {...bar} />;',
      output: '<App { ...bar } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App {...bar} />;',
      output: '<App { ...bar } />;',
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App { ...bar} />;',
      output: '<App { ...bar } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App {...bar } />;',
      output: '<App { ...bar } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App { ...bar} />;',
      output: '<App {...bar} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App {...bar } />;',
      output: '<App {...bar} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      output: `
        <App {...bar} />;
      `,
      options: [{ attributes: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      output: `
        <App { ...bar } />;
      `,
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      output: '<App foo={bar} {...baz} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      output: '<App foo={bar} {...baz} />;',
      options: [{ attributes: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} {...baz} />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} {...baz} />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar} { ...baz} />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar } {...baz } />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={ bar} { ...baz} />;',
      output: '<App foo={bar} {...baz} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={bar } {...baz } />;',
      output: '<App foo={bar} {...baz} />;',
      options: [{ attributes: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } {
        ...baz
        } />;
      `,
      output: `
        <App foo={bar} {...baz} />;
      `,
      options: [{ attributes: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } {
        ...baz
        } />;
      `,
      output: `
        <App foo={ bar } { ...baz } />;
      `,
      options: [{ attributes: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ 3 } bar={{a: 2}} />',
      output: '<App foo={3} bar={ {a: 2} } />',
      options: [{ attributes: { when: 'never', spacing: { objectLiterals: 'always' } } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ foo /* comment 16 */ } />',
      output: '<App foo={foo /* comment 16 */} />',
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={foo /* comment 17 */} />',
      output: '<App foo={ foo /* comment 17 */ } />',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ /* comment 18 */ foo } />',
      output: '<App foo={/* comment 18 */ foo} />',
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={/* comment 19 */ foo} />',
      output: '<App foo={ /* comment 19 */ foo } />',
      options: [{ attributes: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar } { baz }</App>;',
      output: '<App>{bar} {baz}</App>;',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar } { baz }</App>;',
      output: '<App>{bar} {baz}</App>;',
      options: [{ children: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar} {baz}</App>;',
      output: '<App>{ bar } { baz }</App>;',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar} {baz}</App>;',
      output: '<App>{ bar } { baz }</App>;',
      options: [{ children: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ bar} { baz}</App>;',
      output: '<App>{ bar } { baz }</App>;',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{bar } {baz }</App>;',
      output: '<App>{ bar } { baz }</App>;',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App>{ bar} { baz}</App>;',
      output: '<App>{bar} {baz}</App>;',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App>{bar } {baz }</App>;',
      output: '<App>{bar} {baz}</App>;',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{
        bar
        } {
        baz
        }</App>;
      `,
      output: `
        <App>{bar} {baz}</App>;
      `,
      options: [{ children: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{
        bar
        } {
        baz
        }</App>;
      `,
      output: `
        <App>{ bar } { baz }</App>;
      `,
      options: [{ children: { when: 'always', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ 3 } bar={{a: 2}}</App>',
      output: '<App>{3} bar={ {a: 2} }</App>',
      options: [{ children: { when: 'never', spacing: { objectLiterals: 'always' } } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{foo /* comment 20 */}</App>',
      output: '<App>{ foo /* comment 20 */ }</App>',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{/* comment 21 */ foo}</App>',
      output: '<App>{ /* comment 21 */ foo }</App>',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } />;',
      output: '<App foo={bar} />;',
      options: ['never', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={{ bar: true, baz: true }} />;
      `,
      options: ['never', { allowMultiline: false, spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={ { bar: true, baz: true } } />;
      `,
      options: ['never', { allowMultiline: false, spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={{ bar: true, baz: true }} />;
      `,
      options: ['always', { allowMultiline: false, spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `,
      output: `
        <App foo={ { bar: true, baz: true } } />;
      `,
      options: ['always', { allowMultiline: false, spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: ['always', { allowMultiline: false }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar} />;',
      output: '<App foo={ bar } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar } />;',
      output: '<App foo={ bar } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={ bar} />;',
      output: '<App foo={bar} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={bar } />;',
      output: '<App foo={bar} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={bar} />;
      `,
      options: ['never', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } />;
      `,
      output: `
        <App foo={ bar } />;
      `,
      options: ['always', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} />;',
      output: '<App foo={ bar } />;',
      options: ['always', { spacing: {} }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar} />;',
      output: '<App foo={ bar } />;',
      options: ['always', { spacing: {} }],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar } />;',
      output: '<App foo={ bar } />;',
      options: ['always', { spacing: {} }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={ {bar: true, baz: true} } />;',
      output: '<App foo={{bar: true, baz: true}} />;',
      options: ['always', { spacing: { objectLiterals: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App { ...bar } />;',
      output: '<App {...bar} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App { ...bar } />;',
      output: '<App {...bar} />;',
      options: ['never', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App {...bar} />;',
      output: '<App { ...bar } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App {...bar} />;',
      output: '<App { ...bar } />;',
      options: ['always', { allowMultiline: false }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App { ...bar} />;',
      output: '<App { ...bar } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App {...bar } />;',
      output: '<App { ...bar } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App { ...bar} />;',
      output: '<App {...bar} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App {...bar } />;',
      output: '<App {...bar} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      output: `
        <App {...bar} />;
      `,
      options: ['never', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App {
        ...bar
        } />;
      `,
      output: `
        <App { ...bar } />;
      `,
      options: ['always', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      output: '<App foo={bar} {...baz} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar } { ...baz } />;',
      output: '<App foo={bar} {...baz} />;',
      options: ['never', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} {...baz} />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar} {...baz} />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: ['always', { allowMultiline: false }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ bar} { ...baz} />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={bar } {...baz } />;',
      output: '<App foo={ bar } { ...baz } />;',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={ bar} { ...baz} />;',
      output: '<App foo={bar} {...baz} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App foo={bar } {...baz } />;',
      output: '<App foo={bar} {...baz} />;',
      options: ['never'],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } {
        ...baz
        } />;
      `,
      output: `
        <App foo={bar} {...baz} />;
      `,
      options: ['never', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App foo={
        bar
        } {
        ...baz
        } />;
      `,
      output: `
        <App foo={ bar } { ...baz } />;
      `,
      options: ['always', { allowMultiline: false }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={ 3 } bar={{a: 2}} />',
      output: '<App foo={3} bar={ {a: 2} } />',
      options: ['never', { spacing: { objectLiterals: 'always' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={foo /* comment 22 */} />',
      output: '<App foo={ foo /* comment 22 */ } />',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App foo={/* comment 23 */ foo} />',
      output: '<App foo={ /* comment 23 */ foo } />',
      options: ['always'],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{/*comment24*/ }</App>',
      output: '<App>{/*comment24*/}</App>',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: '<App>{ /*comment25*/}</App>',
      output: '<App>{/*comment25*/}</App>',
      options: [{ children: { when: 'never' } }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: '<App>{/*comment26*/}</App>',
      output: '<App>{ /*comment26*/ }</App>',
      options: [{ children: { when: 'always' } }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>
        { /* comment 27 */ }
        </App>;
      `,
      output: `
        <App>
        {/* comment 27 */}
        </App>;
      `,
      options: [{ when: 'never', children: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>
        {/* comment 28 */}
        </App>;
      `,
      output: `
        <App>
        { /* comment 28 */ }
        </App>;
      `,
      options: [{ when: 'always', children: true }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>
        {/*comment29*/
        }
        </App>
      `,
      output: `
        <App>
        {/*comment29*/}
        </App>
      `,
      options: [{ children: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>
        {
        /*comment30*/}
        </App>
      `,
      output: `
        <App>
        {/*comment30*/}
        </App>
      `,
      options: [{ children: { when: 'never', allowMultiline: false } }],
      errors: [
        {
          messageId: 'noNewlineAfter',
          data: { token: '{' },
        },
      ],
    },
    {
      code: `
        <App>{ /* comment 31 */
        bar
        } {
        baz
        /* comment 32 */ }</App>;
      `,
      output: `
        <App>{/* comment 31 */
        bar
        } {
        baz
        /* comment 32 */}</App>;
      `,
      options: [{ when: 'never', children: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <App>{/* comment 33 */
        bar
        } {
        baz
        /* comment 33 */}</App>;
      `,
      output: `
        <App>{ /* comment 33 */
        bar
        } {
        baz
        /* comment 33 */ }</App>;
      `,
      options: [{ when: 'always', children: true }],
      errors: [
        {
          messageId: 'spaceNeededAfter',
          data: { token: '{' },
        },
        {
          messageId: 'spaceNeededBefore',
          data: { token: '}' },
        },
      ],
    },
    {
      code: `
        <div className={ this.state.renderInfo ? "infoPanel col-xs-12" : "unToggled col-xs-12" } />
      `,
      output: `
        <div className={this.state.renderInfo ? "infoPanel col-xs-12" : "unToggled col-xs-12"} />
      `,
      options: ['never', { allowMultiline: true }],
      errors: [
        {
          messageId: 'noSpaceAfter',
          data: { token: '{' },
        },
        {
          messageId: 'noSpaceBefore',
          data: { token: '}' },
        },
      ],
    },
  ]),
});
