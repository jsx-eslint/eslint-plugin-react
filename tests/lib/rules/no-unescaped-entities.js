/**
 * @fileoverview Tests for no-unescaped-entities
 * @author Patrick Hayes
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const semver = require('semver');

let allowsInvalidJSX = false;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  allowsInvalidJSX = semver.satisfies(require('acorn-jsx/package.json').version, '< 5.2');
} catch (e) { /**/ }

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unescaped-entities');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unescaped-entities', rule, {

  valid: [
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return (
              <div/>
            );
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Here is some text!</div>;
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</div>;
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>first line is ok
            so is second
            and here are some escaped entities: &gt; &lt; &amp;</div>;
          }
        });
      `
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{">" + "<" + "&" + '"'}</div>;
          },
        });
      `
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>Here is some text!</>;
          }
        });
      `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</>;
          }
        });
      `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>{">" + "<" + "&" + '"'}</>;
          },
        });
      `,
      parser: parsers.BABEL_ESLINT
    }
  ],

  invalid: [
    (allowsInvalidJSX && {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>></div>;
          }
        });
      `,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }), {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>></>;
          }
        });
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }, (allowsInvalidJSX && {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>first line is ok
            so is second
            and here are some bad entities: ></div>
          }
        });
      `,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }), {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>first line is ok
            so is second
            and here are some bad entities: ></>
          }
        });
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: '`>` can be escaped with `&gt;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>'</div>;
          }
        });
      `,
      errors: [{message: '`\'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.'}]
    }, (allowsInvalidJSX && {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Multiple errors: '>></div>;
          }
        });
      `,
      errors: [
        {message: '`\'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.'},
        {message: '`>` can be escaped with `&gt;`.'},
        {message: '`>` can be escaped with `&gt;`.'}
      ]
    }), (allowsInvalidJSX && {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{"Unbalanced braces"}}</div>;
          }
        });
      `,
      errors: [{message: '`}` can be escaped with `&#125;`.'}]
    }), {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>{"Unbalanced braces"}}</>;
          }
        });
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: '`}` can be escaped with `&#125;`.'}]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <>foo & bar</>;
          }
        });
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{message: 'HTML entity, `&` , must be escaped.'}],
      options: [{
        forbid: ['&']
      }]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo & bar</span>;
          }
        });
      `,
      errors: [{message: 'HTML entity, `&` , must be escaped.'}],
      options: [{
        forbid: ['&']
      }]
    }, {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <span>foo & bar</span>;
          }
        });
      `,
      errors: [{message: '`&` can be escaped with `&amp;`.'}],
      options: [{
        forbid: [{
          char: '&',
          alternatives: ['&amp;']
        }]
      }]
    }
  ].filter(Boolean)
});
