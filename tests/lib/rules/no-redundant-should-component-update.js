/**
 * @fileoverview Tests for no-redundant-should-component-update
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-redundant-should-component-update');

const parsers = require('../../helpers/parsers');

const languageOptions = {
  ecmaVersion: 2018,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-redundant-should-component-update', rule, {
  valid: parsers.all([
    {
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      languageOptions,
    },
    {
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `,
      features: ['class fields'],
      languageOptions,
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.Component {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `,
      languageOptions,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        class Foo extends React.PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'noShouldCompUpdate',
          data: { component: 'Foo' },
        },
      ],
      languageOptions,
    },
    {
      code: `
        class Foo extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'noShouldCompUpdate',
          data: { component: 'Foo' },
        },
      ],
      languageOptions,
    },
    {
      code: `
        class Foo extends React.PureComponent {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'noShouldCompUpdate',
          data: { component: 'Foo' },
        },
      ],
      features: ['class fields'],
      languageOptions,
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `,
      errors: [
        {
          messageId: 'noShouldCompUpdate',
          data: { component: 'Bar' },
        },
      ],
      languageOptions,
    },
    {
      code: `
        function Foo() {
          return class Bar extends PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `,
      errors: [
        {
          messageId: 'noShouldCompUpdate',
          data: { component: 'Bar' },
        },
      ],
      languageOptions,
    },
    {
      code: `
        var Foo = class extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `,
      errors: [
        {
          messageId: 'noShouldCompUpdate',
          data: { component: 'Foo' },
        },
      ],
      languageOptions,
    },
  ]),
});
