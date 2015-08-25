/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-set-state');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-set-state', rule, {

  valid: [{
    code: [
      'var Hello = function() {',
      '  this.setState({})',
      '};'
    ].join('\n'),
    ecmaFeatures: {}
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someHandler = this.setState;',
      '  },',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    this.setState({',
      '      name: this.props.name.toUpperCase()',
      '    });',
      '  },',
      '  render: function() {',
      '    return <div>Hello {this.state.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Do not use setState'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  someMethod: function() {',
      '    this.setState({',
      '      name: this.props.name.toUpperCase()',
      '    });',
      '  },',
      '  render: function() {',
      '    return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: [{
      message: 'Do not use setState'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  someMethod() {',
      '    this.setState({',
      '      name: this.props.name.toUpperCase()',
      '    });',
      '  }',
      '  render() {',
      '    return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true,
      classes: true
    },
    errors: [{
      message: 'Do not use setState'
    }]
  }]
});
