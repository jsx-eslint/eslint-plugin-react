/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component definition.
 * @author Daniel Lo Nigro <dan.cx>
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-bind');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-no-bind', rule, {

  valid: [
    // Not covered by the rule
    {
      code: '<div onClick={this._handleClick}></div>',
      parser: 'babel-eslint'
    },
    {
      code: '<div meaningOfLife={42}></div>',
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={getHandler()}></div>',
      parser: 'babel-eslint'
    },

    // bind() and arrow functions in refs explicitly ignored
    {
      code: '<div ref={c => this._input = c}></div>',
      options: [{ignoreRefs: true}],
      parser: 'babel-eslint'
    },
    {
      code: '<div ref={this._refCallback.bind(this)}></div>',
      options: [{ignoreRefs: true}],
      parser: 'babel-eslint'
    },

    // bind() explicitly allowed
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      options: [{allowBind: true}],
      parser: 'babel-eslint'
    },

    // Arrow functions explicitly allowed
    {
      code: '<div onClick={() => alert("1337")}></div>',
      options: [{allowArrowFunctions: true}],
      parser: 'babel-eslint'
    },

    // Redux connect
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'export default connect()(Hello);'
      ].join('\n'),
      options: [{allowBind: true}],
      parser: 'babel-eslint'
    },
    // Backbone view with a bind
    {
      code: [
        'var DocumentRow = Backbone.View.extend({',
        '  tagName: "li",',
        '  render: function() {',
        '    this.onTap.bind(this);',
        '  }',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'const foo = {',
        '  render: function() {',
        '    this.onTap.bind(this);',
        '    return true;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'const foo = {',
        '  render() {',
        '    this.onTap.bind(this);',
        '    return true;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    // .bind()
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={someGlobalFunction.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={window.lol.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div ref={this._refCallback.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    const click = this.someMethod.bind(this);',
        '    return <div onClick={click}>Hello {this.state.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  render() {',
        '    const click = this.someMethod.bind(this);',
        '    return <div onClick={click}>Hello {this.state.name}</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'const foo = {',
        '  render: function() {',
        '    const click = this.onTap.bind(this);',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'const foo = {',
        '  render: ({onClick}) => (',
        '    <div onClick={onClick.bind(this)}>Hello</div>',
        '  )',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'const foo = {',
        '  render() {',
        '    const click = this.onTap.bind(this);',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },

    // Arrow functions
    {
      code: '<div onClick={() => alert("1337")}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={() => 42}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div onClick={param => { first(); second(); }}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div ref={c => this._input = c}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },

    // Bind expression
    {
      code: '<div foo={::this.onChange} />',
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div foo={foo.bar::baz} />',
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    },
    {
      code: '<div foo={foo::bar} />',
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    }
  ]
});
