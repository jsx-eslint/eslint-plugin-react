/**
 * @fileoverview Prevent usage of findDOMNode
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-find-dom-node');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-find-dom-node', rule, {

  valid: [{
    code: [
      'var Hello = function() {};'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someFunc = React.findDOMNode;',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '    React.someFunc(this);',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n')
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '    React.findDOMNode(this).scrollIntoView();',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '    ReactDOM.findDOMNode(this).scrollIntoView();',
      '  },',
      '  render: function() {',
      '    return <div>Hello</div>;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }, {
    code: [
      'class Hello extends Component {',
      '  componentDidMount() {',
      '    findDOMNode(this).scrollIntoView();',
      '  }',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '};'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }, {
    code: [
      'class Hello extends Component {',
      '  componentDidMount() {',
      '    this.node = findDOMNode(this);',
      '  }',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '};'
    ].join('\n'),
    errors: [{
      message: 'Do not use findDOMNode'
    }]
  }]
});
