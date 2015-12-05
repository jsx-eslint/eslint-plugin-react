/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/prop-types');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('prop-types', rule, {

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
      ecmaFeatures: {
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World {this.props.children}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{
        ignore: ['children']
      }],
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: externalPropTypes,',
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
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class Hello {',
        '  render() {',
        '    return \'Hello\' + this.props.name;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello {',
        '  method',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var {firstname, lastname} = this.state, something = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: React.PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>{this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{ignore: ['name']}]
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
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
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
      ecmaFeatures: {
        jsx: true
      }
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
      env: {
        es6: true
      },
      ecmaFeatures: {
        experimentalObjectRestSpread: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      env: {
        es6: true
      },
      ecmaFeatures: {
        jsx: true
      }
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
      env: {
        es6: true
      },
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const {} = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n'),
      env: {
        es6: true
      },
      ecmaFeatures: {
        jsx: true
      }
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
        '  }',
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
        '  }',
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
      env: {
        es6: true
      },
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true
      }
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
      env: {
        es6: true
      },
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var a = function() {',
        '  var newProps1 = props1;',
        '  const newProps2 = props2;',
        '  let newProps3 = props3;',
        '};',
        'let b = function() {',
        '  var newProps4 = props;',
        '  const newProps5 = props;',
        '  let newProps6 = props;',
        '};',
        'const c = function() {',
        '  var newProps7 = props;',
        '  const newProps8 = props;',
        '  let newProps9 = props;',
        '};',
        'function d() {',
        '  var newProps10 = props;',
        '  const newProps11 = props;',
        '  let newProps12 = props;',
        '};',
        'const e = () => {',
        '  var newProps13 = props;',
        '  const newProps14 = props;',
        '  let newProps15 = props;',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      env: {
        es6: true
      }
    }
  ],

  invalid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return React.createElement("div", {}, this.props.name);',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: false
      },
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 54,
        type: 'Identifier'
      }]
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
      },
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 35,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 35,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'lastname\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: React.PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string.isRequired',
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
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: '\'propWithoutTypeDefinition\' is missing in props validation'
      }, {
        message: '\'name\' is missing in props validation'
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
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      },
      errors: [{
        message: '\'lastname\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes: { ',
        '    firstname: React.PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'firstname\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: React.PropTypes.shape({',
        '  })',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'a.b\' is missing in props validation'
      }]
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
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'a.b.c\' is missing in props validation'
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
        '    })',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'a.b.c\' is missing in props validation'},
        {message: '\'a.__.d\' is missing in props validation'},
        {message: '\'a.__.d.length\' is missing in props validation'},
        {message: '\'a.anything.e\' is missing in props validation'}
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
        '    })',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'a[].c\' is missing in props validation'},
        {message: '\'a[].d\' is missing in props validation'},
        {message: '\'a[].d.length\' is missing in props validation'},
        {message: '\'a[].e\' is missing in props validation'}
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
        '      c: React.PropTypes.number,',
        '      e: React.PropTypes.array',
        '    })',
        '  ])',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'a.length\' is missing in props validation'},
        {message: '\'a.b\' is missing in props validation'}
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
        '  "aria-controls": React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'propX\' is missing in props validation'}
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
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'some.value\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'arr\' is missing in props validation'}
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
        '    React.PropTypes.shape({})',
        '  )',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [
        {message: '\'arr[].some.value\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
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
        {message: '\'firstname\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var {\'props\': {firstname}} = this;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'firstname\' is missing in props validation'}
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
        '  lastname: React.PropTypes.string',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'firstname\' is missing in props validation'}
      ]
    }, {
      code: [
        'var Hello = function(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'function Hello(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'var Hello = (props) => {',
        '  return <div>Hello {props.name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'var Hello = (props) => {',
        '  const {name} = props;',
        '  return <div>Hello {name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var props = {firstname: \'John\'};',
        '    return <div>Hello {props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'source\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: props.source.uri }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'source\' is missing in props validation'},
        {message: '\'source.uri\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'source\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    this.state = { status: this.props.source.uri }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'source\' is missing in props validation'},
        {message: '\'source.uri\' is missing in props validation'}
      ]
    }, {
      code: [
        'function HelloComponent() {',
        '  class Hello extends React.Component {',
        '    render() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name\' is missing in props validation'}
      ]
    }, {
      code: [
        'function HelloComponent() {',
        '  var Hello = React.createClass({',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name\' is missing in props validation'}
      ]
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
        '    Hello = connectReduxForm({name: firstname})(Hello);',
        '    return <Hello />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'firstname\' is missing in props validation'},
        {message: '\'name\' is missing in props validation'}
      ]
    }, {
      code: [
        'const Hello = (props) => {',
        '  let team = props.names.map((name) => {',
        '      return <li>{name}, {props.company}</li>;',
        '    });',
        '  return <ul>{team}</ul>;',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'names\' is missing in props validation'},
        {message: '\'names.map\' is missing in props validation'},
        {message: '\'company\' is missing in props validation'}
      ]
    }, {
      code: [
        'const Annotation = props => (',
        '  <div>',
        '    {props.text}',
        '  </div>',
        ')'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'text\' is missing in props validation'}
      ]
    }, {
      code: [
        'for (var key in foo) {',
        '  var Hello = React.createClass({',
        '    render: function() {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  });',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name\' is missing in props validation'}
      ]
    }
  ]
});
