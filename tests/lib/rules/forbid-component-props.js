/**
 * @fileoverview Tests for forbid-component-props
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/forbid-component-props');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var CLASSNAME_ERROR_MESSAGE = 'Prop `className` is forbidden on Components';
var STYLE_ERROR_MESSAGE = 'Prop `style` is forbidden on Components';
var DOM_STYLE_ERROR_MESSAGE = 'Prop `style` is forbidden on DOM nodes';
var TAG_ERROR_MESSAGE = 'Prop `style` is specifically forbidden on tags named i';

var ruleTester = new RuleTester();
ruleTester.run('forbid-component-props', rule, {

  valid: [{
    code: [
      'var First = React.createClass({',
      '  render: function() {',
      '    return <div className="foo" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  render: function() {',
      '    return <div style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style']}],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo bar="baz" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style']}],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style', 'foo']}],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['classNames'], defaultAllowOnComponents: false}],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: [{property: 'className', allowOnComponents: true}]}],
    parserOptions: parserOptions
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div className="bar"><Foo className="bar" /></div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: [{property: 'className', allowOnComponents: true, allowOnDOM: true}]}],
    parserOptions: parserOptions
  },
    {
      code: [
        'var First = React.createClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div className="bar"><Foo className="bar" /></div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{forbid: [{property: 'className', allow: ['div', 'Foo']}], defaultAllowOnDOM: false, defaultAllowOnComponents: false}],
      parserOptions: parserOptions
    }],

  invalid: [{
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: CLASSNAME_ERROR_MESSAGE,
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: STYLE_ERROR_MESSAGE,
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', 'style']}],
    errors: [{
      message: CLASSNAME_ERROR_MESSAGE,
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', 'style']}],
    errors: [
      {
        message: STYLE_ERROR_MESSAGE,
        line: 4,
        column: 17,
        type: 'JSXAttribute'
      }
    ]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', {property: 'style', allowOnComponents: false}], defaultAllowOnComponents: true}],
    errors: [
      {
        message: STYLE_ERROR_MESSAGE,
        line: 4,
        column: 17,
        type: 'JSXAttribute'
      }
    ]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo><i style={{color: "red"}} /></Foo>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', {property: 'style', forbid: ['i']}], defaultAllowOnDOM: true}],
    errors: [
      {
        message: TAG_ERROR_MESSAGE,
        line: 4,
        column: 20,
        type: 'JSXAttribute'
      }
    ]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo><i style={{color: "red"}} /></Foo>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', 'style'], defaultAllowOnDOM: false}],
    errors: [
      {
        message: DOM_STYLE_ERROR_MESSAGE,
        line: 4,
        column: 20,
        type: 'JSXAttribute'
      }
    ]
  }]
});
