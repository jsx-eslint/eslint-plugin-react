/**
 * @fileoverview Tests for forbid-dom-props
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
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
    {
      code: `
        const First = (props) => (
          <div otherProp="bar" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'otherProp',
              disallowedFor: ['span'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div someProp="someValue" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'someProp',
              disallowedValues: [],
            },
          ],
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <Foo someProp="someValue" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'someProp',
              disallowedValues: ['someValue'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div someProp="value" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'someProp',
              disallowedValues: ['someValue'],
            },
          ],
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div someProp="someValue" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'someProp',
              disallowedValues: ['someValue'],
              disallowedFor: ['span'],
            },
          ],
        },
      ],
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
          <span otherProp="bar" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'otherProp',
              disallowedFor: ['span'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbidden',
          data: { prop: 'otherProp' },
          line: 3,
          column: 17,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div someProp="someValue" />
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'someProp',
              disallowedValues: ['someValue'],
            },
          ],
        },
      ],
      errors: [
        {
          messageId: 'propIsForbiddenWithValue',
          data: { prop: 'someProp', propValue: 'someValue' },
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
    {
      code: `
        const First = (props) => (
          <form accept='file'>
            <input type="file" id="videoFile" accept="video/*" />
            <input type="hidden" name="fullname" />
          </form>
        );
      `,
      options: [
        {
          forbid: [{
            propName: 'accept',
            disallowedFor: ['form'],
            message: 'Avoid using the accept attribute on <form>',
          }],
        },
      ],
      errors: [
        {
          message: 'Avoid using the accept attribute on <form>',
          line: 3,
          column: 17,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div className="foo">
            <input className="boo" />
            <span className="foobar">Foobar</span>
            <div otherProp="bar" />
          </div>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['div', 'span'],
              message: 'Please use class instead of ClassName',
            },
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
          message: 'Please use class instead of ClassName',
          line: 5,
          column: 19,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using otherProp',
          line: 6,
          column: 18,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const First = (props) => (
          <div className="foo">
            <input className="boo" />
            <span className="foobar">Foobar</span>
            <div otherProp="bar" />
            <p thirdProp="foo" />
            <div thirdProp="baz" />
            <p thirdProp="bar" />
            <p thirdProp="baz" />
          </div>
        );
      `,
      options: [
        {
          forbid: [
            {
              propName: 'className',
              disallowedFor: ['div', 'span'],
              message: 'Please use class instead of ClassName',
            },
            { propName: 'otherProp', message: 'Avoid using otherProp' },
            {
              propName: 'thirdProp',
              disallowedFor: ['p'],
              disallowedValues: ['bar', 'baz'],
              message: 'Do not use thirdProp with values bar and baz on p',
            },
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
          message: 'Please use class instead of ClassName',
          line: 5,
          column: 19,
          type: 'JSXAttribute',
        },
        {
          message: 'Avoid using otherProp',
          line: 6,
          column: 18,
          type: 'JSXAttribute',
        },
        {
          message: 'Do not use thirdProp with values bar and baz on p',
          line: 9,
          column: 16,
          type: 'JSXAttribute',
        },
        {
          message: 'Do not use thirdProp with values bar and baz on p',
          line: 10,
          column: 16,
          type: 'JSXAttribute',
        },
      ],
    },
  ]),
});
