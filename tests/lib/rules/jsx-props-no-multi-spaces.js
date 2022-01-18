/**
 * @fileoverview Disallow multiple spaces between inline JSX props
 * @author Adrian Moennich
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const semver = require('semver');
const eslintPkg = require('eslint/package.json');
const rule = require('../../../lib/rules/jsx-props-no-multi-spaces');

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
ruleTester.run('jsx-props-no-multi-spaces', rule, {
  valid: parsers.all([].concat(
    {
      code: `
        <App />
      `,
    },
    {
      code: `
        <App foo />
      `,
    },
    {
      code: `
        <App foo bar />
      `,
    },
    {
      code: `
        <App foo="with  spaces   " bar />
      `,
    },
    {
      code: `
        <App
          foo bar />
      `,
    },
    {
      code: `
        <App
          foo
          bar />
      `,
    },
    {
      code: `
        <App
          foo {...test}
          bar />
      `,
    },
    {
      code: '<App<T> foo bar />',
      features: ['ts', 'no-babel'],
    },
    {
      code: '<Foo.Bar baz="quux" />',
    },
    {
      code: '<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />',
    },
    {
      code: `
        <button
          title="Some button"
          type="button"
        />
      `,
    },
    {
      code: `
        <button
          title="Some button"
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />
      `,
    },
    (semver.satisfies(eslintPkg.version, '> 3') ? [
      {
        code: `
          <button
            title="Some button"
            // this is a comment
            onClick={(value) => {
              console.log(value);
            }}
            type="button"
          />
        `,
      },
      {
        code: `
          <button
            title="Some button"
            // this is a comment
            // this is a second comment
            onClick={(value) => {
              console.log(value);
            }}
            type="button"
          />
        `,
      },
      {
        code: `
          <App
            foo="Some button" // comment
            // comment
            bar=""
          />
        `,
      },
      {
        code: `
          <button
            title="Some button"
            /* this is a multiline comment
                ...
                ... */
            onClick={(value) => {
              console.log(value);
            }}
            type="button"
          />
        `,
      },
    ] : [])
  )),

  invalid: parsers.all([].concat(
    {
      code: `
        <App  foo />
      `,
      output: `
        <App foo />
      `,
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'App', prop2: 'foo' },
        },
      ],
    },
    {
      code: `
        <App foo="with  spaces   "   bar />
      `,
      output: `
        <App foo="with  spaces   " bar />
      `,
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'foo', prop2: 'bar' },
        },
      ],
    },
    {
      code: `
        <App foo  bar />
      `,
      output: `
        <App foo bar />
      `,
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'foo', prop2: 'bar' },
        },
      ],
    },
    {
      code: `
        <App  foo   bar />
      `,
      output: `
        <App foo bar />
      `,
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'App', prop2: 'foo' },
        },
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'foo', prop2: 'bar' },
        },
      ],
    },
    {
      code: `
        <App foo  {...test}  bar />
      `,
      output: `
        <App foo {...test} bar />
      `,
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'foo', prop2: 'test' },
        },
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'test', prop2: 'bar' },
        },
      ],
    },
    {
      code: '<Foo.Bar  baz="quux" />',
      output: '<Foo.Bar baz="quux" />',
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'Foo.Bar', prop2: 'baz' },
        },
      ],
    },
    {
      code: `
        <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh  xyzzy="thud" />
      `,
      output: `
        <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />
      `,
      errors: [
        {
          messageId: 'onlyOneSpace',
          data: { prop1: 'Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh', prop2: 'xyzzy' },
        },
      ],
    },
    {
      code: `
        <button
          title='Some button'

          type="button"
        />
      `,
      errors: [
        {
          messageId: 'noLineGap',
          data: { prop1: 'title', prop2: 'type' },
        },
      ],
    },
    {
      code: `
        <button
          title="Some button"

          onClick={(value) => {
            console.log(value);
          }}

          type="button"
        />
      `,
      errors: [
        {
          messageId: 'noLineGap',
          data: { prop1: 'title', prop2: 'onClick' },
        },
        {
          messageId: 'noLineGap',
          data: { prop1: 'onClick', prop2: 'type' },
        },
      ],
    },
    (semver.satisfies(eslintPkg.version, '> 3') ? [
      {
        code: `
          <button
            title="Some button"
            // this is a comment
            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `,
        errors: [
          {
            messageId: 'noLineGap',
            data: { prop1: 'onClick', prop2: 'type' },
          },
        ],
      },
      {
        code: `
          <button
            title="Some button"
            // this is a comment
            // second comment

            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `,
        errors: [
          {
            messageId: 'noLineGap',
            data: { prop1: 'title', prop2: 'onClick' },
          },
          {
            messageId: 'noLineGap',
            data: { prop1: 'onClick', prop2: 'type' },
          },
        ],
      },
      {
        code: `
          <button
            title="Some button"
            /*this is a
              multiline
              comment
            */

            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `,
        errors: [
          {
            messageId: 'noLineGap',
            data: { prop1: 'title', prop2: 'onClick' },
          },
          {
            messageId: 'noLineGap',
            data: { prop1: 'onClick', prop2: 'type' },
          },
        ],
      },
    ] : [])
  )),
});
