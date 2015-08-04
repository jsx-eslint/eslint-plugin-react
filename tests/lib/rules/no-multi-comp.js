/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-multi-comp');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-multi-comp', rule, {

  valid: [{
    code: [
      'var Hello = require(\'./components/Hello\');',
      'var HelloJohn = React.createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\r'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});',
      'var HelloJohn = React.createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}',
      'class HelloJohnny extends React.Component {',
      '  render() {',
      '    return <Hello name="Johnny" />;',
      '  }',
      '}'
    ].join('\r'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }, {
      message: 'Declare only one React component per file',
      line: 11
    }]
  }]
});
