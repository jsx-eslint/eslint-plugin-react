/**
 * @fileoverview Warn about unused PropType definitions in React components
 * @author Evgueni Naverniouk
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-prop-types');
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
ruleTester.run('no-unused-prop-types', rule, {

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
      // Props validation is ignored when spread is used
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, ...props } = this.props;',
        '    var { category, icon } = props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: PropTypes.string,',
        '  category: PropTypes.string,',
        '  icon: PropTypes.bool',
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
      ].join('\n'),
      options: [{skipShapeProps: false}]
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
      ].join('\n'),
      options: [{skipShapeProps: false}]
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
      ].join('\n'),
      options: [{skipShapeProps: false}]
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
      ].join('\n'),
      options: [{skipShapeProps: false}]
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
      ].join('\n'),
      options: [{skipShapeProps: false}]
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
      ].join('\n'),
      options: [{skipShapeProps: false}]
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
      options: [{skipShapeProps: false}],
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
      options: [{customValidators: ['CustomValidator'], skipShapeProps: false}]
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
      options: [{customValidators: ['CustomValidator'], skipShapeProps: false}]
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
      options: [{customValidators: ['CustomValidator'], skipShapeProps: false}]
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
      code: `
      type PropsA = { a: string }
      type PropsB = { b: string }
      type Props = PropsA & PropsB;

      class MyComponent extends React.Component {
        props: Props;

        render() {
          return <div>{this.props.a} - {this.props.b}</div>
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
        type PropsB = { foo: string };
        type PropsC = { bar: string };
        type Props = PropsB & {
          zap: string
        };

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
        type PropsB = { foo: string };
        type PropsC = { bar: string };
        type Props = {
          zap: string
        } & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar} - {this.props.zap}</div>
          }
        }
      `,
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
      // Destructured shape props are skipped by default
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
      // Destructured props in componentWillReceiveProps shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  componentWillReceiveProps (nextProps) {',
        '    const {something} = nextProps;',
        '    doSomething(something);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured props in componentWillReceiveProps shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillReceiveProps (nextProps) {',
        '    const {something} = nextProps;',
        '    doSomething(something);',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in componentWillReceiveProps shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillReceiveProps (nextProps) {',
        '    const {something} = nextProps;',
        '    doSomething(something);',
        '  }',
        '})'
      ].join('\n')
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
      // Destructured function props in componentWillReceiveProps shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  componentWillReceiveProps ({something}) {',
        '    doSomething(something);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillReceiveProps ({something}) {',
        '    doSomething(something);',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillReceiveProps ({something}) {',
        '    doSomething(something);',
        '  }',
        '})'
      ].join('\n')
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
      parser: 'babel-eslint'
    }, {
      // Destructured props in the constructor shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  constructor (props) {',
        '    super(props);',
        '    const {something} = props;',
        '    doSomething(something);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
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
      parser: 'babel-eslint'
    }, {
      // Destructured function props in the constructor shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  constructor ({something}) {',
        '    super({something});',
        '    doSomething(something);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
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
      parser: 'babel-eslint'
    }, {
      // Destructured props in the `shouldComponentUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured props in `shouldComponentUpdate` shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in `shouldComponentUpdate` shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  shouldComponentUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
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
      parser: 'babel-eslint'
    }, {
      // Destructured function props in the `shouldComponentUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured function props in `shouldComponentUpdate` shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in `shouldComponentUpdate` shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  shouldComponentUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
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
      parser: 'babel-eslint'
    }, {
      // Destructured props in the `componentWillUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured props in `componentWillUpdate` shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in `componentWillUpdate` shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillUpdate (nextProps, nextState) {',
        '    const {something} = nextProps;',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
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
      parser: 'babel-eslint'
    }, {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentWillUpdate ({something}, nextState) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
    }, {
      // Destructured props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, prevState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  componentDidUpdate (prevProps, prevState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured props in `componentDidUpdate` shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentDidUpdate (prevProps, prevState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props in `componentDidUpdate` shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentDidUpdate (prevProps, prevState) {',
        '    const {something} = prevProps;',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
    }, {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, prevState) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors
      code: [
        'class Hello extends Component {',
        '  componentDidUpdate ({something}, prevState) {',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentDidUpdate ({something}, prevState) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors when used createReactClass, with default parser
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentDidUpdate ({something}, prevState) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
    }, {
      // Destructured state props in `componentDidUpdate` [Issue #825]
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured state props in `componentDidUpdate` [Issue #825]
      code: [
        'class Hello extends Component {',
        '  componentDidUpdate ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  something: PropTypes.bool,',
        '};'
      ].join('\n')
    }, {
      // Destructured state props in `componentDidUpdate` [Issue #825] when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentDidUpdate ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured state props in `componentDidUpdate` without custom parser [Issue #825]
      code: [
        'var Hello = React.Component({',
        '  propTypes: {',
        '    something: PropTypes.bool',
        '  },',
        '  componentDidUpdate: function ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '});'
      ].join('\n')
    }, {
      // Destructured state props in `componentDidUpdate` without custom parser [Issue #825] when used createReactClass
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool,',
        '  },',
        '  componentDidUpdate: function ({something}, {state1, state2}) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n')
    }, {
      // Destructured props in a stateless function
      code: [
        'const Hello = (props) => {',
        '  const {...rest} = props;',
        '  return <div />;',
        '};'
      ].join('\n')
    }, {
      // `no-unused-prop-types` in jsx expressions - [Issue #885]
      code: [
        'const PagingBlock = function(props) {',
        '  return (',
        '    <span>',
        '      <a onClick={() => props.previousPage()}/>',
        '      <a onClick={() => props.nextPage()}/>',
        '    </span>',
        ' );',
        '};',

        'PagingBlock.propTypes = {',
        '  nextPage: PropTypes.func.isRequired,',
        '  previousPage: PropTypes.func.isRequired,',
        '};'
      ].join('\n')
    }, {
      // `no-unused-prop-types` rest param props in jsx expressions - [Issue #885]
      code: [
        'const PagingBlock = function(props) {',
        '  return (',
        '    <SomeChild {...props} />',
        ' );',
        '};',

        'PagingBlock.propTypes = {',
        '  nextPage: PropTypes.func.isRequired,',
        '  previousPage: PropTypes.func.isRequired,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  componentWillReceiveProps (nextProps) {',
        '    if (nextProps.foo) {',
        '      doSomething(this.props.bar);',
        '    }',
        '  }',
        '}',

        'Hello.propTypes = {',
        '  foo: PropTypes.bool,',
        '  bar: PropTypes.bool',
        '};'
      ].join('\n')
    }, {
      // The next two test cases are related to: https://github.com/yannickcr/eslint-plugin-react/issues/1183
      code: [
        'export default function SomeComponent(props) {',
        '    const callback = () => {',
        '        props.a(props.b);',
        '    };',
        '',
        '    const anotherCallback = () => {};',
        '',
        '    return (',
        '        <SomeOtherComponent',
        '            name={props.c}',
        '            callback={callback}',
        '        />',
        '    );',
        '}',
        '',
        'SomeComponent.propTypes = {',
        '    a: React.PropTypes.func.isRequired,',
        '    b: React.PropTypes.string.isRequired,',
        '    c: React.PropTypes.string.isRequired,',
        '};'
      ].join('\n')
    }, {
      code: [
        'export default function SomeComponent(props) {',
        '    const callback = () => {',
        '        props.a(props.b);',
        '    };',
        '',
        '    return (',
        '        <SomeOtherComponent',
        '            name={props.c}',
        '            callback={callback}',
        '        />',
        '    );',
        '}',
        '',
        'SomeComponent.propTypes = {',
        '    a: React.PropTypes.func.isRequired,',
        '    b: React.PropTypes.string.isRequired,',
        '    c: React.PropTypes.string.isRequired,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  shouldComponentUpdate (props) {',
        '    if (props.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate (props) {',
        '    if (props.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  componentWillUpdate (props) {',
        '    if (props.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {',
        '  componentWillUpdate (props) {',
        '    if (props.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  componentWillReceiveProps (nextProps) {',
        '    const {foo} = nextProps;',
        '    if (foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Props used inside of an async class property
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '  }',
        '  classProperty = async () => {',
        '    await this.props.foo();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Multiple props used inside of an async class property
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  classProperty = async () => {',
        '    await this.props.foo();',
        '    await this.props.bar();',
        '    await this.props.baz();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {',
        '  componentWillReceiveProps (props) {',
        '    if (props.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  shouldComponentUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured props inside of async class property
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '  }',
        '  classProperty = async () => {',
        '    const { foo } = this.props;',
        '    await foo();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Multiple destructured props inside of async class property
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  classProperty = async () => {',
        '    const { foo, bar, baz } = this.props;',
        '    await foo();',
        '    await bar();',
        '    await baz();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  componentWillUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Props used inside of an async class method
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '  }',
        '  async method() {',
        '    await this.props.foo();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Multiple props used inside of an async class method
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  async method() {',
        '    await this.props.foo();',
        '    await this.props.bar();',
        '    await this.props.baz();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destrucuted props inside of async class method
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '  }',
        '  async method() {',
        '    const { foo } = this.props;',
        '    await foo();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {',
        '  componentWillUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n')
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  componentDidUpdate (prevProps) {',
        '    if (prevProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Multiple destructured props inside of async class method
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  async method() {',
        '    const { foo, bar, baz } = this.props;',
        '    await foo();',
        '    await bar();',
        '    await baz();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // factory functions that return async functions
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  factory() {',
        '    return async () => {',
        '      await this.props.foo();',
        '      await this.props.bar();',
        '      await this.props.baz();',
        '    };',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // factory functions that return async functions
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  factory() {',
        '    return async function onSubmit() {',
        '      await this.props.foo();',
        '      await this.props.bar();',
        '      await this.props.baz();',
        '    };',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      code: [
        'class Hello extends Component {',
        '  componentDidUpdate (prevProps) {',
        '    if (prevProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '',
        '  render() {',
        '    return (<div>{this.props.bar}</div>);',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n')
    }, {
      // Multiple props used inside of an async method
      code: [
        'class Example extends Component {',
        '  async method() {',
        '    await this.props.foo();',
        '    await this.props.bar();',
        '  };',
        '}',
        'Example.propTypes = {',
        '  foo: PropTypes.func,',
        '  bar: PropTypes.func,',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({}, parserOptions, {ecmaVersion: 2017})
    }, {
      // Multiple props used inside of an async function
      code: [
        'class Example extends Component {',
        '  render() {',
        '    async function onSubmit() {',
        '      await this.props.foo();',
        '      await this.props.bar();',
        '    }',
        '    return <Form onSubmit={onSubmit} />',
        '  };',
        '}',
        'Example.propTypes = {',
        '  foo: PropTypes.func,',
        '  bar: PropTypes.func,',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({}, parserOptions, {ecmaVersion: 2017})
    }, {
      // Multiple props used inside of an async arrow function
      code: [
        'class Example extends Component {',
        '  render() {',
        '    const onSubmit = async () => {',
        '      await this.props.foo();',
        '      await this.props.bar();',
        '    }',
        '    return <Form onSubmit={onSubmit} />',
        '  };',
        '}',
        'Example.propTypes = {',
        '  foo: PropTypes.func,',
        '  bar: PropTypes.func,',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({}, parserOptions, {ecmaVersion: 2017})
    },
    {
      // Destructured assignment with Shape propTypes issue #816
      code: [
        'export default class NavigationButton extends React.Component {',
        ' static propTypes = {',
        '   route: PropTypes.shape({',
        '    getBarTintColor: PropTypes.func.isRequired,',
        '  }).isRequired,',
        ' };',

        ' renderTitle() {',
        '  const { route } = this.props;',
        '   return <Title tintColor={route.getBarTintColor()}>TITLE</Title>;',
        ' }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // Destructured assignment without Shape propTypes issue #816
      code: [
        'const Component = ({ children: aNode }) => (',
        ' <div>{aNode}</div>',
        ');',

        'Component.defaultProps = {',
        ' children: null,',
        '};',

        'Component.propTypes = {',
        ' children: React.PropTypes.node,',
        '};'
      ].join('\n')
    }, {
      // issue 1309
      code: [
        'const Thing = (props) => (',
        '    <div>',
        '      {(() => {',
        '            if(props.enabled && props.test){',
        '                return (',
        '                    <span>Enabled!</span>',
        '                )',
        '            }',
        '            return (',
        '                <span>Disabled..</span>',
        '            )',
        '        })()}',
        '    </div>',
        ');',

        'Thing.propTypes = {',
        '    enabled: React.PropTypes.bool,',
        '    test: React.PropTypes.bool',
        '};'
      ].join('\n')
    }, {
      // issue 1107
      code: [
        'const Test = props => <div>',
        '  {someArray.map(l => <div',
        '    key={l}>',
        '      {props.property + props.property2}',
        '    </div>)}',
        '</div>',

        'Test.propTypes = {',
        '  property: React.propTypes.string.isRequired,',
        '  property2: React.propTypes.string.isRequired',
        '}'
      ].join('\n')
    }, {
      // issue 811
      code: [
        'const Button = React.createClass({',
        'displayName: "Button",',

        'propTypes: {',
        '    name: React.PropTypes.string.isRequired,',
        '    isEnabled: React.PropTypes.bool.isRequired',
        '},',

        'render() {',
        '    const item = this.props;',
        '    const disabled = !this.props.isEnabled;',
        '    return (',
        '        <div>',
        '            <button type="button" disabled={disabled}>{item.name}</button>',
        '        </div>',
        '    );',
        '}',
        '});'
      ].join('\n')
    }, {
      // issue 811
      code: [
        'class Foo extends React.Component {',
        ' static propTypes = {',
        ' foo: PropTypes.func.isRequired,',
        '}',

        'constructor(props) {',
        '  super(props);',

        '  const { foo } = props;',
        '  this.message = foo("blablabla");',
        '}',

        'render() {',
        '  return <div>{this.message}</div>;',
        '}',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // issue #1097
      code: [
        'class HelloGraphQL extends Component {',
        '  render() {',
        '      return <div>Hello</div>;',
        '  }',
        '}',

        'const HellowQueries = graphql(queryDetails, {',
        '  options: ownProps => ({',
        '  variables: ownProps.aProp',
        '  }),',
        '})(HelloGraphQL)',

        'HellowQueries.propTypes = {',
        '  aProp: PropTypes.string.isRequired',
        '}',

        'export default connect(mapStateToProps, mapDispatchToProps)(HellowQueries)'
      ].join('\n'),
      parser: 'babel-eslint'
    }, {
      // issue #1335
      code: [
        'type Props = {',
        ' foo: {',
        '  bar: boolean',
        ' }',
        '};',

        'class DigitalServices extends React.Component {',
        ' props: Props',
        ' render() {',
        '   const { foo } = this.props;',
        '   return <div>{foo.bar}</div>;',
        ' }',
        '}'
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
      // issue #933
      code: [
        'type Props = {',
        ' onMouseOver: Function,',
        ' onClick: Function,',
        '};',

        'const MyComponent = (props: Props) => (',
        '<div>',
        '  <button onMouseOver={() => props.onMouseOver()} />',
        '  <button onClick={() => props.onClick()} />',
        '</div>',
        ');'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}]
    }, {
      // issue #1506
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState((prevState, props) => {',
        '      props.doSomething();',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};',
        'var tempVar2;'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}]
    }, {
      // issue #1506
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState((prevState, { doSomething }) => {',
        '      doSomething();',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}]
    }, {
      // issue #1506
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState((prevState, obj) => {',
        '      obj.doSomething();',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};',
        'var tempVar2;'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}]
    }, {
      // issue #1506
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState(() => {',
        '      this.props.doSomething();',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};',
        'var tempVar;'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}]
    }, {
      // issue #1542
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState((prevState) => {',
        '      this.props.doSomething();',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}]
    }, {
      // issue #1542
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState(({ something }) => {',
        '      this.props.doSomething();',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}]
    }, {
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
    }, {
      // issue #933
      code: `
        type Props = {
          +foo: number
        }
        class MyComponent extends React.Component {
          render() {
            return <div>{this.props.foo}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          \'completed?\': boolean,
        };
        const Hello = (props: Props): React.Element => {
          return <div>{props[\'completed?\']}</div>;
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = {
          firstname: string
        }
        class MyComponent extends React.Component<void, Props, void> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = {
          firstname: string
        }
        class MyComponent extends React.Component<void, Props, void> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = {
          firstname: string
        }
        class MyComponent extends React.Component<Props> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = {
          firstname: string
        }
        class MyComponent extends React.Component<Props> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      parser: 'babel-eslint'
    }, {
      // Issue #1068
      code: `
      class MyComponent extends Component {
        static propTypes = {
          validate: PropTypes.bool,
          options: PropTypes.array,
          value: ({options, value, validate}) => {
            if (!validate) return;
            if (options.indexOf(value) < 0)
              throw new Errow('oops');
          }
        }

        render() {
          return <ul>
            {this.props.options.map(option =>
              <li className={this.props.value == option && "active"}>{option}</li>
            )}
          </ul>
        }
      }
      `,
      parser: 'babel-eslint'
    }, {
      // Issue #1068
      code: `
      class MyComponent extends Component {
        static propTypes = {
          validate: PropTypes.bool,
          options: PropTypes.array,
          value: function ({options, value, validate}) {
            if (!validate) return;
            if (options.indexOf(value) < 0)
              throw new Errow('oops');
          }
        }

        render() {
          return <ul>
            {this.props.options.map(option =>
              <li className={this.props.value == option && "active"}>{option}</li>
            )}
          </ul>
        }
      }
      `,
      parser: 'babel-eslint'
    }, {
      // Issue #1068
      code: `
      class MyComponent extends Component {
        static propTypes = {
          validate: PropTypes.bool,
          options: PropTypes.array,
          value({options, value, validate}) {
            if (!validate) return;
            if (options.indexOf(value) < 0)
              throw new Errow('oops');
          }
        }

        render() {
          return <ul>
            {this.props.options.map(option =>
              <li className={this.props.value == option && "active"}>{option}</li>
            )}
          </ul>
        }
      }
      `,
      parser: 'babel-eslint'
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { other: () => {} };
      `
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { other() {} };
      `
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { other: function () {} };
      `
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { * other() {} };
      `
    }, {
      // Sanity test coverage for new UNSAFE_componentWillReceiveProps lifecycles
      code: [`
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.3.0'}},
      parser: 'babel-eslint'
    }, {
      // Destructured props in the `UNSAFE_componentWillUpdate` method shouldn't throw errors
      code: [`
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.3.0'}},
      parser: 'babel-eslint'
    }, {
      // Simple test of new static getDerivedStateFromProps lifecycle
      code: [`
        class MyComponent extends React.Component {
          static propTypes = {
            defaultValue: 'bar'
          };
          state = {
            currentValue: null
          };
          static getDerivedStateFromProps(nextProps, prevState) {
            if (prevState.currentValue === null) {
              return {
                currentValue: nextProps.defaultValue,
              }
            }
            return null;
          }
          render() {
            return <div>{ this.state.currentValue }</div>
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.3.0'}},
      parser: 'babel-eslint'
    }, {
      // Simple test of new static getSnapshotBeforeUpdate lifecycle
      code: [`
        class MyComponent extends React.Component {
          static propTypes = {
            defaultValue: PropTypes.string
          };
          getSnapshotBeforeUpdate(prevProps, prevState) {
            if (prevProps.defaultValue === null) {
              return 'snapshot';
            }
            return null;
          }
          render() {
            return <div />
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.3.0'}},
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
        'import BasePerson from \'./types\'',
        'class Hello extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  person: ProTypes.shape({',
        '    ...BasePerson,',
        '    lastname: PropTypes.string',
        '  })',
        '};'
      ].join('\n')
    }, {
      code: `
        type Props = {
          used: string,
        }
        class Hello extends React.Component<Props> {
          renderHelper = ({notAProp}: {notAProp: string}) => {
            return <div />;
          }
          render() {
            return <div>{this.props.used}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          used: string,
        }
        class Hello extends React.Component<Props> {
          componentDidMount() {
            foo(
              ({notAProp}: {notAProp: string}) => (<div />)
            );
          }
          render() {
            return <div>{this.props.used}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        type Props = {
          used: string,
        }
        class Hello extends React.Component<Props> {
          render() {
            return <QueryRenderer
              render={({notAProp}: {notAProp: string}) => <div>{this.props.used}</div>}
            />;
          }
        }
      `,
      parser: 'babel-eslint'
    },
    {
      code: `
        export default class Foo extends React.Component {
          render() {
            return null;
          }
        }

        Foo.defaultProps = Object.assign({});
      `
    }
  ],

  invalid: [
    {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    unused: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return React.createElement("div", {}, this.props.value);',
        '  }',
        '});'
      ].join('\n'),
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    name: PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.value}</div>;',
        '  }',
        '});'
      ].join('\n'),
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
        '  unused: PropTypes.string',
        '};'
      ].join('\n'),
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
        '  unused: PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    unused: PropTypes.string.isRequired,',
        '    anotherunused: PropTypes.string.isRequired',
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
        '  unused: PropTypes.string',
        '};'
      ].join('\n'),
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
        '  a: PropTypes.shape({',
        '    b: PropTypes.string',
        '  })',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
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
        '  a: PropTypes.shape({',
        '    b: PropTypes.shape({',
        '      c: PropTypes.string',
        '    })',
        '  })',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
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
        '  a: PropTypes.objectOf(',
        '    PropTypes.shape({',
        '      unused: PropTypes.string',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
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
        '  a: PropTypes.arrayOf(',
        '    PropTypes.shape({',
        '      unused: PropTypes.string',
        '    })',
        '  )',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
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
        '  a: PropTypes.oneOfType([',
        '    PropTypes.shape({',
        '      unused: PropTypes.number,',
        '      anotherunused: PropTypes.array',
        '    })',
        '  ])',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      errors: [
        {message: '\'a.unused\' PropType is defined but prop is never used'},
        {message: '\'a.anotherunused\' PropType is defined but prop is never used'}
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
        '  "some.unused": PropTypes.string',
        '};'
      ].join('\n'),
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
        '  "arr": PropTypes.arrayOf(',
        '    PropTypes.shape({',
        '      "some.unused": PropTypes.string',
        '})',
        '  )',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      errors: [
        {message: '\'arr.*.some.unused\' PropType is defined but prop is never used'}
      ]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    unused: PropTypes.string',
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
        '  unused: PropTypes.string',
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
        '  var Hello = createReactClass({',
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
        '  var Hello = createReactClass({',
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
        '  unused: PropTypes.string',
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
        '  unused: PropTypes.string',
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
        '  unused: PropTypes.string',
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
      code: `
      type PropsA = { a: string }
      type PropsB = { b: string }
      type Props = PropsA & PropsB;

      class MyComponent extends React.Component {
        props: Props;

        render() {
          return <div>{this.props.a}</div>
        }
      }
      `,
      parser: 'babel-eslint',
      errors: [
        {message: '\'b\' PropType is defined but prop is never used'}
      ]
    }, {
      code: `
        type PropsA = { foo: string };
        type PropsB = { bar: string };
        type PropsC = { zap: string };
        type Props = PropsA & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [
        {message: '\'zap\' PropType is defined but prop is never used'}
      ]
    }, {
      code: `
        type PropsB = { foo: string };
        type PropsC = { bar: string };
        type Props = PropsB & {
          zap: string
        };

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
      errors: [
        {message: '\'zap\' PropType is defined but prop is never used'}
      ],
      parser: 'babel-eslint'
    }, {
      code: `
        type PropsB = { foo: string };
        type PropsC = { bar: string };
        type Props = {
          zap: string
        } & PropsB;

        class Bar extends React.Component {
          props: Props & PropsC;

          render() {
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
      errors: [
        {message: '\'zap\' PropType is defined but prop is never used'}
      ],
      parser: 'babel-eslint'
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
      options: [{skipShapeProps: false}],
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
      options: [{skipShapeProps: false}],
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
      options: [{skipShapeProps: false}],
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
      options: [{skipShapeProps: false}],
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
      options: [{skipShapeProps: false}],
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
      options: [{skipShapeProps: false}],
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
      options: [{skipShapeProps: false}],
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
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'const MyComponent = props => props.test ? <div /> : <span />',
        'MyComponent.propTypes = {unused: Object};'
      ].join('\n'),
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
      errors: [{
        message: '\'unused\' PropType is defined but prop is never used',
        line: 3,
        column: 13
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    something: PropTypes.bool',
        '  }',
        '  componentDidUpdate (prevProps, {state1, state2}) {',
        '    return something;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'something\' PropType is defined but prop is never used',
        line: 3,
        column: 16
      }]
    }, {
      code: [
        'var Hello = createReactClass({',
        '  propTypes: {',
        '    something: PropTypes.bool',
        '  },',
        '  componentDidUpdate: function (prevProps, {state1, state2}) {',
        '    return something;',
        '  }',
        '})'
      ].join('\n'),
      errors: [{
        message: '\'something\' PropType is defined but prop is never used',
        line: 3,
        column: 16
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  componentWillUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 4,
        column: 10
      }]
    }, {
      // Multiple props used inside of an async class property
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  classProperty = async () => {',
        '    await this.props.foo();',
        '    await this.props.bar();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'baz\' PropType is defined but prop is never used',
        line: 5,
        column: 10
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  componentWillUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 10,
        column: 8
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  shouldComponentUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 4,
        column: 10
      }]
    }, {
      // Multiple destructured props inside of async class property
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  classProperty = async () => {',
        '    const { bar, baz } = this.props;',
        '    await bar();',
        '    await baz();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used'
      }]
    }, {
      // Multiple props used inside of an async class method
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  async method() {',
        '    await this.props.foo();',
        '    await this.props.baz();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 4,
        column: 10
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  shouldComponentUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 10,
        column: 8
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string,',
        '  };',
        '',
        '  componentDidUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 4,
        column: 10
      }]
    }, {
      // Multiple destructured props inside of async class method
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  async method() {',
        '    const { foo, bar } = this.props;',
        '    await foo();',
        '    await bar();',
        '  };',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'baz\' PropType is defined but prop is never used',
        line: 5,
        column: 10
      }]
    }, {
      // factory functions that return async functions
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  factory() {',
        '    return async () => {',
        '      await this.props.foo();',
        '      await this.props.bar();',
        '    };',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'baz\' PropType is defined but prop is never used',
        line: 5,
        column: 10
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  componentDidUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 10,
        column: 8
      }]
    }, {
      code: [
        'class Hello extends Component {',
        '  componentDidUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '}',
        'Hello.propTypes = forbidExtraProps({',
        '  foo: PropTypes.string,',
        '  bar: PropTypes.string,',
        '});'
      ].join('\n'),
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 10,
        column: 8
      }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps']
      }
    }, {
      code: [
        'class Hello extends Component {',
        '  propTypes = forbidExtraProps({',
        '    foo: PropTypes.string,',
        '    bar: PropTypes.string',
        '  });',
        '  componentDidUpdate (nextProps) {',
        '    if (nextProps.foo) {',
        '      return true;',
        '    }',
        '  }',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'bar\' PropType is defined but prop is never used',
        line: 4,
        column: 10
      }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps']
      }
    }, {
      // factory functions that return async functions
      code: [
        'export class Example extends Component {',
        '  static propTypes = {',
        '    foo: PropTypes.func,',
        '    bar: PropTypes.func,',
        '    baz: PropTypes.func,',
        '  }',
        '  factory() {',
        '    return async function onSubmit() {',
        '      await this.props.bar();',
        '      await this.props.baz();',
        '    };',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used',
        line: 3,
        column: 10
      }]
    }, {
      // Multiple props used inside of an async function
      code: [
        'class Example extends Component {',
        '  render() {',
        '    async function onSubmit() {',
        '      await this.props.foo();',
        '      await this.props.bar();',
        '    }',
        '    return <Form onSubmit={onSubmit} />',
        '  };',
        '}',
        'Example.propTypes = {',
        '  foo: PropTypes.func,',
        '  bar: PropTypes.func,',
        '  baz: PropTypes.func,',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({}, parserOptions, {ecmaVersion: 2017}),
      errors: [{
        message: '\'baz\' PropType is defined but prop is never used',
        line: 13,
        column: 8
      }]
    }, {
      // Multiple props used inside of an async arrow function
      code: [
        'class Example extends Component {',
        '  render() {',
        '    const onSubmit = async () => {',
        '      await this.props.bar();',
        '      await this.props.baz();',
        '    }',
        '    return <Form onSubmit={onSubmit} />',
        '  };',
        '}',
        'Example.propTypes = {',
        '  foo: PropTypes.func,',
        '  bar: PropTypes.func,',
        '  baz: PropTypes.func,',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({}, parserOptions, {ecmaVersion: 2017}),
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used',
        line: 11,
        column: 8
      }]
    }, { // None of the props are used issue #1162
      code: [
        'import React from "react"; ',
        'var Hello = React.createReactClass({',
        ' propTypes: {',
        '   name: React.PropTypes.string',
        ' },',
        ' render: function() {',
        '   return <div>Hello Bob</div>;',
        '  }',
        '});'
      ].join('\n'),
      errors: [{
        message: '\'name\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'prop1\' PropType is defined but prop is never used'
      }, {
        message: '\'prop2\' PropType is defined but prop is never used'
      }, {
        message: '\'prop2.*\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'prop1\' PropType is defined but prop is never used'
      }, {
        message: '\'prop2\' PropType is defined but prop is never used'
      }, {
        message: '\'prop2.*\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'prop1\' PropType is defined but prop is never used'
      }, {
        message: '\'prop2\' PropType is defined but prop is never used'
      }, {
        message: '\'prop2.*\' PropType is defined but prop is never used'
      }]
    }, {
      // Destructured assignment with Shape propTypes with skipShapeProps off issue #816
      code: [
        'export default class NavigationButton extends React.Component {',
        ' static propTypes = {',
        '   route: PropTypes.shape({',
        '    getBarTintColor: PropTypes.func.isRequired,',
        '  }).isRequired,',
        ' };',

        ' renderTitle() {',
        '  const { route } = this.props;',
        '   return <Title tintColor={route.getBarTintColor()}>TITLE</Title>;',
        ' }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}],
      errors: [{
        message: '\'route.getBarTintColor\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        // issue #1097
        'class HelloGraphQL extends Component {',
        '  render() {',
        '      return <div>Hello</div>;',
        '  }',
        '}',
        'HelloGraphQL.propTypes = {',
        '  aProp: PropTypes.string.isRequired',
        '}',

        'const HellowQueries = graphql(queryDetails, {',
        '  options: ownProps => ({',
        '  variables: ownProps.aProp',
        '  }),',
        '})(HelloGraphQL)',

        'export default connect(mapStateToProps, mapDispatchToProps)(HellowQueries)'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'aProp\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        type Props = {
          firstname: string,
          lastname: string,
        }
        class MyComponent extends React.Component<void, Props, void> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        type Props = {
          firstname: string,
          lastname: string,
        }
        class MyComponent extends React.Component<void, Props, void> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.52'}},
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        type Props = {
          firstname: string,
          lastname: string,
        }
        class MyComponent extends React.Component<Props> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        type Person = string;
        class Hello extends React.Component<{ person: Person }> {
          render () {
            return <div />;
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      errors: [{
        message: '\'person\' PropType is defined but prop is never used'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        type Person = string;
        class Hello extends React.Component<void, { person: Person }, void> {
          render () {
            return <div />;
          }
        }
      `,
      settings: {react: {flowVersion: '0.52'}},
      errors: [{
        message: '\'person\' PropType is defined but prop is never used'
      }],
      parser: 'babel-eslint'
    }, {
      code: `
        function higherOrderComponent<P: { foo: string }>() {
          return class extends React.Component<P> {
            render() {
              return <div />;
            }
          }
        }
      `,
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used'
      }],
      parser: 'babel-eslint'
    }, {
      // issue #1506
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState(({ doSomething }, props) => {',
        '      return { doSomething: doSomething + 1 };',
        '    });',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'doSomething\' PropType is defined but prop is never used'
      }]
    }, {
      // issue #1685
      code: [
        'class MyComponent extends React.Component {',
        '  onFoo() {',
        '    this.setState(prevState => ({',
        '      doSomething: prevState.doSomething + 1,',
        '    }));',
        '  }',
        '  render() {',
        '    return (',
        '       <div onClick={this.onFoo}>Test</div>',
        '    );',
        '  }',
        '}',
        'MyComponent.propTypes = {',
        '  doSomething: PropTypes.func',
        '};'
      ].join('\n'),
      errors: [{
        message: '\'doSomething\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        type Props = {
          firstname: string,
          lastname: string,
        }
        class MyComponent extends React.Component<Props> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      settings: {react: {flowVersion: '0.53'}},
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: [`
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.2.0'}},
      parser: 'babel-eslint',
      errors: [{
        message: '\'something\' PropType is defined but prop is never used'
      }]
    }, {
      code: [`
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.2.0'}},
      parser: 'babel-eslint',
      errors: [{
        message: '\'something\' PropType is defined but prop is never used'
      }]
    }, {
      code: [`
        class MyComponent extends React.Component {
          static propTypes = {
            defaultValue: 'bar'
          };
          state = {
            currentValue: null
          };
          static getDerivedStateFromProps(nextProps, prevState) {
            if (prevState.currentValue === null) {
              return {
                currentValue: nextProps.defaultValue,
              }
            }
            return null;
          }
          render() {
            return <div>{ this.state.currentValue }</div>
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.2.0'}},
      parser: 'babel-eslint',
      errors: [{
        message: '\'defaultValue\' PropType is defined but prop is never used'
      }]
    }, {
      code: [`
        class MyComponent extends React.Component {
          static propTypes = {
            defaultValue: PropTypes.string
          };
          getSnapshotBeforeUpdate(prevProps, prevState) {
            if (prevProps.defaultValue === null) {
              return 'snapshot';
            }
            return null;
          }
          render() {
            return <div />
          }
        }
      `].join('\n'),
      settings: {react: {version: '16.2.0'}},
      parser: 'babel-eslint',
      errors: [{
        message: '\'defaultValue\' PropType is defined but prop is never used'
      }]
    }, {
      // Mixed union and intersection types
      code: `
        import React from 'react';
        type OtherProps = {
          firstname: string,
          lastname: string,
        } | {
          fullname: string
        };
        type Props = OtherProps & {
          age: number
        };
        class Test extends React.PureComponent<Props> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'age\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
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
      ].join('\n'),
      options: [{skipShapeProps: false}],
      errors: [{
        message: '\'a\' PropType is defined but prop is never used'
      }, {
        message: '\'a.b\' PropType is defined but prop is never used'
      }, {
        message: '\'a.b.c\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        type Props = { foo: string }
        function higherOrderComponent<Props>() {
          return class extends React.Component<Props> {
            render() {
              return <div />;
            }
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: '\'foo\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  ...BasePerson,',
        '  lastname: PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: [{
        message: '\'lastname\' PropType is defined but prop is never used'
      }]
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
      parser: 'babel-eslint',
      options: [{skipShapeProps: false}],
      errors: [{
        message: '\'person.lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: [
        'import BasePerson from \'./types\'',
        'class Hello extends React.Component {',
        '  render () {',
        '    return <div>Hello {this.props.person.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  person: ProTypes.shape({',
        '    ...BasePerson,',
        '    lastname: PropTypes.string',
        '  })',
        '};'
      ].join('\n'),
      options: [{skipShapeProps: false}],
      errors: [{
        message: '\'person.lastname\' PropType is defined but prop is never used'
      }]
    }, {
      code: `
        import PropTypes from 'prop-types';
        import React from 'react';

        const MyComponent= (props) => {
          switch (props.usedProp) {
            case 1:
              return (<div />);
            default:
              return <div />;
          }
        };

        MyComponent.propTypes = {
          usedProp: PropTypes.string,
          unUsedProp: PropTypes.string,
        };

        export default MyComponent;
      `,
      errors: [{
        message: '\'unUsedProp\' PropType is defined but prop is never used'
      }]
    }

    /* , {
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
