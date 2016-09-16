/**
 * @fileoverview Tests for no-unescaped-entities
 * @author Patrick Hayes
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-unescaped-entities');
var RuleTester = require('eslint').RuleTester;
var parserOptions = {
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unescaped-entities', rule, {

  valid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return (',
        '      <div/>',
        '    );',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Here is some text!</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>first line is ok',
        '    so is second',
        '    and here are some escaped entities: &gt; &lt; &amp;</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>{">" + "<" + "&" + \'"\'}</div>;',
        '  },',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>></div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{message: 'HTML entities must be escaped.'}]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>first line is ok',
        '    so is second',
        '    and here are some bad entities: ></div>',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{message: 'HTML entities must be escaped.'}]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>\'</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{message: 'HTML entities must be escaped.'}]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Multiple errors: \'>></div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: 'HTML entities must be escaped.'},
        {message: 'HTML entities must be escaped.'},
        {message: 'HTML entities must be escaped.'}
      ]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>{"Unbalanced braces"}}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{message: 'HTML entities must be escaped.'}]
    }
  ]
});
