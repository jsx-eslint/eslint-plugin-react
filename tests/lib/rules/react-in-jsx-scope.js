/**
 * @fileoverview Tests for react-in-jsx-scope
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/react-in-jsx-scope');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  react: {
    pragma: 'Foo',
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('react-in-jsx-scope', rule, {
  valid: parsers.all([
    { code: 'var React, App; <App />;' },
    { code: 'var React; <img />;' },
    {
      code: 'var React; <>fragment</>;',
      features: ['fragment'],
    },
    { code: 'var React; <x-gif />;' },
    { code: 'var React, App, a=1; <App attr={a} />;' },
    { code: 'var React, App, a=1; function elem() { return <App attr={a} />; }' },
    {
      code: 'var React, App; <App />;',
    },
    { code: '/** @jsx Foo */ var Foo, App; <App />;' },
    { code: '/** @jsx Foo.Bar */ var Foo, App; <App />;' },
    {
      code: `
        import React from 'react/addons';
        const Button = createReactClass({
          render() {
            return (
              <button {...this.props}>{this.props.children}</button>
            )
          }
        });
        export default Button;
      `,
    },
    {
      code: 'var Foo, App; <App />;',
      settings,
    },
  ]),
  invalid: parsers.all([
    {
      code: 'var App, a = <App />;',
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'React' },
        },
      ],
    },
    {
      code: 'var a = <App />;',
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'React' },
        },
      ],
    },
    {
      code: 'var a = <img />;',
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'React' },
        },
      ],
    },
    {
      code: 'var a = <>fragment</>;',
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'React' },
        },
      ],
    },
    {
      code: '/** @jsx React.DOM */ var a = <img />;',
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'React' },
        },
      ],
    },
    {
      code: '/** @jsx Foo.bar */ var React, a = <img />;',
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'Foo' },
        },
      ],
    },
    {
      code: 'var React, a = <img />;',
      settings,
      errors: [
        {
          messageId: 'notInScope',
          data: { name: 'Foo' },
        },
      ],
    },
  ]),
});
