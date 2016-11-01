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

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

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
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
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
    parserOptions: parserOptions
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not use setState'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  someMethod = () => {',
      '    this.setState({',
      '      name: this.props.name.toUpperCase()',
      '    });',
      '  }',
      '  render() {',
      '    return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState'
    }]
  }]
});
