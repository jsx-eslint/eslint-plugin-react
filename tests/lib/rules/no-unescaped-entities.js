/**
 * @fileoverview Tests for no-unescaped-entities
 * @author Patrick Hayes
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const semver = require('semver');
const path = require('path');
const resolve = require('resolve');

let allowsInvalidJSX = false;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require, import/no-dynamic-require
  allowsInvalidJSX = semver.satisfies(require(resolve.sync('acorn-jsx/package.json', { basedir: path.dirname(require.resolve('eslint')) })).version, '< 5.2');
} catch (e) { /**/ }

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unescaped-entities');

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
ruleTester.run('no-unescaped-entities', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return (
              <div/>
            );
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Here is some text!</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>first line is ok
            so is second
            and here are some escaped entities: &gt; &lt; &amp;</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{">" + "<" + "&" + '"'}</div>;
          },
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>Here is some text!</>;
          }
        });
      `,
      features: ['fragment'],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</>;
          }
        });
      `,
      features: ['fragment'],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>{">" + "<" + "&" + '"'}</>;
          },
        });
      `,
      features: ['fragment'],
    },
  ]),

  invalid: parsers.all([].concat(
    allowsInvalidJSX ? [
      {
        code: `
          var Hello = createReactClass({
            render: function() {
              return <div>> default parser</div>;
            }
          });
        `,
        errors: [
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '>', alts: '`&gt;`' },
          },
        ],
      },
      {
        code: `
          var Hello = createReactClass({
            render: function() {
              return <div>first line is ok
              so is second
              and here are some bad entities: ></div>
            }
          });
        `,
        errors: [
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '>', alts: '`&gt;`' },
          },
        ],
      },
      {
        code: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: '>> default parser</div>;
            }
          });
        `,
        errors: [
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '\'', alts: '`&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`' },
          },
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '>', alts: '`&gt;`' },
          },
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '>', alts: '`&gt;`' },
          },
        ],
      },
      {
        code: `
          var Hello = createReactClass({
            render: function() {
              return <div>{"Unbalanced braces - default parser"}}</div>;
            }
          });
        `,
        errors: [
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '}', alts: '`&#125;`' },
          },
        ],
      },
    ] : [],
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>> babel-eslint</>;
          }
        });
      `,
      features: ['fragment', 'no-ts', 'no-default'],
      errors: [
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '>', alts: '`&gt;`' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>first line is ok
            so is second
            and here are some bad entities: ></>
          }
        });
      `,
      features: ['fragment', 'no-ts', 'no-default'],
      errors: [
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '>', alts: '`&gt;`' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>'</div>;
          }
        });
      `,
      errors: [
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '\'', alts: '`&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>{"Unbalanced braces - babel-eslint"}}</>;
          }
        });
      `,
      features: ['fragment', 'no-ts', 'no-default'],
      errors: [
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '}', alts: '`&#125;`' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>foo & bar</>;
          }
        });
      `,
      features: ['fragment'],
      errors: [
        {
          messageId: 'unescapedEntity',
          data: { entity: '&' },
        },
      ],
      options: [{ forbid: ['&'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo & bar</span>;
          }
        });
      `,
      errors: [
        {
          messageId: 'unescapedEntity',
          data: { entity: '&' },
        },
      ],
      options: [{ forbid: ['&'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo & bar</span>;
          }
        });
      `,
      errors: [
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '&', alts: '`&amp;`' },
        },
      ],
      options: [
        {
          forbid: [
            {
              char: '&',
              alternatives: ['&amp;'],
            },
          ],
        },
      ],
    }
  )),
});
