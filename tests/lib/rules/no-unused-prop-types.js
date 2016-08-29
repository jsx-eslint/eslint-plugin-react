/**
 * @fileoverview Warn about unused PropType definitions in React components
 * @author Evgueni Naverniouk
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-unused-prop-types');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

var settings = {
  react: {
    pragma: 'Foo'
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unused-prop-types', rule, {

  valid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: externalPropTypes.mySharedPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};',
        'Hello.propTypes.lastname = React.PropTypes.string;'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    var user = {',
        '      name: this.props.name',
        '    };',
        '    return <div>Hello {user.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello {',
        '  render() {',
        '    return \'Hello\' + this.props.name;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello {',
        '  method;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: React.PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, ...other } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var {firstname, lastname} = this.state, something = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: React.PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    if (this.props.hasOwnProperty(\'firstname\')) {',
        '      return <div>Hello {this.props.firstname}</div>;',
        '    }',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};',
        'Hello.propTypes.a = React.PropTypes.shape({',
        '  b: React.PropTypes.string',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '    b: React.PropTypes.shape({',
        '    })',
        '  })',
        '};',
        'Hello.propTypes.a.b.c = React.PropTypes.number;'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.objectOf(',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      d: React.PropTypes.string,',
        '      e: React.PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.arrayOf(',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      d: React.PropTypes.string,',
        '      e: React.PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.oneOfType([',
        '    React.PropTypes.array,',
        '    React.PropTypes.string',
        '  ])',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.c;',
        '    this.props.a[2] === true;',
        '    this.props.a.e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.oneOfType([',
        '    React.PropTypes.shape({',
        '      c: React.PropTypes.number,',
        '      e: React.PropTypes.array',
        '    }).isRequired,',
        '    React.PropTypes.arrayOf(',
        '      React.PropTypes.bool',
        '    )',
        '  ])',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.render;',
        '    this.props.a.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.instanceOf(Hello)',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.arr;',
        '    this.props.arr[3];',
        '    this.props.arr.length;',
        '    this.props.arr.push(3);',
        '    this.props.bo;',
        '    this.props.bo.toString();',
        '    this.props.fu;',
        '    this.props.fu.bind(this);',
        '    this.props.numb;',
        '    this.props.numb.toFixed();',
        '    this.props.stri;',
        '    this.props.stri.length();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  arr: React.PropTypes.array,',
        '  bo: React.PropTypes.bool.isRequired,',
        '  fu: React.PropTypes.func,',
        '  numb: React.PropTypes.number,',
        '  stri: React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { ',
        '      propX,',
        '      "aria-controls": ariaControls, ',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "propX": React.PropTypes.string,',
        '  "aria-controls": React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "some.value": React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": React.PropTypes.array',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1]["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": React.PropTypes.arrayOf(',
        '    React.PropTypes.shape({"some.value": React.PropTypes.string})',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var TestComp1 = React.createClass({',
        '  propTypes: {',
        '    size: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    var foo = {',
        '      baz: \'bar\'',
        '    };',
        '    var icons = foo[this.props.size].salut;',
        '    return <div>{icons}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const {firstname, lastname} = this.props.name;',
        '    return <div>{firstname} {lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape({',
        '    firstname: PropTypes.string,',
        '    lastname: PropTypes.string',
        '  })',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    let {firstname} = this;',
        '    return <div>{firstname}</div>;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    router: React.PropTypes.func',
        '  },',
        '  render: function() {',
        '    var nextPath = this.props.router.getCurrentQuery().nextPath;',
        '    return <div>{nextPath}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    firstname: CustomValidator.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: CustomValidator.map',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    outer: React.PropTypes.shape({',
        '      inner: CustomValidator.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: React.PropTypes.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name.get("test")}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}],
      parserOptions: parserOptions
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp1.propTypes = {',
        '  prop1: PropTypes.number',
        '};',
        'class Comp2 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp2.propTypes = {',
        '  prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'const SomeComponent = React.createClass({',
        '  propTypes: SomeOtherComponent.propTypes',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    let { a, ...b } = obj;',
        '    let c = { ...d };',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    var users = this.props.users.find(user => user.name === \'John\');',
        '    return <div>Hello you {users.length}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  users: React.PropTypes.arrayOf(React.PropTypes.object)',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const {} = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var foo = \'fullname\';',
        '    var { [foo]: firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '  static propTypes = {',
        '    source: PropTypes.object',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source.uri }',
        '  }',
        '  static propTypes = {',
        '    source: PropTypes.object',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Should not be detected as a component
      code: [
        'HelloJohn.prototype.render = function() {',
        '  return React.createElement(Hello, {',
        '    name: this.props.firstname',
        '  });',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function HelloComponent() {',
        '  class Hello extends React.Component {',
        '    render() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '  Hello.propTypes = { name: React.PropTypes.string };',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function HelloComponent() {',
        '  var Hello = React.createClass({',
        '    propTypes: { name: React.PropTypes.string },',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class DynamicHello extends Component {',
        '  render() {',
        '    const {firstname} = this.props;',
        '    class Hello extends Component {',
        '      render() {',
        '        const {name} = this.props;',
        '        return <div>Hello {name}</div>;',
        '      }',
        '    }',
        '    Hello.propTypes = {',
        '      name: PropTypes.string',
        '    };',
        '    Hello = connectReduxForm({name: firstname})(Hello);',
        '    return <Hello />;',
        '  }',
        '}',
        'DynamicHello.propTypes = {',
        '  firstname: PropTypes.string,',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};',
        'Hello.propTypes = {',
        '  names: React.PropTypes.array,',
        '  company: React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'export default {',
        '  renderHello() {',
        '    let {name} = this.props;',
        '    return <div>{name}</div>;',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Reassigned props are ignored
      code: [
        'export class Hello extends Component {',
        '  render() {',
        '    const props = this.props;',
        '    return <div>Hello {props.name.firstname} {props[\'name\'].lastname}</div>',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'export default function FooBar(props) {',
        '  const bar = props.bar;',
        '  return (<div bar={bar}><div {...props}/></div>);',
        '}',
        'if (process.env.NODE_ENV !== \'production\') {',
        '  FooBar.propTypes = {',
        '    bar: React.PropTypes.string',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var {...other} = this.props;',
        '    return (',
        '      <div {...other} />',
        '    );',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const statelessComponent = (props) => {',
        '  const subRender = () => {',
        '    return <span>{props.someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const statelessComponent = ({ someProp }) => {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const statelessComponent = function({ someProp }) {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'function statelessComponent({ someProp }) {',
        '  const subRender = () => {',
        '    return <span>{someProp}</span>;',
        '  };',
        '  return <div>{subRender()}</div>;',
        '};',
        'statelessComponent.propTypes = {',
        '  someProp: PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'function notAComponent({ something }) {',
        '  return something + 1;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const notAComponent = function({ something }) {',
        '  return something + 1;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'const notAComponent = ({ something }) => {',
        '  return something + 1;',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Validation is ignored on reassigned props object
      code: [
        'const statelessComponent = (props) => {',
        '  let newProps = props;',
        '  return <span>{newProps.someProp}</span>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: string;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: {',
        '      firstname: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
        'class Hello extends React.Component {',
        '  props: {people: Person[];};',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[];};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
        'type Props = {people: Person[]|Person;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    if (Array.isArray(this.props.people)) {',
        '      for (var i = 0; i < this.props.people.length; i++) {',
        '        names.push(this.props.people[i].name.firstname);',
        '      }',
        '    } else {',
        '      names.push(this.props.people.name.firstname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {ok: string | boolean;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props = {a: 123};',
        '  render () {',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Ignore component validation if propTypes are composed using spread
      code: [
        'class Hello extends React.Component {',
        '    render() {',
        '        return  <div>Hello {this.props.firstName} {this.props.lastName}</div>;',
        '    }',
        '};',
        'const otherPropTypes = {',
        '    lastName: React.PropTypes.string',
        '};',
        'Hello.propTypes = {',
        '    ...otherPropTypes,',
        '    firstName: React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Ignore destructured function arguments
      code: [
        'class Hello extends React.Component {',
        '  render () {',
        '    return ["string"].map(({length}) => <div>{length}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      // Flow annotations on stateless components
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'function Hello(props: Props): React.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'const Hello = function(props: Props): React.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  firstname: string;',
        '  lastname: string;',
        '};',
        'const Hello = (props: Props): React.Element => {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'Card.propTypes = {',
        '  title: PropTypes.string.isRequired,',
        '  children: PropTypes.element.isRequired,',
        '  footer: PropTypes.node',
        '}',
        'function Card ({ title, children, footer }) {',
        '  return (',
        '    <div/>',
        '  )',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    }, {
      code: [
        'function JobList(props) {',
        '  props',
        '  .jobs',
        '  .forEach(() => {});',
        '  return <div></div>;',
        '}',
        'JobList.propTypes = {',
        '  jobs: PropTypes.array',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  firstname: ?string,',
        '};',
        'function Hello({firstname}: Props): React$Element {',
        '  return <div>Hello {firstname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function Greetings() {',
        '  return <div>{({name}) => <Hello name={name} />}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function Greetings() {',
        '  return <div>{function({name}) { return <Hello name={name} />; }}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Should stop at the class when searching for a parent component
      code: [
        'export default (ComposedComponent) => class Something extends SomeOtherComponent {',
        '  someMethod = ({width}) => {}',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Should stop at the decorator when searching for a parent component
      code: [
        '@asyncConnect([{',
        '  promise: ({dispatch}) => {}',
        '}])',
        'class Something extends Component {}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured shape props can't be tested, unless we use `skipShapeProps`
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    params: PropTypes.shape({',
        '      id: PropTypes.string',
        '    })',
        '   }',
        '  render () {',
        '    const {params} = this.props',
        '    const id = (params || {}).id;',
        '    return <span>{id}</span>',
        '  }',
        '}'
      ].join('\n'),
      options: [{skipShapeProps: true}],
      parser: 'babel-eslint'
    }, {
      // Destructured props in componentWillReceiveProps shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps (nextProps) {',
        '    const {something} = nextProps;',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps ({something}) {',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in the constructor shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  constructor (props) {',
        '    super(props);',
        '    const {something} = props;',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the constructor shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  constructor ({something}) {',
        '    super({something});',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `componentWillReceiveProps` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `componentWillReceiveProps` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `shouldComponentUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `shouldComponentUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `componentWillUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, nextState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }, {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions
    }
  ],


  invalid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    unused: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return React.createElement("div", {}, this.props.value);',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: false
      },
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.value}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'name\' PropType is defined but prop is never used',
        line: 3,
        column: 11
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.value}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'name\' PropType is defined but prop is never used',
        line: 3,
        column: 11
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: React.PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    unused: React.PropTypes.string.isRequired,',
        '    anotherunused: React.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;',
        '  }',
        '});',
        'var Hello2 = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }, {
        message: '\'anotherunused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, lastname } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.z',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '    b: PropTypes.string',
        '  })',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'a.b\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.z;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '    b: React.PropTypes.shape({',
        '      c: React.PropTypes.string',
        '    })',
        '  })',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'a.b.c\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    this.props.a.__.d.length;',
        '    this.props.a.anything.e[2];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.objectOf(',
        '    React.PropTypes.shape({',
        '      unused: PropTypes.string',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: '\'a.*.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var i = 3;',
        '    this.props.a[2].c;',
        '    this.props.a[i].d.length;',
        '    this.props.a[i + 2].e[2];',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.arrayOf(',
        '    React.PropTypes.shape({',
        '      unused: PropTypes.string',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: '\'a.*.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    this.props.a.b;',
        '    this.props.a.e.length;',
        '    this.props.a.e.anyProp;',
        '    this.props.a.c.toString();',
        '    this.props.a.c.someThingElse();',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.oneOfType([',
        '    React.PropTypes.shape({',
        '      unused: React.PropTypes.number,',
        '      anotherunused: React.PropTypes.array',
        '    })',
        '  ])',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: '\'a.unused\' PropType is defined but prop is never used'},
        {message: '\'a.anotherunused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { ',
        '      "aria-controls": ariaControls, ',
        '      propX,',
        '      ...props } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "aria-unused": React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'aria-unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "some.unused": React.PropTypes.string',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: '\'some.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1]["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": React.PropTypes.arrayOf(',
        '    React.PropTypes.shape({',
        '      "some.unused": React.PropTypes.string',
        '})',
        '  )',
        '};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [
        {message: '\'arr.*.some.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    unused: React.PropTypes.string',
        '  }',
        '  render() {',
        '    var text;',
        '    text = \'Hello \';',
        '    let {props: {firstname}} = this;',
        '    return <div>{text} {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    if (true) {',
        '      return <span>{this.props.firstname}</span>',
        '    } else {',
        '      return <span>{this.props.lastname}</span>',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  unused: React.PropTypes.string',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'var Hello = function(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'function Hello(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = (props) => {',
        '  return <div>Hello {props.name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = (props) => {',
        '  const {name} = props;',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'function Hello({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Hello = function({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Hello = ({ name }) => {',
        '  return <div>Hello {name}</div>;',
        '}',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {unused: PropTypes.string}',
        '  render() {',
        '    var props = {firstname: \'John\'};',
        '    return <div>Hello {props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {unused: PropTypes.string}',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {unused: PropTypes.string}',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'function HelloComponent() {',
        '  var Hello = React.createClass({',
        '    propTypes: {unused: PropTypes.string},',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};',
        'Hello.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const Annotation = props => (',
        '  <div>',
        '    {props.text}',
        '  </div>',
        ')',
        'Annotation.prototype.propTypes = {unused: PropTypes.string};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'for (var key in foo) {',
        '  var Hello = React.createClass({',
        '    propTypes: {unused: PropTypes.string},',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'var propTypes = {',
        '  unused: React.PropTypes.string',
        '};',
        'class Test extends React.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = propTypes;'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = {',
        '  unused: React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: settings,
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        '/** @jsx Foo */',
        'class Test extends Foo.Component {',
        '  render() {',
        '    return (',
        '      <div>{this.props.firstname} {this.props.lastname}</div>',
        '    );',
        '  }',
        '}',
        'Test.propTypes = {',
        '  unused: React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    unused: PropTypes.string',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    unused: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {unused: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: {',
        '      unused: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {name: {unused: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {person: {name: {unused: string;};};};',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'person.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {person: {name: {unused: string;};};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'person.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Person = {name: {unused: string;}};',
        'class Hello extends React.Component {',
        '  props: {people: Person[];};',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.lastname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'people.*.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Person = {name: {unused: string;}};',
        'type Props = {people: Person[];};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    var names = [];',
        '    for (var i = 0; i < this.props.people.length; i++) {',
        '      names.push(this.props.people[i].name.lastname);',
        '    }',
        '    return <div>Hello {names.join(', ')}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'people.*.name.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
          {message: '\'result.ok\' PropType is defined but prop is never used'},
          {message: '\'result.ok\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'function Greetings({names}) {',
        '  names = names.map(({firstname, lastname}) => <div>{firstname} {lastname}</div>);',
        '  return <Hello>{names}</Hello>;',
        '}',
        'Greetings.propTypes = {unused: Object};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const MyComponent = props => (',
        '  <div onClick={() => props.toggle()}></div>',
        ')',
        'MyComponent.propTypes = {unused: Object};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const MyComponent = props => props.test ? <div /> : <span />',
        'MyComponent.propTypes = {unused: Object};'
      ].join('\n'),
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'type Props = {',
        '  unused: ?string,',
        '};',
        'function Hello({firstname, lastname}: Props): React$Element {',
        '  return <div>Hello {firstname} {lastname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  constructor (props) {',
        '    super(props);',
        '    const {something} = props;',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  constructor ({something}) {',
        '    super({something});',
        '    doSomething(something);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillReceiveProps ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, prevState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    unused: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, prevState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      parserOptions: parserOptions,
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }/* , {
      // Enable this when the following issue is fixed
      // https://github.com/yannickcr/eslint-plugin-react/issues/296
      code: [
        'function Foo(props) {',
        '  const { bar: { nope } } = props;',
        '  return <div test={nope} />;',
        '}',
        'Foo.propTypes = {',
        '  foo: PropTypes.number,',
        '  bar: PropTypes.shape({',
        '    faz: PropTypes.number,',
        '    qaz: PropTypes.object,',
        '  }),',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used'
      }]
    }*/
  ]
});
