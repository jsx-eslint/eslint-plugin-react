/**
 * @fileoverview Prefer es6 class instead of createClass for React Component
 * @author Dan Hamilton
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/prefer-es6-class');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('prefer-es6-class', rule, {

  valid: [{
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  },
  {
    code: [
      'export default class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'Hello.displayName = \'Hello\''
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      module: true,
      modules: true,
      jsx: true
    }
  },
  {
    code: [
      'var Hello = "foo";',
      'module.exports = {};'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }
  ],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  displayName: \'Hello\',',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Component should use es6 class instead of createClass'
    }]
  }
]});
