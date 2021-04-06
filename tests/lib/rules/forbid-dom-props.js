/**
 * @fileoverview Tests for forbid-dom-props
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-dom-props');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-element-props', rule, {

  valid: [{
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <Foo id="foo" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo id="bar" style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style', 'id']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <this.Foo bar="baz" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'class First extends createReactClass {',
      '  render() {',
      '    return <this.foo id="bar" />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'const First = (props) => (',
      '  <this.Foo {...props} />',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'const First = (props) => (',
      '  <fbt:param name="name">{props.name}</fbt:param>',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }, {
    code: [
      'const First = (props) => (',
      '  <div name="foo" />',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}]
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div id="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['id']}],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'id'},
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'class First extends createReactClass {',
      '  render() {',
      '    return <div id="bar" />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{forbid: ['id']}],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'id'},
      line: 3,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const First = (props) => (',
      '  <div id="foo" />',
      ');'
    ].join('\n'),
    options: [{forbid: ['id']}],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'id'},
      line: 2,
      column: 8,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const First = (props) => (',
      '  <div className="foo" />',
      ');'
    ].join('\n'),
    options: [{
      forbid: [{propName: 'className', message: 'Please use class instead of ClassName'}]
    }],
    errors: [{
      message: 'Please use class instead of ClassName',
      line: 2,
      column: 8,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const First = (props) => (',
      '  <div className="foo">',
      '    <div otherProp="bar" />',
      '  </div>',
      ');'
    ].join('\n'),
    options: [{
      forbid: [
        {propName: 'className', message: 'Please use class instead of ClassName'},
        {propName: 'otherProp', message: 'Avoid using otherProp'}
      ]
    }],
    errors: [{
      message: 'Please use class instead of ClassName',
      line: 2,
      column: 8,
      type: 'JSXAttribute'
    }, {
      message: 'Avoid using otherProp',
      line: 3,
      column: 10,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const First = (props) => (',
      '  <div className="foo">',
      '    <div otherProp="bar" />',
      '  </div>',
      ');'
    ].join('\n'),
    options: [{
      forbid: [
        {propName: 'className'},
        {propName: 'otherProp', message: 'Avoid using otherProp'}
      ]
    }],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'className'},
      line: 2,
      column: 8,
      type: 'JSXAttribute'
    }, {
      message: 'Avoid using otherProp',
      line: 3,
      column: 10,
      type: 'JSXAttribute'
    }]
  }]
});
