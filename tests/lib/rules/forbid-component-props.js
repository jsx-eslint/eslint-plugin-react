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
var TAG_STYLE_ERROR_MESSAGE = 'Prop `style` is specifically forbidden on i DOM nodes';
var TAG_CLASSNAME_ERROR_MESSAGE = 'Prop `className` is specifically forbidden on i DOM nodes';
var DIV_TAG_CLASSNAME_ERROR_MESSAGE = 'Prop `className` is specifically forbidden on div DOM nodes';
var FOO_TAG_CLASSNAME_ERROR_MESSAGE = 'Prop `className` is specifically forbidden on Foo Components';

var ruleTester = new RuleTester();
ruleTester.run('forbid-component-props', rule, {

  valid: [{
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div className="foo" />;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'function First(props) {',
      '  return <div className="foo" />;',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
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
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div className="bar"><Foo className="bar" /></div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: [{property: 'className', allow: ['div', 'Foo']}],
      defaultAllowOnDOM: false,
      defaultAllowOnComponents: false
    }],
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
        message: TAG_STYLE_ERROR_MESSAGE,
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
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo><i style={{color: "red"}} /><div style={{color: "red"}} /></Foo>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', {property: 'style', allow: ['div']}], defaultAllowOnDOM: false}],
    errors: [
      {
        message: DOM_STYLE_ERROR_MESSAGE,
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
      '    return <Foo><i style={{color: "red"}} /><div style={{color: "red"}} /></Foo>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', {property: 'style', forbid: ['i']}]}],
    errors: [
      {
        message: TAG_STYLE_ERROR_MESSAGE,
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
      '    return <Foo className="foo"><i style={{color: "red"}} /><div style={{color: "red"}} /></Foo>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: ['className', {property: 'style', forbid: ['i']}]}],
    errors: [
      {
        message: CLASSNAME_ERROR_MESSAGE,
        line: 4,
        column: 17,
        type: 'JSXAttribute'
      }, {
        message: TAG_STYLE_ERROR_MESSAGE,
        line: 4,
        column: 36,
        type: 'JSXAttribute'
      }
    ]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="foo"><i className="foo" /></Foo>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: [{forbid: [{property: 'className', forbid: ['i']}], defaultAllowOnComponents: true}],
    errors: [
      {
        message: TAG_CLASSNAME_ERROR_MESSAGE,
        line: 4,
        column: 36,
        type: 'JSXAttribute'
      }
    ]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div className="bar"><Foo className="bar" /></div>;',
      '  }',
      '});'
    ].join('\n'),
    options: [
      {
        forbid: [{property: 'className', forbid: ['div', 'Foo']}],
        defaultAllowOnDOM: true,
        defaultAllowOnComponents: true
      }
    ],
    parserOptions: parserOptions,
    errors: [
      {
        message: DIV_TAG_CLASSNAME_ERROR_MESSAGE,
        line: 4,
        column: 17,
        type: 'JSXAttribute'
      }, {
        message: FOO_TAG_CLASSNAME_ERROR_MESSAGE,
        line: 4,
        column: 38,
        type: 'JSXAttribute'
      }
    ]
  }]
});
