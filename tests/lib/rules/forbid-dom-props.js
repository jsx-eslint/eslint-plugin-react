/**
 * @fileoverview Tests for forbid-dom-props
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-dom-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('forbid-dom-props', rule, {
  valid: parsers.all([
    {
      code: `
        var First = createReactClass({
          render: function() {
            return <Foo id="foo" />;
          }
        });
      `,
      options: [{ forbid: ['id'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo id="bar" style={{color: "red"}} />;
          }
        });
      `,
      options: [{ forbid: ['style', 'id'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <this.Foo bar="baz" />;
          }
        });
      `,
      options: [{ forbid: ['id'] }],
    },
    {
      code: `
        class First extends createReactClass {
          render() {
            return <this.foo id="bar" />;
          }
        }
      `,
      options: [{ forbid: ['id'] }],
    },
    {
      code: `
        const First = (props) => (
          <this.Foo {...props} />
        );
      `,
      options: [{ forbid: ['id'] }],
    },
    {
      code: `
        const First = (props) => (
          <fbt:param name="name">{props.name}</fbt:param>
        );
      `,
      options: [{ forbid: ['id'] }],
      features: ['jsx namespace'],
    },
    {
      code: `
        const First = (props) => (
          <div name="foo" />
        );
      `,
      options: [{ forbid: ['id'] }],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <div id="bar" />;
          }
        });
      `,
      options: [{ forbid: ['id'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'id' },
          line: 5,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        class First extends createReactClass {
          render() {
            return <div id="bar" />;
          }
        }
      `,
      options: [{ forbid: ['id'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'id' },
          line: 4,
          column: 25,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div id="foo" />
        );
      `,
      options: [{ forbid: ['id'] }],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'id' },
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div className="foo" />
        );
      `,
      options: [
        {
          forbid: [{ propName: 'className', message: 'Please use class instead of ClassName' }],
        },
      ],
      errors: [
        {
          message: 'Please use class instead of ClassName',
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div className="foo">
            <div otherProp="bar" />
          </div>
        );
      `,
      options: [
        {
          forbid: [
            { propName: 'className', message: 'Please use class instead of ClassName' },
            { propName: 'otherProp', message: 'Avoid using otherProp' },
          ],
        },
      ],
      errors: [
        {
          message: 'Please use class instead of ClassName',
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using otherProp',
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div className="foo">
            <div otherProp="bar" />
          </div>
        );
      `,
      options: [
        {
          forbid: [
            { propName: 'className' },
            { propName: 'otherProp', message: 'Avoid using otherProp' },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'className' },
          line: 3,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using otherProp',
          line: 4,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
  ]),
});
