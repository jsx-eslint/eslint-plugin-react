/**
 * @fileoverview Enforce stateless components to be written as a pure function
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/prefer-stateless-function');
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
ruleTester.run('prefer-stateless-function', rule, {

  valid: [
    {
      code: [
        'const Foo = function(props) {',
        '  return <div>{props.foo}</div>;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Foo extends React.Component {',
        '  shouldComponentUpdate() {',
        '    return fasle;',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: 'const Foo = ({foo}) => <div>{foo}</div>;',
      parserOptions: parserOptions
    }, {
      code: [
        'class Foo extends React.Component {',
        '  changeState() {',
        '    this.setState({foo: "clicked"});',
        '  }',
        '  render() {',
        '    return <div onClick={this.changeState.bind(this)}>{this.state.foo || "bar"}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Foo extends React.Component {',
        '  doStuff() {',
        '    this.refs.foo.style.backgroundColor = "red";',
        '  }',
        '  render() {',
        '    return <div ref="foo" onClick={this.doStuff}>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }
  ]
});
