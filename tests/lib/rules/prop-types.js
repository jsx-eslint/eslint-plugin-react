/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prop-types');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Foo'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prop-types', rule, {

  valid: [
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>Hello World {this.props.children}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{
        ignore: ['children']
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: externalPropTypes.mySharedPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string',
        '};',
        'Hello.propTypes.lastname = PropTypes.string;'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    var user = {',
        '      name: this.props.name',
        '    };',
        '    return <div>Hello {user.name}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'class Hello {',
        '  render() {',
        '    return \'Hello\' + this.props.name;',
        '  }',
        '}'
      ].join('\n')
    }, {
      code: [
        'class Hello {',
        '  method;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, ...other } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var {firstname, lastname} = this.state, something = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': PropTypes.string',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    if (Object.prototype.hasOwnProperty.call(this.props, \'firstname\')) {',
        '      return <div>Hello {this.props.firstname}</div>;',
        '    }',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': PropTypes.string',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};',
        'Hello.propTypes.a = PropTypes.shape({',
        '  b: PropTypes.string',
        '});'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.b.c;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.shape({',
        '    b: PropTypes.shape({',
        '    })',
        '  })',
        '};',
        'Hello.propTypes.a.b.c = PropTypes.number;'
      ].join('\n')
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
        '  a: PropTypes.objectOf(',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      d: PropTypes.string,',
        '      e: PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n')
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
        '  a: PropTypes.arrayOf(',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      d: PropTypes.string,',
        '      e: PropTypes.array',
        '    })',
        '  )',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props.a.length;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  a: PropTypes.oneOfType([',
        '    PropTypes.array,',
        '    PropTypes.string',
        '  ])',
        '};'
      ].join('\n')
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
        '  a: PropTypes.oneOfType([',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      e: PropTypes.array',
        '    }).isRequired,',
        '    PropTypes.arrayOf(',
        '      PropTypes.bool',
        '    )',
        '  ])',
        '};'
      ].join('\n')
    }, {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOfType([
            PropTypes.shape({
              bar: PropTypes.string
            }),
            PropTypes.shape({
              baz: PropTypes.string
            })
          ])
        };
      `
    }, {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOfType([
            PropTypes.shape({
              bar: PropTypes.string
            }),
            PropTypes.instanceOf(Baz)
          ])
        };
      `
    }, {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOf(['bar', 'baz'])
        };
      `
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
        '  a: PropTypes.instanceOf(Hello)',
        '};'
      ].join('\n')
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
        '  arr: PropTypes.array,',
        '  bo: PropTypes.bool.isRequired,',
        '  fu: PropTypes.func,',
        '  numb: PropTypes.number,',
        '  stri: PropTypes.string',
        '};'
      ].join('\n')
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
        '  "propX": PropTypes.string,',
        '  "aria-controls": PropTypes.string',
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
        '  "some.value": PropTypes.string',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": PropTypes.array',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    this.props["arr"][1]["some.value"];',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "arr": PropTypes.arrayOf(',
        '    PropTypes.shape({"some.value": PropTypes.string})',
        '  )',
        '};'
      ].join('\n')
    }, {
      code: [
        'var TestComp1 = createReactClass({',
        '  propTypes: {',
        '    size: PropTypes.string',
        '  },',
        '  render: function() {',
        '    var foo = {',
        '      baz: \'bar\'',
        '    };',
        '    var icons = foo[this.props.size].salut;',
        '    return <div>{icons}</div>;',
        '  }',
        '});'
      ].join('\n')
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
        'const foo = {};',
        'class Hello extends React.Component {',
        '  render() {',
        '    const {firstname, lastname} = this.props.name;',
        '    return <div>{firstname} {lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape(foo)',
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
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    router: PropTypes.func',
        '  },',
        '  render: function() {',
        '    var nextPath = this.props.router.getCurrentQuery().nextPath;',
        '    return <div>{nextPath}</div>;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    firstname: CustomValidator.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    }, {
      code: [
        'var Hello = createReactClass({',
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
      options: [{customValidators: ['CustomValidator']}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    outer: PropTypes.shape({',
        '      inner: CustomValidator.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    outer: CustomValidator.shape({',
        '      inner: PropTypes.string',
        '    })',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.outer.inner}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name.get("test")}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{customValidators: ['CustomValidator']}]
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
        'class Comp1 extends Component {',
        '  render() {',
        '    return <span />;',
        '  }',
        '}',
        'Comp1.propTypes = {',
        '  prop1: PropTypes.number',
        '};',
        'class Comp2 extends Component {',
        '  static propTypes = {',
        '    prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '  }',
        '  render() {',
        '    return <span />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
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
        'var Comp2 = createReactClass({',
        '  propTypes: {',
        '    prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)',
        '  },',
        '  render() {',
        '    return <span />;',
        '  }',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'const SomeComponent = createReactClass({',
        '  propTypes: SomeOtherComponent.propTypes',
        '});'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    let { a, ...b } = obj;',
        '    let c = { ...d };',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {}',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n')
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
        '  users: PropTypes.arrayOf(PropTypes.object)',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const {} = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n')
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
        '  Hello.propTypes = { name: PropTypes.string };',
        '  return Hello;',
        '}',
        'module.exports = HelloComponent();'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'function HelloComponent() {',
        '  var Hello = createReactClass({',
        '    propTypes: { name: PropTypes.string },',
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
        '  names: PropTypes.array,',
        '  company: PropTypes.string',
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
        '    bar: PropTypes.string',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    var {...other} = this.props;',
        '    return (',
        '      <div {...other} />',
        '    );',
        '  }',
        '});'
      ].join('\n')
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
      ].join('\n')
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
      ].join('\n')
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
      ].join('\n')
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
      ].join('\n')
    }, {
      code: [
        'function notAComponent({ something }) {',
        '  return something + 1;',
        '};'
      ].join('\n')
    }, {
      code: [
        'const notAComponent = function({ something }) {',
        '  return something + 1;',
        '};'
      ].join('\n')
    }, {
      code: [
        'const notAComponent = ({ something }) => {',
        '  return something + 1;',
        '};'
      ].join('\n')
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
        'type Props = {\'data-action\': string};',
        'function Button({ \'data-action\': dataAction }: Props) {',
        '  return <div data-action={dataAction} />;',
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
        'type Props = {name: {firstname: string; lastname: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
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
        '    lastName: PropTypes.string',
        '};',
        'Hello.propTypes = {',
        '    ...otherPropTypes,',
        '    firstName: PropTypes.string',
        '};'
      ].join('\n')
    }, {
      // Ignore destructured function arguments
      code: [
        'class Hello extends React.Component {',
        '  render () {',
        '    return ["string"].map(({length}) => <div>{length}</div>);',
        '  }',
        '}'
      ].join('\n')
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
        'type Props = {',
        '  \'completed?\': boolean,',
        '};',
        'const Hello = (props: Props): React.Element => {',
        '  return <div>{props[\'completed?\']}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {',
        '  name: string,',
        '};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render() {',
        '    const {name} = this.props;',
        '    return name;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type PropsUnionA = {',
        '  a: string,',
        '  b?: void,',
        '};',
        'type PropsUnionB = {',
        '  a?: void,',
        '  b: string,',
        '};',
        'type Props = {',
        '  name: string,',
        '} & (PropsUnionA | PropsUnionB);',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render() {',
        '    const {name} = this.props;',
        '    return name;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type { FieldProps } from "redux-form"',
        '',
        'type Props = {',
        'label: string,',
        '  type: string,',
        '  options: Array<SelectOption>',
        '} & FieldProps'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Impossible intersection type
      code: `
        import React from 'react';
        type Props = string & {
          fullname: string
        };
        class Test extends React.PureComponent<Props> {
          render() {
            return <div>Hello {this.props.fullname}</div>
          }
        }
      `,
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
      ].join('\n')
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
      // Should not find any used props
      code: [
        'function Hello(props) {',
        '  const {...rest} = props;',
        '  return <div>Hello</div>;',
        '}'
      ].join('\n')
    }, {
      code: [
        'let Greetings = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '};',
        'Greetings.propTypes = {',
        '  name: PropTypes.string',
        '}'
      ].join('\n')
    }, {
      code: [
        'let Greetings = {',
        '  Hello: class extends React.Component {',
        '    render () {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {',
        '  name: PropTypes.string',
        '};'
      ].join('\n')
    }, {
      code: [
        'let Greetings = {};',
        'Greetings.Hello = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '};',
        'Greetings.Hello.propTypes = {',
        '  name: PropTypes.string',
        '}'
      ].join('\n')
    }, {
      code: [
        'function Hello({names}) {',
        '  return names.map((name) => {',
        '    return <div>{name}</div>;',
        '  });',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Target = { target: EventTarget }',
        'class MyComponent extends Component {',
        '  static propTypes = {',
        '    children: PropTypes.any,',
        '  }',
        '  handler({ target }: Target) {}',
        '  render() {',
        '    return <div>{this.props.children}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {}',
        'Hello.Foo = ({foo}) => (',
        '  <div>Hello {foo}</div>',
        ')',
        'Hello.Foo.propTypes = {',
        '  foo: PropTypes.node',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{skipUndeclared: true}]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>{this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{skipUndeclared: false}]
    }, {
      // Async functions can't be components.
      code: [
        'var Hello = async function(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Async functions can't be components.
      code: [
        'async function Hello(props) {',
        '  return <div>Hello {props.name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Async functions can't be components.
      code: [
        'var Hello = async (props) => {',
        '  return <div>Hello {props.name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Flow annotations with variance
      code: [
        'type Props = {',
        '  +firstname: string;',
        '  -lastname: string;',
        '};',
        'function Hello(props: Props): React.Element {',
        '  const {firstname, lastname} = props;',
        '  return <div>Hello {firstname} {lastname}</div>',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends React.Component {',
        '  async onSelect({ name }) {',
        '    return null;',
        '  }',
        '  render() {',
        '    return <Greeting onSelect={this.onSelect} />;',
        '  }',
        '}'
      ].join('\n')
    }, {
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    onDelete: PropTypes.func.isRequired',
        '  }',
        '  handleDeleteConfirm = () => {',
        '    this.props.onDelete();',
        '  };',
        '  handleSubmit = async ({certificate, key}) => {};',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  ...data,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {|',
        '  ...data,',
        '  lastname: string',
        '|};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  ...$Exact<data>,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type {Data} from \'./Data\'',
        'type Person = {',
        '  ...Data,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.bar}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type {Data} from \'some-libdef-like-flow-typed-provides\'',
        'type Person = {',
        '  ...Data,',
        '  lastname: string',
        '};',
        'class Hello extends React.Component {',
        '  props: Person;',
        '  render () {',
        '    return <div>Hello {this.props.bar}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type {BasePerson} from \'./types\'',
        'type Props = {',
        '  person: {',
        '   ...$Exact<BasePerson>,',
        '   lastname: string',
        '  }',
        '};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const { firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const { firstname } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: [
        'type Note = {text: string, children?: Note[]};',
        'type Props = {',
        '  notes: Note[];',
        '};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.notes[0].text}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'import type Props from "fake";',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.ok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      parser: 'babel-eslint'
    }, {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props;

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        import type { PropsA } from "./myPropsA";
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsA = { bar: string };
        type PropsB = { zap: string };
        type Props = PropsA & {
          baz: string
        };

        class Bar extends React.Component {
          props: Props & PropsB;

          render() {
            return <div>{this.props.bar} - {this.props.zap} - {this.props.baz}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsA = { bar: string };
        type PropsB = { zap: string };
        type Props =  {
          baz: string
        } & PropsA;

        class Bar extends React.Component {
          props: Props & PropsB;

          render() {
            return <div>{this.props.bar} - {this.props.zap} - {this.props.baz}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = { foo: string }
        function higherOrderComponent<Props>() {
          return class extends React.Component<Props> {
            render() {
              return <div>{this.props.foo}</div>
            }
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        function higherOrderComponent<P: { foo: string }>() {
          return class extends React.Component<P> {
            render() {
              return <div>{this.props.foo}</div>
            }
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        const withOverlayState = <P: {foo: string}>(WrappedComponent: ComponentType<P>): CpmponentType<P> => (
          class extends React.Component<P> {
            constructor(props) {
              super(props);
              this.state = {foo: props.foo}
            }
            render() {
              return <div>Hello World</div>
            }
          }
        )
      `,
      parser: 'babel-eslint'
    },

    // issue #1288
    `function Foo() {
      const props = {}
      props.bar = 'bar'
      return <div {...props} />
    }`,
    // issue #1288
    `function Foo(props) {
      props.bar = 'bar';
      return <div {...props} />;
    }`,
    {
      // issue #106
      code: `
      import React from 'react';
      import SharedPropTypes from './SharedPropTypes';

      export default class A extends React.Component {
        render() {
          return (
            <span
              a={this.props.a}
              b={this.props.b}
              c={this.props.c}>
              {this.props.children}
            </span>
          );
        }
      }

      A.propTypes = {
        a: React.PropTypes.string,
        ...SharedPropTypes // eslint-disable-line object-shorthand
      };
    `,
      parser: 'babel-eslint'
    },
    {
      code: `
      // @flow
      import * as React from 'react'

      type Props = {}

      const func = <OP: *>(arg) => arg

      const hoc = <OP>() => () => {
        class Inner extends React.Component<Props & OP> {
          render() {
            return <div />
          }
        }
      }
    `,
      parser: 'babel-eslint'
    },
    {
      code: `
        const Slider = props => (
          <RcSlider {...props} />
        );

        Slider.propTypes = RcSlider.propTypes;
      `
    },
    {
      code: `
        const Slider = props => (
          <RcSlider foo={props.bar} />
        );

        Slider.propTypes = RcSlider.propTypes;
      `
    },
    {
      code: `
        class Foo extends React.Component {
          bar() {
            this.setState((state, props) => ({ current: props.current }));
          }
          render() {
            return <div />;
          }
        }

        Foo.propTypes = {
          current: PropTypes.number.isRequired,
        };
      `
    },
    {
      code: `
        class Foo extends React.Component {
          static getDerivedStateFromProps(props) {
            const { foo } = props;
            return {
              foobar: foo
            };
          }

          render() {
            const { foobar } = this.state;
            return <div>{foobar}</div>;
          }
        }

        Foo.propTypes = {
          foo: PropTypes.func.isRequired,
        };
      `,
      settings: {react: {version: '16.3.0'}}
    },
    {
      code: `
        const HeaderBalance = React.memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
        HeaderBalance.propTypes = {
          cryptoCurrency: PropTypes.string
        };
      `
    },
    {
      code: `
        import React, { memo } from 'react';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
        HeaderBalance.propTypes = {
          cryptoCurrency: PropTypes.string
        };
      `
    },
    {
      code: `
        import Foo, { memo } from 'foo';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
        HeaderBalance.propTypes = {
          cryptoCurrency: PropTypes.string
        };
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
        const Label = React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
      `
    },
    {
      code: `
        const Label = Foo.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
        import React, { forwardRef } from 'react';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
      `
    },
    {
      code: `
        import Foo, { forwardRef } from 'foo';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: `
      class Foo extends React.Component {
        propTypes = {
          actions: PropTypes.object.isRequired,
        };
        componentWillReceiveProps (nextProps) {
          this.props.actions.doSomething();
        }

        componentWillUnmount () {
          this.props.actions.doSomething();
        }

        render() {
          return <div>foo</div>;
        }
      }
      `,
      parser: 'babel-eslint'
    },
    {
      code: `
      class Foo extends React.Component {
        componentDidUpdate() { this.inputRef.focus(); }
        render() {
          return (
            <div>
              <input ref={(node) => { this.inputRef = node; }} />
            </div>
          )
        }
      }
      `
    },
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate(nextProps, nextState) {
            const {
                first_organization,
                second_organization,
            } = this.state;
            return true;
          }
          render() {
            return <div>hi</div>;
          }
        }
      `
    },
    {
      code: `
      class Foo extends React.Component {
        shouldComponentUpdate(nextProps) {
          if (this.props.search !== nextProps.search) {
            let query = nextProps.query;
            let result = nextProps.list.filter(item => {
              return (item.name.toLowerCase().includes(query.trim().toLowerCase()));
            });

            this.setState({ result });

            return true;
          }
        }
        render() {
          return <div>foo</div>;
        }
      }
      Foo.propTypes = {
        search: PropTypes.object,
        list: PropTypes.array,
        query: PropTypes.string,
      };
      `
    },
    {
      code: [
        'export default class LazyLoader extends Component {',
        '  static propTypes = {',
        '    children: PropTypes.node,',
        '    load: PropTypes.any,',
        '  };',
        '  state = { mod: null };',
        '  shouldComponentUpdate(prevProps) {',
        '    assert(prevProps.load === this.props.load);',
        '    return true;',
        '  }',
        '  load() {',
        '    this.props.load(mod => {',
        '      this.setState({',
        '        mod: mod.default ? mod.default : mod',
        '      });',
        '    });',
        '  }',
        '  render() {',
        '    if (this.state.mod !== null) {',
        '      return this.props.children(this.state.mod);',
        '    }',
        '    this.load();',
        '    return null;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: `
        import React from 'react';
        import PropTypes from 'prop-types';
        import {connect} from 'react-redux';

        class Foo extends React.Component {
          render() {
            return this.props.children;
          }
        }

        Foo.propTypes = {
          children: PropTypes.element.isRequired
        };

        export const Unconnected = Foo;
        export default connect(Foo);
      `
    }, {
      code: `
        const a = {};
        function fn1() {}
        const b = a::fn1();
      `,
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: [
        'type Props = {',
        '  name: string,',
        '};',
        'class Hello extends React.Component {',
        '  foo(props: Props) {}',
        '  render() {',
        '    return this.props.name;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 7,
        column: 23,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return React.createElement("div", {}, this.props.name);',
        '  }',
        '});'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 54,
        type: 'Identifier'
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
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
        '    const { name, ...rest } = this.props',
        '    return <div>Hello</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 13,
        type: 'Property'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    const { name, title, ...rest } = this.props',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.string',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'title\' is missing in props validation',
        line: 3,
        column: 19,
        type: 'Property'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '   renderStuff() {',
        '    const { name, ...rest } = this.props',
        '    return (<div {...rest}>{name}</div>);',
        '  }',
        '  render() {',
        '    this.renderStuff()',
        '  }',
        '}',
        'Hello.propTypes = {}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 13,
        type: 'Property'
      }]
    }, {
      code: [
        '/** @extends React.Component */',
        'class Hello extends ChildComponent {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 4,
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
        '  firstname: PropTypes.string',
        '};'
      ].join('\n'),
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
        '  name: PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;',
        '  }',
        '});',
        'var Hello2 = createReactClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
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
        '  firstname: PropTypes.string',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'lastname\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes: { ',
        '    firstname: PropTypes.string',
        '  };',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
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
        '  a: PropTypes.shape({',
        '  })',
        '};'
      ].join('\n'),
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
        '  a: PropTypes.shape({',
        '    b: PropTypes.shape({',
        '    })',
        '  })',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'a.b.c\' is missing in props validation'
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
        '  a: PropTypes.shape({})',
        '};',
        'Hello.propTypes.a.b = PropTypes.shape({});'
      ].join('\n'),
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
        '  a: PropTypes.objectOf(',
        '    PropTypes.shape({',
        '    })',
        '  )',
        '};'
      ].join('\n'),
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
        '  a: PropTypes.arrayOf(',
        '    PropTypes.shape({',
        '    })',
        '  )',
        '};'
      ].join('\n'),
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
        '  a: PropTypes.oneOfType([',
        '    PropTypes.shape({',
        '      c: PropTypes.number,',
        '      e: PropTypes.array',
        '    })',
        '  ])',
        '};'
      ].join('\n'),
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
        '  "aria-controls": PropTypes.string',
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
        '  "arr": PropTypes.arrayOf(',
        '    PropTypes.shape({})',
        '  )',
        '};'
      ].join('\n'),
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
        '  lastname: PropTypes.string',
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
        'function Hello({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'const Hello = function({ name }) {',
        '  return <div>Hello {name}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'const Hello = ({ name }) => {',
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
        '  var Hello = createReactClass({',
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
        '  var Hello = createReactClass({',
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
    }, {
      code: [
        'var propTypes = {',
        '  firstname: PropTypes.string',
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
        {message: '\'lastname\' is missing in props validation'}
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
        '  firstname: PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: settings,
      errors: [
        {message: '\'lastname\' is missing in props validation'}
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
        'Test.propTypes = forbidExtraProps({',
        '  firstname: PropTypes.string',
        '});'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps']
      }),
      errors: [
        {message: '\'lastname\' is missing in props validation'}
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
        'Test.propTypes = Object.freeze({',
        '  firstname: PropTypes.string',
        '});'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['Object.freeze']
      }),
      errors: [
        {message: '\'lastname\' is missing in props validation'}
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
        '  firstname: PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {};',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {',
        '    name: Object;',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'firstname\' is missing in props validation'}
      ]
    }, {
      code: [
        'type Props = {name: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
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
        '  props: {',
        '    name: {',
        '      firstname: string;',
        '    }',
        '  };',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  props: {person: {name: {firstname: string;};};};',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'person.name.lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'type Props = {person: {name: {firstname: string;};};};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.person.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'person.name.lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
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
        {message: '\'people[].name.lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'type Person = {name: {firstname: string;}};',
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
        {message: '\'people[].name.lastname\' is missing in props validation'}
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
        {message: '\'result.notok\' is missing in props validation'}
      ]
    }, {
      code: [
        'let Greetings = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Greetings.propTypes = {};'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'let Greetings = {',
        '  Hello: class extends React.Component {',
        '    render () {',
        '      return <div>Hello {this.props.name}</div>;',
        '    }',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {};'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'let Greetings = {};',
        'Greetings.Hello = class extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Greetings.Hello.propTypes = {};'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'function Greetings({names}) {',
        '  names = names.map(({firstname, lastname}) => <div>{firstname} {lastname}</div>);',
        '  return <Hello>{names}</Hello>;',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'names\' is missing in props validation'
      }]
    }, {
      code: [
        'const MyComponent = props => (',
        '  <div onClick={() => props.toggle()}></div>',
        ')'
      ].join('\n'),
      errors: [{
        message: '\'toggle\' is missing in props validation'
      }]
    }, {
      code: [
        'const MyComponent = props => props.test ? <div /> : <span />'
      ].join('\n'),
      errors: [{
        message: '\'test\' is missing in props validation'
      }]
    }, {
      code: [
        'const TestComponent = props =>',
        '  <div onClick={() => props.test()} />',
        'const mapStateToProps = (_, props) => ({',
        '  otherProp: props.otherProp,',
        '})'
      ].join('\n'),
      errors: [{
        message: '\'test\' is missing in props validation'
      }]
    }, {
      code: [
        'type Props = {',
        '  firstname: ?string,',
        '};',
        'function Hello({firstname, lastname}: Props): React$Element {',
        '  return <div>Hello {firstname} {lastname}</div>;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  constructor(props, context) {',
        '    super(props, context)',
        '    const firstname = props.firstname;',
        '    const {lastname} = props;',
        '    this.state = {',
        '      firstname,',
        '      lastname',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'firstname\' is missing in props validation'},
        {message: '\'lastname\' is missing in props validation'}
      ]
    }, {
      code: [
        'function Hello(props) {',
        '  return <div>{props.name.constructor.firstname}</div>',
        '}',
        'Hello.propTypes = {',
        '  name: PropTypes.shape({',
        '    firstname: PropTypes.object',
        '  })',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'name.constructor.firstname\' is missing in props validation'}
      ]
    }, {
      code: [
        'function SomeComponent({bar}) {',
        '  function f({foo}) {}',
        '  return <div className={f()}>{bar}</div>;',
        '}'
      ].join('\n'),
      errors: [
        {message: '\'bar\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.PureComponent {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 35,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends PureComponent {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 35,
        type: 'Identifier'
      }]
    }, {
      code: [
        'type MyComponentProps = {',
        '  a: number,',
        '};',
        'function MyComponent({ a, b }: MyComponentProps) {',
        '  return <div />;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'b\' is missing in props validation',
        line: 4,
        column: 27,
        type: 'Property'
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {},',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [{
        message: '\'firstname\' is missing in props validation',
        line: 4,
        column: 29
      }]
    }, {
      code: [
        'var Hello = function(props) {',
        '  return <div>{props.firstname}</div>;',
        '};',
        'Hello.propTypes = {}'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [{
        message: '\'firstname\' is missing in props validation',
        line: 2,
        column: 22
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {};',
        '  }',
        '  render() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [{
        message: '\'firstname\' is missing in props validation',
        line: 6,
        column: 29
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {};'
      ].join('\n'),
      options: [{skipUndeclared: true}],
      errors: [{
        message: '\'firstname\' is missing in props validation',
        line: 3,
        column: 29
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  render: function() {',
        '    return <div>{this.props.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      options: [{skipUndeclared: false}],
      errors: [{
        message: '\'firstname\' is missing in props validation',
        line: 3,
        column: 29
      }]
    }, {
      code: [
        'type MyComponentProps = {',
        '  +a: number,',
        '};',
        'function MyComponent({ a, b }: MyComponentProps) {',
        '  return <div />;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'b\' is missing in props validation',
        line: 4,
        column: 27,
        type: 'Property'
      }]
    }, {
      code: [
        'type MyComponentProps = {',
        '  -a: number,',
        '};',
        'function MyComponent({ a, b }: MyComponentProps) {',
        '  return <div />;',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'b\' is missing in props validation',
        line: 4,
        column: 27,
        type: 'Property'
      }]
    }, {
      code: [
        'type Props = {+name: Object;};',
        'class Hello extends React.Component {',
        '  props: Props;',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
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
        '  onSelect = async ({ name }) => {',
        '    return this.props.foo;',
        '  }',
        '  render() {',
        '    return <Greeting onSelect={this.onSelect} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = forbidExtraProps({',
        '    bar: PropTypes.func',
        '  })',
        '  componentWillReceiveProps(nextProps) {',
        '    if (nextProps.foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps']
      }),
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        '  componentWillReceiveProps(nextProps) {',
        '    if (nextProps.foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        '  componentWillReceiveProps(nextProps) {',
        '    const {foo} = nextProps;',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    bar: PropTypes.func',
        '  }',
        '  componentWillReceiveProps({foo}) {',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  componentWillReceiveProps({foo}) {',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '    bar: PropTypes.func',
        '  }'
      ].join('\n'),
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = forbidExtraProps({',
        '    bar: PropTypes.func',
        '  })',
        '  shouldComponentUpdate(nextProps) {',
        '    if (nextProps.foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps']
      }),
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate({foo}) {',
        '    if (foo) {',
        '      return;',
        '    }',
        '  }',
        '  render() {',
        '    return <div bar={this.props.bar} />;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '    bar: PropTypes.func',
        '  }'
      ].join('\n'),
      errors: [
        {message: '\'foo\' is missing in props validation'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes() {',
        '    return {',
        '      name: PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [
        {message: '\'name\' is missing in props validation'}
      ]
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'lastname\' is missing in props validation',
        line: 6,
        column: 35,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    return <div>Hello {this.props.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [{
        message: '\'lastname\' is missing in props validation',
        line: 6,
        column: 35,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const {',
        '      lastname,',
        '    } = this.props;',
        '    return <div>Hello {lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'lastname\' is missing in props validation',
        line: 7,
        column: 7,
        type: 'Property'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, Person, void> {',
        '  render () {',
        '    const {',
        '      lastname,',
        '    } = this.props;',
        '    return <div>Hello {lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [{
        message: '\'lastname\' is missing in props validation',
        line: 7,
        column: 7,
        type: 'Property'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'name.lastname\' is missing in props validation',
        line: 4,
        column: 40,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {name: {firstname: string;};};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.name.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [{
        message: '\'name.lastname\' is missing in props validation',
        line: 4,
        column: 40,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'result.notok\' is missing in props validation',
        line: 4,
        column: 42,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};',
        'class Hello extends React.Component<void, Props, void> {',
        '  render () {',
        '    return <div>Hello {this.props.result.notok}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [{
        message: '\'result.notok\' is missing in props validation',
        line: 4,
        column: 42,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'person.lastname\' is missing in props validation',
        line: 6,
        column: 42,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: [
        'type Person = {',
        '  firstname: string',
        '};',
        'class Hello extends React.Component<void, { person: Person }, void> {',
        '  render () {',
        '    return <div>Hello {this.props.person.lastname}</div>;',
        '  }',
        '}'
      ].join('\n'),
      settings: {react: {flowVersion: '0.52'}},
      errors: [{
        message: '\'person.lastname\' is missing in props validation',
        line: 6,
        column: 42,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }
      `,
      errors: [{
        message: '\'bar\' is missing in props validation',
        line: 8,
        column: 37,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          foo: string,
        };

        class Bar extends React.Component<Props> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [{
        message: '\'bar\' is missing in props validation',
        line: 8,
        column: 37,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }
      `,
      errors: [{
        message: '\'bar\' is missing in props validation',
        line: 8,
        column: 37,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type FancyProps = {
          foo: string,
        };

        class Bar extends React.Component<FancyProps> {
          render() {
            return <div>{this.props.bar}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [{
        message: '\'bar\' is missing in props validation',
        line: 8,
        column: 37,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<{ person: Person }> {
          render () {
            return <div>Hello {this.props.person.lastname}</div>;
          }
        }
      `,
      errors: [{
        message: '\'person.lastname\' is missing in props validation',
        line: 7,
        column: 50,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<{ person: Person }> {
          render () {
            return <div>Hello {this.props.person.lastname}</div>;
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [{
        message: '\'person.lastname\' is missing in props validation',
        line: 7,
        column: 50,
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = { foo: string }
        function higherOrderComponent<Props>() {
          return class extends React.Component<Props> {
            render() {
              return <div>{this.props.foo} - {this.props.bar}</div>
            }
          }
        }
      `,
      errors: [{
        message: '\'bar\' is missing in props validation'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        function higherOrderComponent<P: { foo: string }>() {
          return class extends React.Component<P> {
            render() {
              return <div>{this.props.foo} - {this.props.bar}</div>
            }
          }
        }
      `,
      errors: [{
        message: '\'bar\' is missing in props validation'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        const withOverlayState = <P: {foo: string}>(WrappedComponent: ComponentType<P>): CpmponentType<P> => (
          class extends React.Component<P> {
            constructor(props) {
              super(props);
              this.state = {foo: props.foo, bar: props.bar}
            }
            render() {
              return <div>Hello World</div>
            }
          }
        )
      `,
      errors: [{
        message: '\'bar\' is missing in props validation'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsA = {foo: string };
        type PropsB = { bar: string };
        type Props = PropsA & PropsB;

        class MyComponent extends React.Component {
          props: Props;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.fooBar}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'fooBar\' is missing in props validation'
      }]
    }, {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap} - {this.props.fooBar}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'fooBar\' is missing in props validation'
      }]
    }, {
      code: `
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsB & {
          baz: string
        };

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.bar} - {this.props.baz} - {this.props.fooBar}</div>
          }
        }
      `,
      errors: [{
        message: '\'fooBar\' is missing in props validation'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = {
          baz: string
        } & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.bar} - {this.props.baz} - {this.props.fooBar}</div>
          }
        }
      `,
      errors: [{
        message: '\'fooBar\' is missing in props validation'
      }],
      parser: 'babel-eslint'
    },
    {
      code: `
      type ReduxState = {bar: number};

      const mapStateToProps = (state: ReduxState) => ({
          foo: state.bar,
      });
      // utility to extract the return type from a function
      type ExtractReturn_<R, Fn: (...args: any[]) => R> = R;
      type ExtractReturn<T> = ExtractReturn_<*, T>;

      type PropsFromRedux = ExtractReturn<typeof mapStateToProps>;

      type OwnProps = {
          baz: string,
      }

      // I want my Props to be {baz: string, foo: number}
      type Props = PropsFromRedux & OwnProps;

      const Component = (props: Props) => (
        <div>
            {props.baz}
            {props.bad}
        </div>
      );
    `,
      errors: [{
        message: '\'bad\' is missing in props validation'
      }],
      parser: 'babel-eslint'
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOfType([
            PropTypes.shape({
              bar: PropTypes.string
            })
          ])
        };
      `,
      errors: [{
        message: '\'foo.baz\' is missing in props validation'
      }]
    },
    {
      code: `
        class Foo extends React.Component {
          bar() {
            this.setState((state, props) => ({ current: props.current, bar: props.bar }));
          }
          render() {
            return <div />;
          }
        }

        Foo.propTypes = {
          current: PropTypes.number.isRequired,
        };
      `,
      errors: [{
        message: '\'bar\' is missing in props validation'
      }]
    },
    {
      code: `
        class Foo extends React.Component {
          static getDerivedStateFromProps(props) {
            const { foo, bar } = props;
            return {
              foobar: foo + bar
            };
          }

          render() {
            const { foobar } = this.state;
            return <div>{foobar}</div>;
          }
        }

        Foo.propTypes = {
          foo: PropTypes.func.isRequired,
        };
      `,
      settings: {react: {version: '16.3.0'}},
      errors: [{
        message: '\'bar\' is missing in props validation'
      }]
    },
    {
      code: `
        const ForAttendees = ({ page }) => (
          <>
            <section>{page}</section>
          </>
        );

        export default ForAttendees;
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'page\' is missing in props validation'
      }]
    },
    {
      code: `
        const HeaderBalance = React.memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
      `,
      errors: [{
        message: '\'cryptoCurrency\' is missing in props validation'
      }]
    },
    {
      code: `
        import React, { memo } from 'react';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
      `,
      errors: [{
        message: '\'cryptoCurrency\' is missing in props validation'
      }]
    },
    {
      code: `
        const HeaderBalance = Foo.memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [{
        message: '\'cryptoCurrency\' is missing in props validation'
      }]
    },
    {
      code: `
        import Foo, { memo } from 'foo';
        const HeaderBalance = memo(({ cryptoCurrency }) => (
          <div className="header-balance">
            <div className="header-balance__balance">
              BTC
              {cryptoCurrency}
            </div>
          </div>
        ));
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [{
        message: '\'cryptoCurrency\' is missing in props validation'
      }]
    },
    {
      code: `
        const Label = React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      errors: [{
        message: '\'text\' is missing in props validation'
      }]
    },
    {
      code: `
        import React, { forwardRef } from 'react';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      errors: [{
        message: '\'text\' is missing in props validation'
      }]
    },
    {
      code: `
        const Label = Foo.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [{
        message: '\'text\' is missing in props validation'
      }]
    },
    {
      code: `
        import Foo, { forwardRef } from 'foo';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      settings: {
        react: {
          pragma: 'Foo'
        }
      },
      errors: [{
        message: '\'text\' is missing in props validation'
      }]
    }, {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        const MyComponent = (props) => {
          switch (props.usedProp) {
            case 1:
              return (<div />);
            default:
              return <div />;
          }
        };

        export default MyComponent;
      `,
      errors: [{
        message: '\'usedProp\' is missing in props validation'
      }]
    },
    {
      code: `
        export default class Controller extends React.Component {
          handleAdd = id => {
            this.setState((state, { name }) => {
                const item = this.buildItem(id);
            });
          };
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'name\' is missing in props validation'
      }]
    },
    {
      code: `
        export default class extends React.Component {
          onSubmit = () => {
            this.setState((state, { a }) => {
              a.b.c();
              return null;
            });
          };

          render() {
            return null;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'a\' is missing in props validation'
      }]
    },
    {
      code: `
        class Foo extends React.Component {
          contructor(props) {
            super(props);
            this.initialValues = {
              test: '',
            };
          }

          render = () => {
            return (
              <Component
                initialValues={this.props.initialValues || this.initialValues}
              >
                {formikProps => (
                  <Input {...formikProps} />
                )}
              </Component>
            );
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'initialValues\' is missing in props validation'
      }]
    }
  ]
});
