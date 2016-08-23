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
      // Already a stateless function
      code: [
        'const Foo = function(props) {',
        '  return <div>{props.foo}</div>;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Already a stateless (arrow) function
      code: 'const Foo = ({foo}) => <div>{foo}</div>;',
      parserOptions: parserOptions
    }, {
      // Extends from PureComponent and uses props
      code: [
        'class Foo extends React.PureComponent {',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      // Extends from PureComponent and uses context
      code: [
        'class Foo extends React.PureComponent {',
        '  render() {',
        '    return <div>{this.context.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      // Has a lifecyle method
      code: [
        'class Foo extends React.Component {',
        '  shouldComponentUpdate() {',
        '    return false;',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Has a state
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
      // Use refs
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
    }, {
      // Has an additional method
      code: [
        'class Foo extends React.Component {',
        '  doStuff() {}',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Has an empty (no super) constructor
      code: [
        'class Foo extends React.Component {',
        '  constructor() {}',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Has a constructor
      code: [
        'class Foo extends React.Component {',
        '  constructor() {',
        '    doSpecialStuffs();',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Has a constructor (2)
      code: [
        'class Foo extends React.Component {',
        '  constructor() {',
        '    foo;',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Use this.bar
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <div>{this.bar}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Use this.bar (destructuring)
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    let {props:{foo}, bar} = this;',
        '    return <div>{foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Use this[bar]
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <div>{this[bar]}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Use this['bar']
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <div>{this[\'bar\']}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Can return null (ES6, React 0.14.0)
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    if (!this.props.foo) {',
        '      return null;',
        '    }',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      // Can return null (ES5, React 0.14.0)
      code: [
        'var Foo = React.createClass({',
        '  render: function() {',
        '    if (!this.props.foo) {',
        '      return null;',
        '    }',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      // Can return null (shorthand if in return, React 0.14.0)
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return true ? <div /> : null;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      code: [
        'export default (Component) => (',
        '  class Test extends React.Component {',
        '    componentDidMount() {}',
        '    render() {',
        '      return <Component />;',
        '    }',
        '  }',
        ');'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      // Only use this.props
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
    }, {
      // Only use this[\'props\']
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <div>{this[\'props\'].foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Only extend PureComponent without use of props or context
      code: [
        'class Foo extends React.PureComponent {',
        '  render() {',
        '    return <div>foo</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      options: [{
        ignorePureComponents: true
      }],
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Extends from PureComponent but no ignorePureComponents option
      code: [
        'class Foo extends React.PureComponent {',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Has only displayName (method) and render
      code: [
        'class Foo extends React.Component {',
        '  static get displayName() {',
        '    return \'Foo\';',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Has only displayName (property) and render
      code: [
        'class Foo extends React.Component {',
        '  static displayName = \'Foo\';',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Has only propTypes (method) and render
      code: [
        'class Foo extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: React.PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Has only propTypes (property) and render
      code: [
        'class Foo extends React.Component {',
        '  static propTypes = {',
        '    name: React.PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Has only props (type annotation) and render
      code: [
        'class Foo extends React.Component {',
        '  props: {',
        '    name: string;',
        '  };',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Has only useless constructor and render
      code: [
        'class Foo extends React.Component {',
        '  constructor() {',
        '    super();',
        '  }',
        '  render() {',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Only use this.props and this.context (destructuring)
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    let {props:{foo}, context:{bar}} = this;',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Can return null (ES6)
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    if (!this.props.foo) {',
        '      return null;',
        '    }',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Can return null (ES5)
      code: [
        'var Foo = React.createClass({',
        '  render: function() {',
        '    if (!this.props.foo) {',
        '      return null;',
        '    }',
        '    return <div>{this.props.foo}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      // Can return null (shorthand if in return)
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return true ? <div /> : null;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }
  ]
});
