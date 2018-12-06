/**
 * @fileoverview Prevents usage of Function.prototype.bind and arrow functions
 *               in React component definition.
 * @author Daniel Lo Nigro <dan.cx>
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-bind');
const RuleTester = require('eslint').RuleTester;

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
ruleTester.run('jsx-no-bind', rule, {

  valid: [
    // Not covered by the rule
    {
      code: '<div onClick={this._handleClick}></div>'
    },
    {
      code: '<div meaningOfLife={42}></div>'
    },
    {
      code: '<div onClick={getHandler()}></div>'
    },

    // bind() and arrow functions in refs explicitly ignored
    {
      code: '<div ref={c => this._input = c}></div>',
      options: [{ignoreRefs: true}]
    },
    {
      code: '<div ref={this._refCallback.bind(this)}></div>',
      options: [{ignoreRefs: true}]
    },
    {
      code: '<div ref={function (c) {this._input = c}}></div>',
      options: [{ignoreRefs: true}]
    },

    // bind() explicitly allowed
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      options: [{allowBind: true}]
    },

    // Arrow functions explicitly allowed
    {
      code: '<div onClick={() => alert("1337")}></div>',
      options: [{allowArrowFunctions: true}]
    },
    {
      code: '<div onClick={async () => alert("1337")}></div>',
      options: [{allowArrowFunctions: true}]
    },

    // Functions explicitly allowed
    {
      code: '<div onClick={function () { alert("1337") }}></div>',
      options: [{allowFunctions: true}]
    },
    {
      code: '<div onClick={function * () { alert("1337") }}></div>',
      options: [{allowFunctions: true}]
    },
    {
      code: '<div onClick={async function () { alert("1337") }}></div>',
      options: [{allowFunctions: true}]
    },

    // Redux connect
    {
      code: `
        class Hello extends Component {
          render() {
            return <div>Hello</div>;
          }
        }
        export default connect()(Hello);
      `,
      options: [{allowBind: true}]
    },

    // Backbone view with a bind
    {
      code: `
        var DocumentRow = Backbone.View.extend({
          tagName: "li",
          render: function() {
            this.onTap.bind(this);
          }
        });
      `
    },
    {
      code: `
        const foo = {
          render: function() {
            this.onTap.bind(this);
            return true;
          }
        };
      `
    },
    {
      code: `
        const foo = {
          render() {
            this.onTap.bind(this);
            return true;
          }
        };
      `
    },

    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    const click = this.onTap.bind(this);',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    foo.onClick = this.onTap.bind(this);',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    return (<div>{',
        '      this.props.list.map(this.wrap.bind(this, "span"))',
        '    }</div>);',
        '  }',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    const click = () => true;',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    return (<div>{',
        '      this.props.list.map(item => <item hello="true"/>)',
        '    }</div>);',
        '  }',
        '};'
      ].join('\n')
    },
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    const click = this.bar::baz',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    return (<div>{',
        '      this.props.list.map(this.bar::baz)',
        '    }</div>);',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    return (<div>{',
        '      this.props.list.map(this.wrap.bind(this, "span"))',
        '    }</div>);',
        '  }',
        '});'
      ].join('\n')
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const click = this.bar::baz',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const click = () => true',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '});'
      ].join('\n')
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const onClick = this.doSomething.bind(this, "no")',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    return (<div>{',
        '      this.props.list.map(this.wrap.bind(this, "span"))',
        '    }</div>);',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    },
    {
      // issue #1543: don't crash on uninitialized variables
      code: [
        'class Hello extends Component {',
        '  render() {',
        '    let click;',
        '    return <div onClick={onClick}>Hello</div>;',
        '  }',
        '}'
      ].join('\n')
    },

    // ignore DOM components
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      options: [{ignoreDOMComponents: true}]
    },
    {
      code: '<div onClick={() => alert("1337")}></div>',
      options: [{ignoreDOMComponents: true}]
    },
    {
      code: '<div onClick={function () { alert("1337") }}></div>',
      options: [{ignoreDOMComponents: true}]
    },
    {
      code: '<div foo={::this.onChange} />',
      options: [{ignoreDOMComponents: true}],
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    // .bind()
    {
      code: '<div onClick={this._handleClick.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: '<div onClick={someGlobalFunction.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: '<div onClick={window.lol.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: '<div ref={this._refCallback.bind(this)}></div>',
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            const click = this.someMethod.bind(this);
            return <div onClick={click}>Hello {this.state.name}</div>;
          }
        });
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: `
        class Hello23 extends React.Component {
          render() {
            const click = this.someMethod.bind(this);
            return <div onClick={click}>Hello {this.state.name}</div>;
          }
        };
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv() {',
        '    const click = this.doSomething.bind(this, "no")',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = this.doSomething.bind(this, "no")',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    const click = this.doSomething.bind(this, "no")',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}],
      parser: 'babel-eslint'
    },
    {
      code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={onClick.bind(this)}>Hello</div>
          )
        };
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '   return <div onClick={this.doSomething.bind(this, "hey")} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const doThing = this.doSomething.bind(this, "hey")',
        '    return <div onClick={doThing} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = () => true',
        '    const renderStuff = () => {',
        '      const click = this.doSomething.bind(this, "hey")',
        '      return <div onClick={click} />',
        '    }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [
        {message: 'JSX props should not use .bind()'},
        {message: 'JSX props should not use arrow functions'}
      ],
      parser: 'babel-eslint'
    },
    {
      code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : onClick.bind(this)}>Hello</div>
          )
        };
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : handleClick()}>Hello</div>
          )
        };
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? handleClick() : this.onClick.bind(this)}>Hello</div>
          )
        };
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },
    {
      code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={returningBoolean.bind(this) ? handleClick() : onClick()}>Hello</div>
          )
        };
      `,
      errors: [{message: 'JSX props should not use .bind()'}]
    },


    // Arrow functions
    {
      code: '<div onClick={() => alert("1337")}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: '<div onClick={async () => alert("1337")}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: '<div onClick={() => 42}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: '<div onClick={param => { first(); second(); }}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: '<div ref={c => this._input = c}></div>',
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = () => true',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    const click = () => true',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    const click = async () => true',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '   return <div onClick={() => true} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '   return <div onClick={async () => true} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const doThing = () => true',
        '    return <div onClick={doThing} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const doThing = async () => true',
        '    return <div onClick={doThing} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use arrow functions'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = ::this.onChange',
        '    const renderStuff = () => {',
        '      const click = () => true',
        '      return <div onClick={click} />',
        '    }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [
        {message: 'JSX props should not use arrow functions'},
        {message: 'JSX props should not use ::'}
      ],
      parser: 'babel-eslint'
    },

    // Functions
    {
      code: '<div onClick={function () { alert("1337") }}></div>',
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: '<div onClick={function * () { alert("1337") }}></div>',
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: '<div onClick={async function () { alert("1337") }}></div>',
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: '<div ref={function (c) { this._input = c }}></div>',
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = function () { return true }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = function * () { return true }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    const click = function () { return true }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    const click = async function () { return true }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '   return <div onClick={function () { return true }} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '   return <div onClick={function * () { return true }} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '   return <div onClick={async function () { return true }} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const doThing = function () { return true }',
        '    return <div onClick={doThing} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const doThing = async function () { return true }',
        '    return <div onClick={doThing} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() { ',
        '    const doThing = function * () { return true }',
        '    return <div onClick={doThing} />',
        '  }',
        '});'
      ].join('\n'),
      errors: [{message: 'JSX props should not use functions'}]
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = ::this.onChange',
        '    const renderStuff = () => {',
        '      const click = function () { return true }',
        '      return <div onClick={click} />',
        '    }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [
        {message: 'JSX props should not use functions'},
        {message: 'JSX props should not use ::'}
      ],
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
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv() {',
        '    const click = ::this.onChange',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv() {',
        '    const click = this.bar::baz',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = async () => {',
        '    const click = this.bar::baz',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Hello23 extends React.Component {',
        '  renderDiv = () => {',
        '    const click = true',
        '    const renderStuff = () => {',
        '      const click = this.bar::baz',
        '      return <div onClick={click} />',
        '    }',
        '    return <div onClick={click}>Hello</div>;',
        '  }',
        '};'
      ].join('\n'),
      errors: [{message: 'JSX props should not use ::'}],
      parser: 'babel-eslint'
    },

    // ignore DOM components
    {
      code: '<Foo onClick={this._handleClick.bind(this)} />',
      options: [{ignoreDOMComponents: true}],
      errors: [{message: 'JSX props should not use .bind()'}]
    }
  ]
});
