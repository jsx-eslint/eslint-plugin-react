/**
 * @fileoverview Prevent usage of setState
 * @author Mark Dalgleish
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-set-state');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
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

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-set-state', rule, {

  valid: [{
    code: [
      'var Hello = function() {',
      '  this.setState({})',
      '};'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someHandler = this.setState;',
      '  },',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n')
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
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
    errors: [{
      message: 'Do not use setState'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
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
