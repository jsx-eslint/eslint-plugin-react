/**
 * @fileoverview Tests for no-unescaped-entities
 * @author Patrick Hayes
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const path = require('path');

const semver = require('semver');
const resolve = require('resolve');

let allowsInvalidJSX = false;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require, import/no-dynamic-require
  allowsInvalidJSX = semver.satisfies(require(resolve.sync('acorn-jsx/package.json', { basedir: path.dirname(require.resolve('eslint')) })).version, '< 5.2');
} catch (e) { /**/ }

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-unescaped-entities');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2022,
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
            suggestions: [
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&gt;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>&gt; default parser</div>;
            }
          });
        `,
              },
            ],
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
            suggestions: [
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&gt;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>first line is ok
              so is second
              and here are some bad entities: &gt;</div>
            }
          });
        `,
              },
            ],
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
            suggestions: [
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&apos;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: &apos;>> default parser</div>;
            }
          });
        `,
              },
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&lsquo;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: &lsquo;>> default parser</div>;
            }
          });
        `,
              },
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&#39;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: &#39;>> default parser</div>;
            }
          });
        `,
              },
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&rsquo;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: &rsquo;>> default parser</div>;
            }
          });
        `,
              },
            ],
          },
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '>', alts: '`&gt;`' },
            suggestions: [
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&gt;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: '&gt;> default parser</div>;
            }
          });
        `,
              },
            ],
          },
          {
            messageId: 'unescapedEntityAlts',
            data: { entity: '>', alts: '`&gt;`' },
            suggestions: [
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&gt;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>Multiple errors: '>&gt; default parser</div>;
            }
          });
        `,
              },
            ],
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
            suggestions: [
              {
                messageId: 'replaceWithAlt',
                data: { alt: '&#125;' },
                output: `
          var Hello = createReactClass({
            render: function() {
              return <div>{"Unbalanced braces - default parser"}&#125;</div>;
            }
          });
        `,
              },
            ],
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
          suggestions: [
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&gt;' },
              output: `
        var Hello = createReactClass({
          render: function() {
            return <>&gt; babel-eslint</>;
          }
        });
      `,
            },
          ],
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
          suggestions: [{
            messageId: 'replaceWithAlt',
            data: { alt: '&gt;' },
            output: `
        var Hello = createReactClass({
          render: function() {
            return <>first line is ok
            so is second
            and here are some bad entities: &gt;</>
          }
        });
      `,
          }],
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
          suggestions: [
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&apos;' },
              output: `
        var Hello = createReactClass({
          render: function() {
            return <div>&apos;</div>;
          }
        });
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&lsquo;' },
              output: `
        var Hello = createReactClass({
          render: function() {
            return <div>&lsquo;</div>;
          }
        });
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&#39;' },
              output: `
        var Hello = createReactClass({
          render: function() {
            return <div>&#39;</div>;
          }
        });
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&rsquo;' },
              output: `
        var Hello = createReactClass({
          render: function() {
            return <div>&rsquo;</div>;
          }
        });
      `,
            },
          ],
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
          suggestions: [{
            messageId: 'replaceWithAlt',
            data: { alt: '&#125;' },
            output: `
        var Hello = createReactClass({
          render: function() {
            return <>{"Unbalanced braces - babel-eslint"}&#125;</>;
          }
        });
      `,
          }],
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
          suggestions: [{
            messageId: 'replaceWithAlt',
            data: { alt: '&amp;' },
            output: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo &amp; bar</span>;
          }
        });
      `,
          }],
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
    },
    {
      code: `
        <script>window.foo = "bar"</script>
      `,
      errors: [
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '"', alts: '`&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`' },
          line: 2,
          column: 30,
          suggestions: [
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&quot;' },
              output: `
        <script>window.foo = &quot;bar"</script>
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&ldquo;' },
              output: `
        <script>window.foo = &ldquo;bar"</script>
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&#34;' },
              output: `
        <script>window.foo = &#34;bar"</script>
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&rdquo;' },
              output: `
        <script>window.foo = &rdquo;bar"</script>
      `,
            },
          ],
        },
        {
          messageId: 'unescapedEntityAlts',
          data: { entity: '"', alts: '`&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`' },
          line: 2,
          column: 34,
          suggestions: [
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&quot;' },
              output: `
        <script>window.foo = "bar&quot;</script>
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&ldquo;' },
              output: `
        <script>window.foo = "bar&ldquo;</script>
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&#34;' },
              output: `
        <script>window.foo = "bar&#34;</script>
      `,
            },
            {
              messageId: 'replaceWithAlt',
              data: { alt: '&rdquo;' },
              output: `
        <script>window.foo = "bar&rdquo;</script>
      `,
            },
          ],
        },
      ],
    },
  )),
});
