/**
 * @fileoverview Tests for forbid-component-props
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-component-props');

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
ruleTester.run('forbid-component-props', rule, {

  valid: [{
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <div className="foo" />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <div style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo bar="baz" />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['style', 'foo']}]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <this.Foo bar="baz" />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'class First extends createReactClass {',
      '  render() {',
      '    return <this.foo className="bar" />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{forbid: ['style']}]
  }, {
    code: [
      'const First = (props) => (',
      '  <this.Foo {...props} />',
      ');'
    ].join('\n')
  }, {
    code: 'const item = (<ReactModal className="foo" />);',
    options: [{
      forbid: [{propName: 'className', allowedFor: ['ReactModal']}]
    }]
  }, {
    code: 'const item = (<AntdLayout.Content className="antdFoo" />);',
    options: [{
      forbid: [{propName: 'className', allowedFor: ['AntdLayout.Content']}]
    }]
  }, {
    code: 'const item = (<this.ReactModal className="foo" />);',
    options: [{
      forbid: [{propName: 'className', allowedFor: ['this.ReactModal']}]
    }]
  }, {
    code: '<fbt:param name="Total number of files" number={true} />'
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'className'},
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'style'},
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['className', 'style']}],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'className'},
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <Foo style={{color: "red"}} />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{forbid: ['className', 'style']}],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'style'},
      line: 4,
      column: 17,
      type: 'JSXAttribute'
    }]
  }, {
    code: 'const item = (<Foo className="foo" />);',
    options: [{
      forbid: [{propName: 'className', allowedFor: ['ReactModal']}]
    }],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'className'},
      line: 1,
      column: 20,
      type: 'JSXAttribute'
    }]
  }, {
    code: 'const item = (<this.ReactModal className="foo" />);',
    options: [{
      forbid: [{propName: 'className', allowedFor: ['ReactModal']}]
    }],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'className'},
      line: 1,
      column: 32,
      type: 'JSXAttribute'
    }]
  }, {
    code: 'const item = (<Foo className="foo" />);',
    options: [{
      forbid: [{propName: 'className', message: 'Please use ourCoolClassName instead of ClassName'}]
    }],
    errors: [{
      message: 'Please use ourCoolClassName instead of ClassName',
      line: 1,
      column: 20,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const item = () => (',
      '<Foo className="foo">',
      '  <Bar option="high" />',
      '</Foo>',
      ');'
    ].join('\n'),
    options: [{
      forbid: [
        {propName: 'className', message: 'Please use ourCoolClassName instead of ClassName'},
        {propName: 'option', message: 'Avoid using option'}
      ]
    }],
    errors: [{
      message: 'Please use ourCoolClassName instead of ClassName',
      line: 2,
      column: 6,
      type: 'JSXAttribute'
    }, {
      message: 'Avoid using option',
      line: 3,
      column: 8,
      type: 'JSXAttribute'
    }]
  }, {
    code: [
      'const item = () => (',
      '<Foo className="foo">',
      '  <Bar option="high" />',
      '</Foo>',
      ');'
    ].join('\n'),
    options: [{
      forbid: [
        {propName: 'className'},
        {propName: 'option', message: 'Avoid using option'}
      ]
    }],
    errors: [{
      messageId: 'propIsForbidden',
      data: {prop: 'className'},
      line: 2,
      column: 6,
      type: 'JSXAttribute'
    }, {
      message: 'Avoid using option',
      line: 3,
      column: 8,
      type: 'JSXAttribute'
    }]
  }]
});
