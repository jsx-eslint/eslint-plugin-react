/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const semver = require('semver');
const eslintPkg = require('eslint/package.json').version;
const babelEslintVersion = require('babel-eslint/package.json').version;
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/prop-types');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  react: {
    pragma: 'Foo',
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('prop-types', rule, {
  valid: parsers.all([].concat(
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.string.isRequired
          },
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.object.isRequired
          },
          render: function() {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello World</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello World {this.props.children}</div>;
          }
        });
      `,
      options: [{ ignore: ['children'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            var props = this.props;
            return <div>Hello World</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            var propName = "foo";
            return <div>Hello World {this.props[propName]}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: externalPropTypes.mySharedPropTypes,
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello World</div>;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
          }
        }
        Hello.propTypes = {
          firstname: PropTypes.string
        };
        Hello.propTypes.lastname = PropTypes.string;
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.object.isRequired
          },
          render: function() {
            var user = {
              name: this.props.name
            };
            return <div>Hello {user.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        class Hello {
          render() {
            return 'Hello' + this.props.name;
          }
        }
      `,
    },
    {
      code: `
        class Hello {
          method;
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var { firstname, ...other } = this.props;
            return <div>Hello {firstname}</div>;
          }
        }
        Hello.propTypes = {
          firstname: PropTypes.string
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var {firstname, lastname} = this.state, something = this.props;
            return <div>Hello {firstname}</div>;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
        Hello.propTypes = {
          'firstname': PropTypes.string
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            if (Object.prototype.hasOwnProperty.call(this.props, 'firstname')) {
              return <div>Hello {this.props.firstname}</div>;
            }
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          'firstname': PropTypes.string
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {};
        Hello.propTypes.a = PropTypes.shape({
          b: PropTypes.string
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b.c;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.shape({
            b: PropTypes.shape({
            })
          })
        };
        Hello.propTypes.a.b.c = PropTypes.number;
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b.c;
            this.props.a.__.d.length;
            this.props.a.anything.e[2];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.objectOf(
            PropTypes.shape({
              c: PropTypes.number,
              d: PropTypes.string,
              e: PropTypes.array
            })
          )
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var i = 3;
            this.props.a[2].c;
            this.props.a[i].d.length;
            this.props.a[i + 2].e[2];
            this.props.a.length;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.arrayOf(
            PropTypes.shape({
              c: PropTypes.number,
              d: PropTypes.string,
              e: PropTypes.array
            })
          )
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.length;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string
          ])
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.c;
            this.props.a[2] === true;
            this.props.a.e[2];
            this.props.a.length;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.shape({
              c: PropTypes.number,
              e: PropTypes.array
            }).isRequired,
            PropTypes.arrayOf(
              PropTypes.bool
            )
          ])
        };
      `,
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
            }),
            PropTypes.shape({
              baz: PropTypes.string
            })
          ])
        };
      `,
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
            }),
            PropTypes.instanceOf(Baz)
          ])
        };
      `,
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div>{this.props.foo.baz}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.oneOf(['bar', 'baz'])
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.render;
            this.props.a.c;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.instanceOf(Hello)
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.arr;
            this.props.arr[3];
            this.props.arr.length;
            this.props.arr.push(3);
            this.props.bo;
            this.props.bo.toString();
            this.props.fu;
            this.props.fu.bind(this);
            this.props.numb;
            this.props.numb.toFixed();
            this.props.stri;
            this.props.stri.length();
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          arr: PropTypes.array,
          bo: PropTypes.bool.isRequired,
          fu: PropTypes.func,
          numb: PropTypes.number,
          stri: PropTypes.string
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var {
              propX,
              "aria-controls": ariaControls,
              ...props } = this.props;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "propX": PropTypes.string,
          "aria-controls": PropTypes.string
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props["some.value"];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "some.value": PropTypes.string
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props["arr"][1];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "arr": PropTypes.array
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props["arr"][1]["some.value"];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "arr": PropTypes.arrayOf(
            PropTypes.shape({"some.value": PropTypes.string})
          )
        };
      `,
    },
    {
      code: `
        class ArrayLengthTest extends React.Component {
          render() {
            use(this.props.arr.length)
            use(this.props.arr2.length)
            return <div />
          }
        }

        ArrayLengthTest.propTypes = {
          arr: PropTypes.array,
          arr2: PropTypes.arrayOf(PropTypes.number),
        }`,
    },
    {
      code: `
        var TestComp1 = createReactClass({
          propTypes: {
            size: PropTypes.string
          },
          render: function() {
            var foo = {
              baz: 'bar'
            };
            var icons = foo[this.props.size].salut;
            return <div>{icons}</div>;
          }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>{this.props.name.firstname}</div>;
          }
        }
      `,
      options: [{ ignore: ['name'] }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const {firstname, lastname} = this.props.name;
            return <div>{firstname} {lastname}</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.shape({
            firstname: PropTypes.string,
            lastname: PropTypes.string
          })
        };
      `,
    },
    {
      code: `
        const foo = {};
        class Hello extends React.Component {
          render() {
            const {firstname, lastname} = this.props.name;
            return <div>{firstname} {lastname}</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.shape(foo)
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            let {firstname} = this;
            return <div>{firstname}</div>;
          }
        };
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            router: PropTypes.func
          },
          render: function() {
            var nextPath = this.props.router.getCurrentQuery().nextPath;
            return <div>{nextPath}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            firstname: CustomValidator.string
          },
          render: function() {
            return <div>{this.props.firstname}</div>;
          }
        });
      `,
      options: [{ customValidators: ['CustomValidator'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            outer: CustomValidator.shape({
              inner: CustomValidator.map
            })
          },
          render: function() {
            return <div>{this.props.outer.inner}</div>;
          }
        });
      `,
      options: [{ customValidators: ['CustomValidator'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            outer: PropTypes.shape({
              inner: CustomValidator.string
            })
          },
          render: function() {
            return <div>{this.props.outer.inner}</div>;
          }
        });
      `,
      options: [{ customValidators: ['CustomValidator'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            outer: CustomValidator.shape({
              inner: PropTypes.string
            })
          },
          render: function() {
            return <div>{this.props.outer.inner}</div>;
          }
        });
      `,
      options: [{ customValidators: ['CustomValidator'] }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.string
          },
          render: function() {
            return <div>{this.props.name.get("test")}</div>;
          }
        });
      `,
      options: [{ customValidators: ['CustomValidator'] }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <span />;
          }
        }
        Comp1.propTypes = {
          prop1: PropTypes.number
        };
        class Comp2 extends Component {
          render() {
            return <span />;
          }
        }
        Comp2.propTypes = {
          prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)
        };
      `,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <span />;
          }
        }
        Comp1.propTypes = {
          prop1: PropTypes.number
        };
        class Comp2 extends Component {
          static propTypes = {
            prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)
          }
          render() {
            return <span />;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return <span />;
          }
        }
        Comp1.propTypes = {
          prop1: PropTypes.number
        };
        var Comp2 = createReactClass({
          propTypes: {
            prop2: PropTypes.arrayOf(Comp1.propTypes.prop1)
          },
          render() {
            return <span />;
          }
        });
      `,
    },
    {
      code: `
        const SomeComponent = createReactClass({
          propTypes: SomeOtherComponent.propTypes
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            let { a, ...b } = obj;
            let c = { ...d };
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {}
          render() {
            return <div>Hello World</div>;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {}
          render() {
            var users = this.props.users.find(user => user.name === 'John');
            return <div>Hello you {users.length}</div>;
          }
        }
        Hello.propTypes = {
          users: PropTypes.arrayOf(PropTypes.object)
        };
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const {} = this.props;
            return <div>Hello</div>;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var foo = 'fullname';
            var { [foo]: firstname } = this.props;
            return <div>Hello {firstname}</div>;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            this.state = { status: props.source.uri }
          }
          static propTypes = {
            source: PropTypes.object
          };
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            this.state = { status: this.props.source.uri }
          }
          static propTypes = {
            source: PropTypes.object
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Should not be detected as a component
      code: `
        HelloJohn.prototype.render = function() {
          return React.createElement(Hello, {
            name: this.props.firstname
          });
        };
      `,
    },
    {
      code: `
        function HelloComponent() {
          class Hello extends React.Component {
            render() {
              return <div>Hello {this.props.name}</div>;
            }
          }
          Hello.propTypes = { name: PropTypes.string };
          return Hello;
        }
        module.exports = HelloComponent();
      `,
    },
    {
      code: `
        function HelloComponent() {
          var Hello = createReactClass({
            propTypes: { name: PropTypes.string },
            render: function() {
              return <div>Hello {this.props.name}</div>;
            }
          });
          return Hello;
        }
        module.exports = HelloComponent();
      `,
    },
    {
      code: `
        class DynamicHello extends Component {
          render() {
            const {firstname} = this.props;
            class Hello extends Component {
              render() {
                const {name} = this.props;
                return <div>Hello {name}</div>;
              }
            }
            Hello.propTypes = {
              name: PropTypes.string
            };
            Hello = connectReduxForm({name: firstname})(Hello);
            return <Hello />;
          }
        }
        DynamicHello.propTypes = {
          firstname: PropTypes.string,
        };
      `,
    },
    {
      code: `
        const Hello = (props) => {
          let team = props.names.map((name) => {
              return <li>{name}, {props.company}</li>;
            });
          return <ul>{team}</ul>;
        };
        Hello.propTypes = {
          names: PropTypes.array,
          company: PropTypes.string
        };
      `,
    },
    {
      code: `
        export default {
          renderHello() {
            let {name} = this.props;
            return <div>{name}</div>;
          }
        };
      `,
    },
    {
      code: `
        export default function FooBar(props) {
          const bar = props.bar;
          return (<div bar={bar}><div {...props}/></div>);
        }
        if (process.env.NODE_ENV !== 'production') {
          FooBar.propTypes = {
            bar: PropTypes.string
          }
        }
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            var {...other} = this.props;
            return (
              <div {...other} />
            );
          }
        });
      `,
    },
    {
      code: `
        const statelessComponent = (props) => {
          const subRender = () => {
            return <span>{props.someProp}</span>;
          };
          return <div>{subRender()}</div>;
        };
        statelessComponent.propTypes = {
          someProp: PropTypes.string
        };
      `,
    },
    {
      code: `
        const statelessComponent = ({ someProp }) => {
          const subRender = () => {
            return <span>{someProp}</span>;
          };
          return <div>{subRender()}</div>;
        };
        statelessComponent.propTypes = {
          someProp: PropTypes.string
        };
      `,
    },
    {
      code: `
        const statelessComponent = function({ someProp }) {
          const subRender = () => {
            return <span>{someProp}</span>;
          };
          return <div>{subRender()}</div>;
        };
        statelessComponent.propTypes = {
          someProp: PropTypes.string
        };
      `,
    },
    {
      code: `
        function statelessComponent({ someProp }) {
          const subRender = () => {
            return <span>{someProp}</span>;
          };
          return <div>{subRender()}</div>;
        };
        statelessComponent.propTypes = {
          someProp: PropTypes.string
        };
      `,
    },
    {
      code: `
        function notAComponent({ something }) {
          return something + 1;
        };
      `,
    },
    {
      code: `
        const notAComponent = function({ something }) {
          return something + 1;
        };
      `,
    },
    {
      code: `
        const notAComponent = ({ something }) => {
          return something + 1;
        };
      `,
    },
    {
      // Validation is ignored on reassigned props object
      code: `
        const statelessComponent = (props) => {
          let newProps = props;
          return <span>{newProps.someProp}</span>;
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: string;
          };
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: Object;
          };
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: Object;};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {'data-action': string};
        function Button({ 'data-action': dataAction }: Props) {
          return <div data-action={dataAction} />;
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        import type Props from "fake";
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: {
              firstname: string;
            }
          };
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: {firstname: string;};};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: {firstname: string; lastname: string;};};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {name: {firstname: string;}};
        class Hello extends React.Component {
          props: {people: Person[];};
          render () {
            var names = [];
            for (var i = 0; i < this.props.people.length; i++) {
              names.push(this.props.people[i].name.firstname);
            }
            return <div>Hello {names.join(
        )}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {name: {firstname: string;}};
        type Props = {people: Person[];};
        class Hello extends React.Component {
          props: Props;
          render () {
            var names = [];
            for (var i = 0; i < this.props.people.length; i++) {
              names.push(this.props.people[i].name.firstname);
            }
            return <div>Hello {names.join(
        )}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {name: {firstname: string;}};
        type Props = {people: Person[]|Person;};
        class Hello extends React.Component {
          props: Props;
          render () {
            var names = [];
            if (Array.isArray(this.props.people)) {
              for (var i = 0; i < this.props.people.length; i++) {
                names.push(this.props.people[i].name.firstname);
              }
            } else {
              names.push(this.props.people.name.firstname);
            }
            return <div>Hello {names.join(
        )}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {ok: string | boolean;};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.ok}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {result: {ok: string | boolean;}|{ok: number | Array}};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.result.ok}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.result.ok}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        class Hello extends React.Component {
          props = {a: 123};
          render () {
            return <div>Hello</div>;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Ignore component validation if propTypes are composed using spread
      code: `
        class Hello extends React.Component {
            render() {
                return  <div>Hello {this.props.firstName} {this.props.lastName}</div>;
            }
        };
        const otherPropTypes = {
            lastName: PropTypes.string
        };
        Hello.propTypes = {
            ...otherPropTypes,
            firstName: PropTypes.string
        };
      `,
    },
    {
      // Ignore destructured function arguments
      code: `
        class Hello extends React.Component {
          render () {
            return ["string"].map(({length}) => <div>{length}</div>);
          }
        }
      `,
    },
    {
      // Flow annotations on stateless components
      code: `
        type Props = {
          firstname: string;
          lastname: string;
        };
        function Hello(props: Props): React.Element {
          const {firstname, lastname} = props;
          return <div>Hello {firstname} {lastname}</div>
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {
          firstname: string;
          lastname: string;
        };
        const Hello = function(props: Props): React.Element {
          const {firstname, lastname} = props;
          return <div>Hello {firstname} {lastname}</div>
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {
          firstname: string;
          lastname: string;
        };
        const Hello = (props: Props): React.Element => {
          const {firstname, lastname} = props;
          return <div>Hello {firstname} {lastname}</div>
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {
          'completed?': boolean,
        };
        const Hello = (props: Props): React.Element => {
          return <div>{props['completed?']}</div>;
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {
          name: string,
        };
        class Hello extends React.Component {
          props: Props;
          render() {
            const {name} = this.props;
            return name;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type PropsUnionA = {
          a: string,
          b?: void,
        };
        type PropsUnionB = {
          a?: void,
          b: string,
        };
        type Props = {
          name: string,
        } & (PropsUnionA | PropsUnionB);
        class Hello extends React.Component {
          props: Props;
          render() {
            const {name} = this.props;
            return name;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        import type { FieldProps } from "redux-form"

        type Props = {
        label: string,
          type: string,
          options: Array<SelectOption>
        } & FieldProps
      `,
      features: ['types'],
    },
    {
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
      features: ['flow'],
    },
    {
      code: `
        Card.propTypes = {
          title: PropTypes.string.isRequired,
          children: PropTypes.element.isRequired,
          footer: PropTypes.node
        }
        function Card ({ title, children, footer }) {
          return (
            <div/>
          )
        }
      `,
    },
    {
      code: `
        function JobList(props) {
          props
          .jobs
          .forEach(() => {});
          return <div></div>;
        }
        JobList.propTypes = {
          jobs: PropTypes.array
        };
      `,
    },
    {
      code: `
        type Props = {
          firstname: ?string,
        };
        function Hello({firstname}: Props): React$Element {
          return <div>Hello {firstname}</div>;
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        function Greetings() {
          return <div>{({name}) => <Hello name={name} />}</div>
        }
      `,
    },
    {
      code: `
        function Greetings() {
          return <div>{function({name}) { return <Hello name={name} />; }}</div>
        }
      `,
    },
    {
      // Should stop at the class when searching for a parent component
      code: `
        export default (ComposedComponent) => class Something extends SomeOtherComponent {
          someMethod = ({width}) => {}
        }
      `,
      features: ['class fields'],
    },
    {
      // Should stop at the decorator when searching for a parent component
      code: `
        @asyncConnect([{
          promise: ({dispatch}) => {}
        }])
        class Something extends Component {}
      `,
      features: ['decorators'],
    },
    {
      // Should not find any used props
      code: `
        function Hello(props) {
          const {...rest} = props;
          return <div>Hello</div>;
        }
      `,
    },
    {
      code: `
        let Greetings = class extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        };
        Greetings.propTypes = {
          name: PropTypes.string
        }
      `,
    },
    {
      code: `
        let Greetings = {
          Hello: class extends React.Component {
            render () {
              return <div>Hello {this.props.name}</div>;
            }
          }
        }
        Greetings.Hello.propTypes = {
          name: PropTypes.string
        };
      `,
    },
    {
      code: `
        let Greetings = {};
        Greetings.Hello = class extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        };
        Greetings.Hello.propTypes = {
          name: PropTypes.string
        }
      `,
    },
    {
      code: `
        function Hello({names}) {
          return names.map((name) => {
            return <div>{name}</div>;
          });
        }
      `,
    },
    {
      code: `
        type Target = { target: EventTarget }
        class MyComponent extends Component {
          static propTypes = {
            children: PropTypes.any,
          }
          handler({ target }: Target) {}
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      `,
      features: ['class fields', 'types'],
    },
    {
      code: `
        class Hello extends Component {}
        Hello.Foo = ({foo}) => (
          <div>Hello {foo}</div>
        )
        Hello.Foo.propTypes = {
          foo: PropTypes.node
        }
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{this.props.name}</div>;
          }
        });
      `,
      options: [{ skipUndeclared: true }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>{this.props.name}</div>;
          }
        }
      `,
      options: [{ skipUndeclared: true }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.object.isRequired
          },
          render: function() {
            return <div>{this.props.name}</div>;
          }
        });
      `,
      options: [{ skipUndeclared: true }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.object.isRequired
          },
          render: function() {
            return <div>{this.props.name}</div>;
          }
        });
      `,
      options: [{ skipUndeclared: false }],
    },
    {
      // Async functions can't be components.
      code: `
        var Hello = async function(props) {
          return <div>Hello {props.name}</div>;
        }
      `,
    },
    {
      // Async functions can't be components.
      code: `
        async function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
      `,
    },
    {
      // Async functions can't be components.
      code: `
        var Hello = async (props) => {
          return <div>Hello {props.name}</div>;
        }
      `,
    },
    {
      // Flow annotations with variance
      code: `
        type Props = {
          +firstname: string;
          -lastname: string;
        };
        function Hello(props: Props): React.Element {
          const {firstname, lastname} = props;
          return <div>Hello {firstname} {lastname}</div>
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        class Hello extends React.Component {
          async onSelect({ name }) {
            return null;
          }
          render() {
            return <Greeting onSelect={this.onSelect} />;
          }
        }
      `,
    },
    {
      code: `
        export class Example extends Component {
          static propTypes = {
            onDelete: PropTypes.func.isRequired
          }
          handleDeleteConfirm = () => {
            this.props.onDelete();
          };
          handleSubmit = async ({certificate, key}) => {};
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        type Person = {
          ...data,
          lastname: string
        };
        class Hello extends React.Component {
          props: Person;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {|
          ...data,
          lastname: string
        |};
        class Hello extends React.Component {
          props: Person;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          ...$Exact<data>,
          lastname: string
        };
        class Hello extends React.Component {
          props: Person;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        import type {Data} from './Data'
        type Person = {
          ...Data,
          lastname: string
        };
        class Hello extends React.Component {
          props: Person;
          render () {
            return <div>Hello {this.props.bar}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        import type {Data} from 'some-libdef-like-flow-typed-provides'
        type Person = {
          ...Data,
          lastname: string
        };
        class Hello extends React.Component {
          props: Person;
          render () {
            return <div>Hello {this.props.bar}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        import type {BasePerson} from './types'
        type Props = {
          person: {
           ...$Exact<BasePerson>,
           lastname: string
          }
        };
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.person.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type OtherProps = {
          firstname: string,
        };
        type Props = {
           ...OtherProps,
           lastname: string
        };
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type FooProps = {
          ...any,
          ...42,
        }
        function Foo(props: FooProps) {
          return <p />;
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            const { firstname } = this.props;
            return <div>Hello {firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            const { firstname } = this.props;
            return <div>Hello {firstname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: {firstname: string;};};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: {firstname: string;};};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.name.firstname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
      code: `
        type Note = {text: string, children?: Note[]};
        type Props = {
          notes: Note[];
        };
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.notes[0].text}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
      code: `
        import type Props from "fake";
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        import type Props from "fake";
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, { person: Person }, void> {
          render () {
            return <div>Hello {this.props.person.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, { person: Person }, void> {
          render () {
            return <div>Hello {this.props.person.firstname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
      code: `
        type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.result.ok}</div>;
          }
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        type Props = {result?: {ok?: ?string | boolean;}|{ok?: ?number | Array}};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.result.ok}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
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
      features: ['types'],
    },
    {
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
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
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
      settings: { react: { flowVersion: '0.53' } },
      features: ['flow'],
    },
    {
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
      features: ['types'],
    },
    {
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
      settings: { react: { flowVersion: '0.53' } },
      features: ['types'],
    },
    {
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
      features: ['types'],
    },
    {
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
      features: ['types'],
    },
    {
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
      features: ['types'],
    },
    {
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
      features: ['flow'],
    },
    {
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
      features: ['flow'],
    },
    {
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
      features: ['flow'],
    },
    {
      code: `
        function higherOrderComponent<P: { foo: string }>() {
          return class extends React.Component<P> {
            render() {
              return <div>{this.props.foo}</div>
            }
          }
        }
      `,
      features: ['flow'],
    },
    {
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
      features: ['flow'],
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
      features: ['flow'],
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
      features: ['flow'],
    },
    {
      code: `
        const Slider = props => (
          <RcSlider {...props} />
        );

        Slider.propTypes = RcSlider.propTypes;
      `,
    },
    {
      code: `
        const Slider = props => (
          <RcSlider foo={props.bar} />
        );

        Slider.propTypes = RcSlider.propTypes;
      `,
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
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          bar() {
            this.setState((state, props) => {
              function f(_, {aaaaaaa}) {}
            });
          }
        }
      `,
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
      settings: { react: { version: '16.3.0' } },
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
      `,
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
      `,
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
          pragma: 'Foo',
        },
      },
    },
    {
      code: `
        const Label = React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
        Label.propTypes = {
          text: PropTypes.string,
        };
      `,
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
          pragma: 'Foo',
        },
      },
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
      `,
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
          pragma: 'Foo',
        },
      },
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
      features: ['class fields'],
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
      `,
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
      `,
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
      `,
    },
    {
      code: `
        export default class LazyLoader extends Component {
          static propTypes = {
            children: PropTypes.node,
            load: PropTypes.any,
          };
          state = { mod: null };
          shouldComponentUpdate(prevProps) {
            assert(prevProps.load === this.props.load);
            return true;
          }
          load() {
            this.props.load(mod => {
              this.setState({
                mod: mod.default ? mod.default : mod
              });
            });
          }
          render() {
            if (this.state.mod !== null) {
              return this.props.children(this.state.mod);
            }
            this.load();
            return null;
          }
        }
      `,
      features: ['class fields'],
    },
    {
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
      `,
    },
    {
      code: `
        const a = {};
        function fn1() {}
        const b = a::fn1();
      `,
      features: ['bind operator'],
    },
    {
      // issue #2138
      code: `
        type UsedProps = {|
          usedProp: number,
        |};

        type UnusedProps = {|
          unusedProp: number,
        |};

        type Props = {| ...UsedProps, ...UnusedProps |};

        function MyComponent({ usedProp }: Props) {
          return <div>{usedProp}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          message: "'notOne' is missing in props validation",
          line: 8,
          column: 34,
        },
      ],
    },
    {
      // issue #1259
      code: `
        const Hello = props => {
          const { notInProp } = dict[props.foo];
          return <div />
        }

        Hello.propTypes = {
          foo: PropTypes.number,
        }
      `,
    },
    {
      // issue #2298
      code: `
      type Props = {|
        firstname?: string
      |};

      function Hello({ firstname = 'John' }: Props = {}) {
        return <div>Hello {firstname}</div>
      }
      `,
      features: ['flow'],
    },
    {
      // issue #2326
      code: `
        for (const {result} of results) {}
      `,
    },
    {
      // issue #2330
      code: `
        type Props = {
          user: {
            [string]: string
          }
        };

        export function Bar(props: Props) {
          return (
            <div>
              {props.user}
              {props.user.name}
            </div>
          );
        }
      `,
      features: ['flow'],
    },
    {
      code: `
        const Label = React.memo(React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }));
        Label.propTypes = {
          text: PropTypes.string
        };
      `,
    },
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }));
        Label.propTypes = {
          text: PropTypes.string
        };
      `,
    },
    {
      code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }));
        Label.propTypes = {
          text: PropTypes.string
        };
      `,
      settings: {
        react: {
          pragma: 'Foo',
        },
      },
    },
    {
      code: `
        const Foo = ({length, ordering}) => (
          length > 0 && (
            <Paginator items={ordering} pageSize={10} />
          )
        );
        Foo.propTypes = {
          length: PropTypes.number,
          ordering: PropTypes.array
        };
      `,
    },
    // shouldn't trigger this rule since functions stating with a lowercase
    // letter are not considered components
    `
      function noAComponent(props) {
        return <div>{props.text}</div>
      }
    `,
    {
      code: `
      export default function() {}
      `,
    },
    {
      code: `
        function Component(props) {
          return 0,
          <div>
            Hello, { props.name }!
          </div>
        }

        Component.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
    },
    {
      code: `
      const SideMenu = styled(
        ({ componentId }) => (
          <S.Container>
            <S.Head />
            <UserInfo />
            <Separator />
            <MenuList componentId={componentId} />
          </S.Container>
        ),
      );
      SideMenu.propTypes = {
        componentId: PropTypes.string.isRequired
      }
      `,
      settings: {
        componentWrapperFunctions: [{ property: 'styled' }],
      },
    },
    {
      code: `
        interface Props {
          'aria-label': string // 'undefined' PropType is defined but prop is never used eslint(react/no-unused-prop-types)
          // 'undefined' PropType is defined but prop is never used eslint(react-redux/no-unused-prop-types)
        }

        export default function Component({
          'aria-label': ariaLabel, // 'aria-label' is missing in props validation eslint(react/prop-types)
        }: Props): JSX.Element {
          return <div aria-label={ariaLabel} />
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface Props {
          value?: string;
        }

        // without the | null, all ok, with it, it is broken
        function Test ({ value }: Props): React.ReactElement<Props> | null {
          if (!value) {
            return null;
          }

          return <div>{value}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface Props {
          value?: string;
        }

        // without the | null, all ok, with it, it is broken
        function Test ({ value }: Props): React.ReactElement<Props> | null {
          if (!value) {
            return <div>{value}</div>;;
          }

          return null;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface Props {
          value?: string;
        }
        const Hello = (props: Props) => {
          if (props.value) {
            return <div></div>;
          }
          return null;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    // shouldn't trigger this rule for 'render' since functions stating with a lowercase
    // letter are not considered components
    {
      code: `
      const MyComponent = (props) => {
        const render = () => {
          return <test>{props.hello}</test>;
        }
        return render();
      };
      MyComponent.propTypes = {
        hello: PropTypes.string.isRequired,
      };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface Props {
          value?: string;
        }

        // without the | null, all ok, with it, it is broken
        function Test ({ value }: Props): React.ReactElement<Props> | null {
          if (!value) {
            return null;
          }
          return <div>{value}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import * as React from 'react';

        interface Props {
          text: string;
        }

        export const Test: React.FC<Props> = (props: Props) => {
          const createElement = (text: string) => {
            return (
              <div>
                {text}
              </div>
            );
          };

          return <>{createElement(props.text)}</>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        const mapStateToProps = state => ({
          books: state.books
        });

        interface InfoLibTableProps extends ReturnType<typeof mapStateToProps> {
        }

        const App = (props: InfoLibTableProps) => {
          props.books();
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        const mapStateToProps = state => ({
          books: state.books
        });

        interface BooksTable extends ReturnType<typeof mapStateToProps> {
          username: string;
        }

        const App = (props: BooksTable) => {
          props.books();
          return <div><span>{props.username}</span></div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface infoLibTable {
          removeCollection(): Array<string>;
        }

        interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => infoLibTable> {
        }

        const App = (props: InfoLibTableProps) => {
          props.removeCollection();
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface addTable {
          createCollection: () => Array<string>
        }

        type infoLibTable = addTable & {
          removeCollection: () => Array<string>
        }

        interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => infoLibTable> {
        }

        const App = (props: InfoLibTableProps) => {
          props.createCollection();
          props.removeCollection();
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => {
          removeCollection:  () => Array<string>,
        }> {
        }

        const App = (props: InfoLibTableProps) => {
          props.removeCollection();
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface addTable {
          createCollection: () => Array<string>;
        }

        type infoLibTable = {
          removeCollection: () => Array<string>,
        };

        interface InfoLibTableProps extends  ReturnType<
        (dispatch: storeDispatch) => infoLibTable & addTable,
        >{}

        const App = (props: InfoLibTableProps) => {
          props.createCollection();
          props.removeCollection();
          return <div></div>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface addTable {
          createCollection: () => Array<string>;
        }

        type infoLibTable = ReturnType<(dispatch: storeDispatch) => infoLibTable & addTable> & {
          removeCollection: () => Array<string>,
        };

        interface InfoLibTableProps {}

        const App = (props: infoLibTable) => {
          props.createCollection();
          props.removeCollection();
          return <div></div>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface InfoLibTableProps extends ReturnType<(dispatch: storeDispatch) => ({
          removeCollection:  () => Array<string>,
        })> {
        }

        const App = (props: InfoLibTableProps) => {
          props.removeCollection();
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface ThingProps extends React.HTMLAttributes<HTMLDivElement> {
          thing?: number
        }

        export const Thing = ({ thing = 1, style, ...props }: ThingProps) => {
          return <div />;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface ThingProps {
          thing?: number
        }

        export const Thing = ({ thing = 1, style, ...props }: ThingProps & React.HTMLAttributes<HTMLDivElement>) => {
          return <div />;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        type User = {
          user: string;
        }

        type Props = User & UserProps;

        export default (props: Props) => {
          const { userId, user } = props;

          if (userId === 0) {
            return <p>userId is 0</p>;
          }

          return null;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        type User = {
        }

        type Props = User & UserProps;

        export default (props: Props) => {
          const { user } = props;

          if (user === 0) {
            return <p>user is 0</p>;
          }

          return null;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface GenericProps {
          onClose: () => void
        }

        interface ImplementationProps extends GenericProps {
          onClick: () => void
        }

        export const Implementation: FC<ImplementationProps> = (
          {
            onClick,
            onClose,
          }: ImplementationProps
        ) => (<div />)
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface Props extends V2SocialLoginProps {
          autoLoad: boolean;
        }

        export const DKFacebookButton = ({
          autoLoad,
          authAction,
          errorHandler,
          redirectUrl,
          isSignup,
        }: Props): JSX.Element | null => {
          if (!APP_ID) {
            rollbar.error('Missing Facebook OAuth App Id');
            return null;
          }

          const fbButtonText = isSignup ? 'Sign up with Facebook' : 'Log in with Facebook';

          const responseCallback = async ({
            accessToken,
            email = '',
            name = '',
          }: ReactFacebookLoginInfo) => {
            const [firstName, lastName] = name.split(' ');

            const requestData: DK.SocialLogin = {
              accessToken,
              email,
              firstName,
              lastName,
              intercomUserId: intercomService.getVisitorId(),
            };

            try {
              await authAction(requestData, redirectUrl);
            } catch (err) {
              errorHandler(err.message);
            }
          };

          const FacebookIcon = () => (
            <img
              style={{ marginRight: '8px' }}
              src={facebookIcon}
              alt='Facebook Login'
            />
          );

          return (
            <FacebookLogin
              cssClass='ant-btn dk-button dk-facebook-button dk-button--secondary ant-btn-primary ant-btn-lg'
              autoLoad={autoLoad}
              textButton={fbButtonText}
              size='small'
              icon={<FacebookIcon />}
              appId={APP_ID}
              fields='name,email'
              callback={responseCallback}
              data-testId='dk-facebook-button'
            />
          );
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        function Foo({ bar = "" }: { bar: string }): JSX.Element {
          return <div>{bar}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    // Issue: #2795
    {
      code: `
      type ConnectedProps = DispatchProps &
        StateProps

      const Component = ({ prop1, prop2, prop3 }: ConnectedProps) => {
        // Do stuff
        return (
          <StyledComponent>...</StyledComponent>
        )
      }

      const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => ({
        ...bindActionCreators<{prop1: ()=>void,prop2: ()=>string}>(
          { prop1: importedAction, prop2: anotherImportedAction },
          dispatch,
        ),
      })

      const mapStateToProps = (state: State) => ({
        prop3: Selector.value(state),
      })

      type StateProps = ReturnType<typeof mapStateToProps>
      type DispatchProps = ReturnType<typeof mapDispatchToProps>`,
      features: ['ts', 'no-babel'],
    },
    // Issue: #2795
    {
      code: `
      type ConnectedProps = DispatchProps &
        StateProps

      const Component = ({ prop1, prop2, prop3 }: ConnectedProps) => {
        // Do stuff
        return (
          <StyledComponent>...</StyledComponent>
        )
      }

      const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => ({
        ...bindActionCreators<ActionCreatorsMapObject<Types.RootAction>>(
          { prop1: importedAction, prop2: anotherImportedAction },
          dispatch,
        ),
      })

      const mapStateToProps = (state: State) => ({
        prop3: Selector.value(state),
      })

      type StateProps = ReturnType<typeof mapStateToProps>
      type DispatchProps = ReturnType<typeof mapDispatchToProps>`,
      features: ['ts', 'no-babel'],
    },
    // Issue: #2795
    {
      code: `
      type ConnectedProps = DispatchProps &
        StateProps

      const Component = ({ prop1, prop2, prop3 }: ConnectedProps) => {
        // Do stuff
        return (
          <StyledComponent>...</StyledComponent>
        )
      }

      const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) =>
        bindActionCreators<{prop1: ()=>void,prop2: ()=>string}>(
          { prop1: importedAction, prop2: anotherImportedAction },
          dispatch,
        )

      const mapStateToProps = (state: State) => ({
        prop3: Selector.value(state),
      })

      type StateProps = ReturnType<typeof mapStateToProps>
      type DispatchProps = ReturnType<typeof mapDispatchToProps>`,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
      import React from 'react'

      interface Meta {
        touched: boolean,
        error: string;
      }

      interface Props {
        input: string,
        meta: Meta,
        cssClasses: object
      }
      const InputField = ({ input, meta: { touched, error }, cssClasses = {}, ...restProps }: Props) => {
        restProps.className = cssClasses.base

        if (cssClasses.custom) {
          restProps.className += 'cssClasses.custom'
        }
        if (touched && error) {
          restProps.className += 'cssClasses.error'
        }

        return(
          <input
            {...input}
            {...restProps}
          />
        )
      }
      export default InputField`,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'

        type ComponentProps = {
          name: string
        }

        class Factory {
          getComponent() {
            return function Component({ name }: ComponentProps) {
              return <div>Hello {name}</div>
            }
          }
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';

        interface PersonProps {
            username: string;
        }
        const Person: React.FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';

        const Person: React.FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';

        interface PersonProps {
            username: string;
        }
        const Person: React.FC<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';
        const Person: React.FunctionComponent<{ username: string }> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';
        type PersonProps = {
            username: string;
        }
        const Person: React.FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import { FunctionComponent } from 'react';

        type PersonProps = {
            username: string;
        }
        const Person: FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import { FC } from 'react';
        type PersonProps = {
            username: string;
        }
        const Person: FC<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import type { FC } from 'react';
        type PersonProps = {
            username: string;
        }
        const Person: FC<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import { FC as X } from 'react';
        interface PersonProps {
            username: string;
        }
        const Person: X<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import * as X from 'react';
        interface PersonProps {
            username: string;
        }
        const Person: X.FC<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      features: ['ts', 'no-babel'],
    },
    {
      // issue: https://github.com/yannickcr/eslint-plugin-react/issues/2786
      code: `
        import React from 'react';

        interface Props {
          item: any;
        }

        const SomeComponent: React.FC<Props> = ({ item }: Props) => {
          return item ? <></> : <></>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        export const EuiSuperSelectControl: <T extends string>(
          props: EuiSuperSelectControlProps<T>
        ) => ReturnType<FunctionComponent<EuiSuperSelectControlProps<T>>> = ({
          ...rest
        }) => {
          return null;
        }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';

        const MyComponent = (props: React.PropsWithChildren<{ username: string }>): React.ReactElement => {
          return <>{props.children}{props.username}</>;
        };

      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        type Props<ValueType> = {
          value: ValueType;
          onClick: (value: ValueType) => void;
        };

        const Button = <T,>({ onClick, value }: Props<T>) => {
          return <button onClick={() => onClick(value)}>BUTTON</button>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
          import React, { VoidFunctionComponent } from 'react'

          interface Props {
          age: number
          }
          const Hello: VoidFunctionComponent<Props> = function Hello(props) {
          const { age } = props;

          return <div>Hello {age}</div>;
          }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
          import React from 'react'

          interface Props {
          age: number
          }
          const Hello: React.VoidFunctionComponent<Props> = function Hello(props) {
          const { age } = props;

          return <div>Hello {age}</div>;
          }
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { ForwardRefRenderFunction  as X } from 'react'

        type IfooProps = { e: string };
          const Foo: X<HTMLDivElement, IfooProps> = function Foo (props, ref) {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { ForwardRefRenderFunction } from 'react'

        type IfooProps = { e: string };
          const Foo: ForwardRefRenderFunction<HTMLDivElement, IfooProps> = function Foo (props, ref) {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { ForwardRefRenderFunction } from 'react'

        type IfooProps = { e: string };
          const Foo: ForwardRefRenderFunction<HTMLDivElement, IfooProps> = (props, ref) => {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'

        type IfooProps = { e: string };
        const Foo= React.forwardRef<HTMLDivElement, IfooProps>((props, ref) => {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { forwardRef } from 'react'

        type IfooProps = { e: string };
        const Foo= forwardRef<HTMLDivElement, IfooProps>((props, ref) => {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'
        type IfooProps = { e: string };
        const Foo= React.forwardRef<HTMLDivElement, IfooProps>(function Foo(props, ref) {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'
        interface IfooProps { e: string }
        const Foo= React.forwardRef<HTMLDivElement, IfooProps>(function Foo(props, ref) {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { forwardRef } from 'react'
        interface IfooProps { e: string }
        const Foo= forwardRef<HTMLDivElement, IfooProps>(function Foo(props, ref) {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { forwardRef as X } from 'react'

        type IfooProps = { e: string };
        const Foo= X<HTMLDivElement, IfooProps>((props, ref) => {
          const { e } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'

        class Factory {
          getRenderFunction() {
            return function renderFunction({ name }) {
              return <div>Hello {name}</div>
            }
          }
        }
      `,
    },
    {
      code: `
        class Test extends React.Component {
          static propTypes = {
            value: PropTypes.string
          };

          render() {
            return <span>{this.props.value}</span>;
          }
        }
      `,
      features: ['class fields'],
    },

    // #2944
    {
      code: `
        const styles = { width: 0 };

        function Foo(props) {
          const { styles: x } = props;
          return (
            <p>
              {styles.width} {x._}
            </p>
          );
        }

        Foo.propTypes = {
          styles: PropTypes.shape({
            _: PropTypes.number,
          }),
        };
      `,
    }
  )),

  invalid: parsers.all([].concat(
    {
      code: `
        type Props = {
          name: string,
        };
        class Hello extends React.Component {
          foo(props: Props) {}
          render() {
            return this.props.name;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 8,
          column: 31,
          type: 'Identifier',
        },
      ],
      features: ['types'],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return React.createElement("div", {}, this.props.name);
          }
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 62,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 43,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 43,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const { foo: { bar } } = this.props;
            return <p>{bar}</p>
          }
        }
      `,
      errors: [
        { message: "'foo' is missing in props validation" },
        { message: "'foo.bar' is missing in props validation" },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const { foo: { bar } } = this.props;
            return <p>{bar}</p>
          }
        }

        Hello.propTypes = {
          foo: PropTypes.shape({
            _: PropTypes.string,
          })
        }
      `,
      errors: [
        { message: "'foo.bar' is missing in props validation" },
      ],
    },
    {
      code: `
        function Foo({ foo: { bar } }) {
          return <p>{bar}</p>
        }
      `,
      errors: [
        { message: "'foo' is missing in props validation" },
        { message: "'foo.bar' is missing in props validation" },
      ],
    },
    {
      code: `
        function Foo({ a }) {
          return <p>{ a.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            _: PropType.string,
          })
        }
      `,
      errors: [
        { message: "'a.nope' is missing in props validation" },
      ],
    },
    {
      code: `
        function Foo({ a }) {
          const { b } = a
          return <p>{ b.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            b: PropType.shape({
              _: PropType.string,
            }),
          })
        }
      `,
      errors: [
        { message: "'a.b.nope' is missing in props validation" },
      ],
    },
    {
      code: `
        function Foo(props) {
          const { a } = props
          return <p>{ a.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            _: PropType.string,
          })
        }
      `,
      errors: [
        { message: "'a.nope' is missing in props validation" },
      ],
    },
    {
      code: `
        function Foo(props) {
          const a = props.a
          return <p>{ a.nope }</p>
        }

        Foo.propTypes = {
          a: PropTypes.shape({
            _: PropType.string,
          })
        }
      `,
      errors: [
        { message: "'a.nope' is missing in props validation" },
      ],
    },
    {
      code: `
        class Foo extends Component {
          render() {
            const props = this.props
            return <div>{props.cat}</div>
          }
        }
      `,
      errors: [
        { message: "'cat' is missing in props validation" },
      ],
    },
    {
      code: `
        class Foo extends Component {
          render() {
            const {props} = this
            return <div>{props.cat}</div>
          }
        }
      `,
      errors: [
        { message: "'cat' is missing in props validation" },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const { name, ...rest } = this.props
            return <div>Hello</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 21,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            const { name, title, ...rest } = this.props
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.string
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'title' },
          line: 4,
          column: 27,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
           renderStuff() {
            const { name, ...rest } = this.props
            return (<div {...rest}>{name}</div>);
          }
          render() {
            this.renderStuff()
          }
        }
        Hello.propTypes = {}
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 21,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        /** @extends React.Component */
        class Hello extends ChildComponent {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 5,
          column: 43,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.firstname} {this.props.lastname}</div>;
          }
        }
        Hello.propTypes = {
          firstname: PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.string
        };
        class HelloBis extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.string.isRequired
          },
          render: function() {
            return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;
          }
        });
        var Hello2 = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'propWithoutTypeDefinition' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var { firstname, lastname } = this.props;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          firstname: PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    semver.satisfies(babelEslintVersion, '< 9') ? {
      code: `
        class Hello extends React.Component {
          static propTypes: {
            firstname: PropTypes.string
          };
          render() {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    } : [],
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.shape({
          })
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a.b' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b.c;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.shape({
            b: PropTypes.shape({
            })
          })
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a.b.c' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b.c;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.shape({})
        };
        Hello.propTypes.a.b = PropTypes.shape({});
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a.b.c' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b.c;
            this.props.a.__.d.length;
            this.props.a.anything.e[2];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.objectOf(
            PropTypes.shape({
            })
          )
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a.b.c' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a.__.d' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a.__.d.length' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a.anything.e' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var i = 3;
            this.props.a[2].c;
            this.props.a[i].d.length;
            this.props.a[i + 2].e[2];
            this.props.a.length;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.arrayOf(
            PropTypes.shape({
            })
          )
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a[].c' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a[].d' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a[].d.length' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a[].e' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.length;
            this.props.a.b;
            this.props.a.e.length;
            this.props.a.e.anyProp;
            this.props.a.c.toString();
            this.props.a.c.someThingElse();
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.shape({
              c: PropTypes.number,
              e: PropTypes.array
            })
          ])
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a.length' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a.b' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var {
              "aria-controls": ariaControls,
              propX,
              ...props } = this.props;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "aria-controls": PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'propX' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props["some.value"];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'some.value' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props["arr"][1];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'arr' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props["arr"][1]["some.value"];
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "arr": PropTypes.arrayOf(
            PropTypes.shape({})
          )
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'arr[].some.value' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var text;
            text = 'Hello ';
            let {props: {firstname}} = this;
            return <div>{text} {firstname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var {'props': {firstname}} = this;
            return <div>Hello {firstname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            if (true) {
              return <span>{this.props.firstname}</span>
            } else {
              return <span>{this.props.lastname}</span>
            }
          }
        }
        Hello.propTypes = {
          lastname: PropTypes.string
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    },
    {
      code: `
        var Hello = function(props) {
          return <div>Hello {props.name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        var Hello = (props) => {
          return <div>Hello {props.name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        var Hello = (props) => {
          const {name} = props;
          return <div>Hello {name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function Hello({ name }) {
          return <div>Hello {name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        const Hello = function({ name }) {
          return <div>Hello {name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        const Hello = ({ name }) => {
          return <div>Hello {name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            var props = {firstname: 'John'};
            return <div>Hello {props.firstname} {this.props.lastname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            this.state = { status: props.source }
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'source' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            this.state = { status: props.source.uri }
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'source' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'source.uri' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            this.state = { status: this.props.source }
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'source' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            this.state = { status: this.props.source.uri }
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'source' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'source.uri' },
        },
      ],
    },
    {
      code: `
        function HelloComponent() {
          class Hello extends React.Component {
            render() {
              return <div>Hello {this.props.name}</div>;
            }
          }
          return Hello;
        }
        module.exports = HelloComponent();
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function HelloComponent() {
          var Hello = createReactClass({
            render: function() {
              return <div>Hello {this.props.name}</div>;
            }
          });
          return Hello;
        }
        module.exports = HelloComponent();
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        class DynamicHello extends Component {
          render() {
            const {firstname} = this.props;
            class Hello extends Component {
              render() {
                const {name} = this.props;
                return <div>Hello {name}</div>;
              }
            }
            Hello = connectReduxForm({name: firstname})(Hello);
            return <Hello />;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        const Hello = (props) => {
          let team = props.names.map((name) => {
              return <li>{name}, {props.company}</li>;
            });
          return <ul>{team}</ul>;
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'names' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'names.map' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'company' },
        },
      ],
    },
    {
      code: `
        const Annotation = props => (
          <div>
            {props.text}
          </div>
        )
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
      code: `
        for (var key in foo) {
          var Hello = createReactClass({
            render: function() {
              return <div>Hello {this.props.name}</div>;
            }
          });
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        var propTypes = {
          firstname: PropTypes.string
        };
        class Test extends React.Component {
          render() {
            return (
              <div>{this.props.firstname} {this.props.lastname}</div>
            );
          }
        }
        Test.propTypes = propTypes;
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Test extends Foo.Component {
          render() {
            return (
              <div>{this.props.firstname} {this.props.lastname}</div>
            );
          }
        }
        Test.propTypes = {
          firstname: PropTypes.string
        };
      `,
      settings,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Test extends Foo.Component {
          render() {
            return (
              <div>{this.props.firstname} {this.props.lastname}</div>
            );
          }
        }
        Test.propTypes = forbidExtraProps({
          firstname: PropTypes.string
        });
      `,
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps'],
      }),
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Test extends Foo.Component {
          render() {
            return (
              <div>{this.props.firstname} {this.props.lastname}</div>
            );
          }
        }
        Test.propTypes = Object.freeze({
          firstname: PropTypes.string
        });
      `,
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['Object.freeze'],
      }),
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        /** @jsx Foo */
        class Test extends Foo.Component {
          render() {
            return (
              <div>{this.props.firstname} {this.props.lastname}</div>
            );
          }
        }
        Test.propTypes = {
          firstname: PropTypes.string
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {};
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: Object;
          };
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    },
    {
      code: `
        type Props = {name: Object;};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: {
              firstname: string;
            }
          };
          render () {
            return <div>Hello {this.props.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name.lastname' },
        },
      ],
    },
    {
      code: `
        type Props = {name: {firstname: string;};};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name.lastname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {person: {name: {firstname: string;};};};
          render () {
            return <div>Hello {this.props.person.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'person.name.lastname' },
        },
      ],
    },
    {
      code: `
        type Props = {person: {name: {firstname: string;};};};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.person.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'person.name.lastname' },
        },
      ],
    },
    {
      code: `
        type Person = {name: {firstname: string;}};
        class Hello extends React.Component {
          props: {people: Person[];};
          render () {
            var names = [];
            for (var i = 0; i < this.props.people.length; i++) {
              names.push(this.props.people[i].name.lastname);
            }
            return <div>Hello {names.join(
        )}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'people[].name.lastname' },
        },
      ],
    },
    {
      code: `
        type Person = {name: {firstname: string;}};
        type Props = {people: Person[];};
        class Hello extends React.Component {
          props: Props;
          render () {
            var names = [];
            for (var i = 0; i < this.props.people.length; i++) {
              names.push(this.props.people[i].name.lastname);
            }
            return <div>Hello {names.join(
        )}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'people[].name.lastname' },
        },
      ],
    },
    {
      code: `
        type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.result.notok}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'result.notok' },
        },
      ],
    },
    {
      code: `
        let Greetings = class extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Greetings.propTypes = {};
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        let Greetings = {
          Hello: class extends React.Component {
            render () {
              return <div>Hello {this.props.name}</div>;
            }
          }
        }
        Greetings.Hello.propTypes = {};
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        let Greetings = {};
        Greetings.Hello = class extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Greetings.Hello.propTypes = {};
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        function Greetings({names}) {
          names = names.map(({firstname, lastname}) => <div>{firstname} {lastname}</div>);
          return <Hello>{names}</Hello>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'names' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'names.map' },
        },
      ],
    },
    {
      code: `
        const MyComponent = props => (
          <div onClick={() => props.toggle()}></div>
        )
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'toggle' },
        },
      ],
    },
    {
      code: `
        const MyComponent = props => props.test ? <div /> : <span />
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'test' },
        },
      ],
    },
    {
      code: `
        const TestComponent = props =>
          <div onClick={() => props.test()} />
        const mapStateToProps = (_, props) => ({
          otherProp: props.otherProp,
        })
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'test' },
        },
      ],
    },
    {
      code: `
        type Props = {
          firstname: ?string,
        };
        function Hello({firstname, lastname}: Props): React$Element {
          return <div>Hello {firstname} {lastname}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props, context) {
            super(props, context)
            const firstname = props.firstname;
            const {lastname} = props;
            this.state = {
              firstname,
              lastname
            }
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      code: `
        function Hello(props) {
          return <div>{props.name.constructor.firstname}</div>
        }
        Hello.propTypes = {
          name: PropTypes.shape({
            firstname: PropTypes.object
          })
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name.constructor.firstname' },
        },
      ],
    },
    {
      code: `
      function Hello({ foo = '' }) {
        return <p>{foo}</p>
      }
    `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        function SomeComponent({bar}) {
          function f({foo}) {}
          return <div className={f()}>{bar}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        function SomeComponent({bar} = baz) {
          function f({foo}) {}
          return <div className={f()}>{bar}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.PureComponent {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 43,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        class Hello extends PureComponent {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
          line: 4,
          column: 43,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        type MyComponentProps = {
          a: number,
        };
        function MyComponent({ a, b }: MyComponentProps) {
          return <div />;
        }
      `,
      features: ['types'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'b' },
          line: 5,
          column: 35,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {},
          render: function() {
            return <div>{this.props.firstname}</div>;
          }
        });
      `,
      options: [{ skipUndeclared: true }],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
          line: 5,
          column: 37,
        },
      ],
    },
    {
      code: `
        var Hello = function(props) {
          return <div>{props.firstname}</div>;
        };
        Hello.propTypes = {}
      `,
      options: [{ skipUndeclared: true }],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
          line: 3,
          column: 30,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static get propTypes() {
            return {};
          }
          render() {
            return <div>{this.props.firstname}</div>;
          }
        }
      `,
      options: [{ skipUndeclared: true }],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
          line: 7,
          column: 37,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>{this.props.firstname}</div>;
          }
        }
        Hello.propTypes = {};
      `,
      options: [{ skipUndeclared: true }],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
          line: 4,
          column: 37,
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{this.props.firstname}</div>;
          }
        });
      `,
      options: [{ skipUndeclared: false }],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
          line: 4,
          column: 37,
        },
      ],
    },
    {
      code: `
        type MyComponentProps = {
          +a: number,
        };
        function MyComponent({ a, b }: MyComponentProps) {
          return <div />;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'b' },
          line: 5,
          column: 35,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        type MyComponentProps = {
          -a: number,
        };
        function MyComponent({ a, b }: MyComponentProps) {
          return <div />;
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'b' },
          line: 5,
          column: 35,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        type Props = {+name: Object;};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'firstname' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          onSelect = async ({ name }) => {
            return this.props.foo;
          }
          render() {
            return <Greeting onSelect={this.onSelect} />;
          }
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = forbidExtraProps({
            bar: PropTypes.func
          })
          componentWillReceiveProps(nextProps) {
            if (nextProps.foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
      `,
      features: ['class fields'],
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps'],
      }),
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            bar: PropTypes.func
          }
          componentWillReceiveProps(nextProps) {
            if (nextProps.foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            bar: PropTypes.func
          }
          componentWillReceiveProps(nextProps) {
            const {foo} = nextProps;
            if (foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            bar: PropTypes.func
          }
          componentWillReceiveProps({foo}) {
            if (foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          componentWillReceiveProps({foo}) {
            if (foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
        Hello.propTypes = {
            bar: PropTypes.func
          }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = forbidExtraProps({
            bar: PropTypes.func
          })
          shouldComponentUpdate(nextProps) {
            if (nextProps.foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
      `,
      features: ['class fields'],
      settings: Object.assign({}, settings, {
        propWrapperFunctions: ['forbidExtraProps'],
      }),
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          shouldComponentUpdate({foo}) {
            if (foo) {
              return;
            }
          }
          render() {
            return <div bar={this.props.bar} />;
          }
        }
        Hello.propTypes = {
            bar: PropTypes.func
          }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            return <div>Hello {this.props.lastname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
          line: 7,
          column: 43,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            return <div>Hello {this.props.lastname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
          line: 7,
          column: 43,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            const {
              lastname,
            } = this.props;
            return <div>Hello {lastname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
          line: 8,
          column: 15,
          type: 'Property',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, Person, void> {
          render () {
            const {
              lastname,
            } = this.props;
            return <div>Hello {lastname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
          line: 8,
          column: 15,
          type: 'Property',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: {firstname: string;};};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.name.lastname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name.lastname' },
          line: 5,
          column: 48,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Props = {name: {firstname: string;};};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.name.lastname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name.lastname' },
          line: 5,
          column: 48,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.result.notok}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'result.notok' },
          line: 5,
          column: 50,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Props = {result?: {ok: string | boolean;}|{ok: number | Array}};
        class Hello extends React.Component<void, Props, void> {
          render () {
            return <div>Hello {this.props.result.notok}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'result.notok' },
          line: 5,
          column: 50,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, { person: Person }, void> {
          render () {
            return <div>Hello {this.props.person.lastname}</div>;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'person.lastname' },
          line: 7,
          column: 50,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
      code: `
        type Person = {
          firstname: string
        };
        class Hello extends React.Component<void, { person: Person }, void> {
          render () {
            return <div>Hello {this.props.person.lastname}</div>;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'person.lastname' },
          line: 7,
          column: 50,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
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
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
          line: 8,
          column: 37,
          type: 'Identifier',
        },
      ],
    },
    {
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
      features: ['flow'],
      settings: { react: { flowVersion: '0.53' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
          line: 8,
          column: 37,
          type: 'Identifier',
        },
      ],
    },
    {
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
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
          line: 8,
          column: 37,
          type: 'Identifier',
        },
      ],
    },
    {
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
      features: ['flow'],
      settings: { react: { flowVersion: '0.53' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
          line: 8,
          column: 37,
          type: 'Identifier',
        },
      ],
    },
    {
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'person.lastname' },
          line: 7,
          column: 50,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
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
      settings: { react: { flowVersion: '0.53' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'person.lastname' },
          line: 7,
          column: 50,
          type: 'Identifier',
        },
      ],
      features: ['flow'],
    },
    {
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
      features: ['flow'],
    },
    (semver.satisfies(eslintPkg.version, '> 3') ? [
      {
        code: `
          function higherOrderComponent<P: { foo: string }>() {
            return class extends React.Component<P> {
              render() {
                return <div>{this.props.foo} - {this.props.bar}</div>
              }
            }
          }
        `,
        errors: [
          {
            messageId: 'missingPropType',
            data: { name: 'bar' },
          },
        ],
        features: ['flow'],
      },
      {
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
        errors: [
          {
            messageId: 'missingPropType',
            data: { name: 'bar' },
          },
        ],
        features: ['flow'],
      },
    ] : []),
    {
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
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'fooBar' },
        },
      ],
    },
    {
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
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'fooBar' },
        },
      ],
    },
    {
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'fooBar' },
        },
      ],
      features: ['flow'],
    },
    {
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'fooBar' },
        },
      ],
      features: ['flow'],
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bad' },
        },
      ],
      features: ['flow'],
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo.baz' },
        },
      ],
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          setZoo() {
            this.setState((state, {zoo}) => ({ zoo }));
          }
          render() {
            return <div />;
          }
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'zoo' },
        },
      ],
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
      settings: { react: { version: '16.3.0' } },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
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
      features: ['fragment'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'page' },
        },
      ],
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'cryptoCurrency' },
        },
      ],
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'cryptoCurrency' },
        },
      ],
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
          pragma: 'Foo',
        },
      },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'cryptoCurrency' },
        },
      ],
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
          pragma: 'Foo',
        },
      },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'cryptoCurrency' },
        },
      ],
    },
    {
      code: `
        const Label = React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
      code: `
        import React, { forwardRef } from 'react';
        const Label = forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
      code: `
        const Label = Foo.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        });
      `,
      settings: {
        react: {
          pragma: 'Foo',
        },
      },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
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
          pragma: 'Foo',
        },
      },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
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
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'usedProp' },
        },
      ],
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
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
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
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'a' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a.b' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'a.b.c' },
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
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
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'initialValues' },
        },
      ],
    },
    {
      // issue #2138
      code: `
        type UsedProps = {|
          usedProp: number,
        |};

        type UnusedProps = {|
          unusedProp: number,
        |};

        type Props = {| ...UsedProps, ...UnusedProps |};

        function MyComponent({ usedProp, notOne }: Props) {
          return <div>{usedProp}</div>;
        }
      `,
      features: ['flow'],
      errors: [
        {
          message: "'notOne' is missing in props validation",
          line: 12,
          column: 42,
        },
      ],
    },
    {
      // issue #2298
      code: `
        type Props = {|
          firstname?: string
        |};

        function Hello({ firstname = 'John', lastname = 'Doe' }: Props = {}) {
          return <div>Hello {firstname} {lastname}</div>
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'lastname' },
        },
      ],
    },
    {
      // issue #2330
      code: `
        type Props = {
          user: {
            name: {
              firstname: string,
              [string]: string
            }
          }
        };

        export function Bar(props: Props) {
          return (
            <div>
              {props.user}
              {props.user.name.firstname}
              {props.user.name.lastname}
              {props.user.age}
            </div>
          );
        }
      `,
      features: ['flow'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'user.age' },
        },
      ],
    },
    {
      code: `
        const Label = React.memo(React.forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }));
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }));
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
      code: `
        import Foo, { memo, forwardRef } from 'foo';
        const Label = memo(forwardRef(({ text }, ref) => {
          return <div ref={ref}>{text}</div>;
        }));
      `,
      settings: {
        react: {
          pragma: 'Foo',
        },
      },
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'text' },
        },
      ],
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }

        Foo.propTypes = {
          foo: PropTypes.shape({
            bar: PropTypes.arrayOf(PropTypes.string).isRequired,
          }).isRequired,
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo.baz' },
        },
      ],
    },
    {
      code: `
        const Foo = ({length, ordering}) => (
          length > 0 && (
            <Paginator items={ordering} pageSize={10} />
          )
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'length' },
        },
        {
          messageId: 'missingPropType',
          data: { name: 'ordering' },
        },
      ],
    },
    {
      code: `
        const firstType = PropTypes.shape({
          id: PropTypes.number,
        });
        class ComponentX extends React.Component {
          static propTypes = {
            first: firstType.isRequired,
          };
          render() {
            return (
              <div>
                <div>Counter = {this.props.first.name}</div>
              </div>
            );
          }
        }
      `,
      features: ['class fields'],
      errors: [{ message: "'first.name' is missing in props validation" }],
    },
    {
      code: `
        const firstType = PropTypes.shape({
          id: PropTypes.number,
        }).isRequired;
        class ComponentX extends React.Component {
          static propTypes = {
            first: firstType,
          };
          render() {
            return (
              <div>
                <div>Counter = {this.props.first.name}</div>
              </div>
            );
          }
        }
      `,
      features: ['class fields'],
      errors: [{ message: "'first.name' is missing in props validation" }],
    },
    {
      code: `
        const firstType = PropTypes.shape({
          id: PropTypes.number,
        });
        class ComponentX extends React.Component {
          static propTypes = {
            first: firstType,
          };
          render() {
            return (
              <div>
                <div>Counter = {this.props.first.name}</div>
              </div>
            );
          }
        }
      `,
      features: ['class fields'],
      errors: [{ message: "'first.name' is missing in props validation" }],
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }
        const fooType = PropTypes.shape({
          bar: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired
        Foo.propTypes = {
          foo: fooType,
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo.baz' },
        },
      ],
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }
        const fooType = PropTypes.shape({
          bar: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
        Foo.propTypes = {
          foo: fooType.isRequired,
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo.baz' },
        },
      ],
    },
    {
      code: `
        function Foo({
          foo: {
            bar: foo,
            baz
          },
        }) {
          return <p>{foo.reduce(() => 5)}</p>;
        }
        const fooType = PropTypes.shape({
          bar: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
        Foo.propTypes = {
          foo: fooType,
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo.baz' },
        },
      ],
    },
    {
      code: `
        function Component(props) {
          return 0,
          <div>
            Hello, { props.name }!
          </div>
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
    },
    {
      code: `
      const SideMenu = observer(
        ({ componentId }) => (
          <S.Container>
            <S.Head />
            <UserInfo />
            <Separator />
            <MenuList componentId={componentId} />
          </S.Container>
        ),
      );`,
      settings: {
        componentWrapperFunctions: ['observer'],
      },
      errors: [{ message: '\'componentId\' is missing in props validation' }],
    },
    {
      code: `
      const SideMenu = Mobx.observer(
        ({ id }) => (
          <S.Container>
            <S.Head />
            <UserInfo />
            <Separator />
            <MenuList componentId={id} />
          </S.Container>
        ),
      );
      `,
      settings: {
        componentWrapperFunctions: [{ property: 'observer', object: 'Mobx' }],
      },
      errors: [{ message: '\'id\' is missing in props validation' }],
    },
    {
      code: `
        interface Props {
        }
        const Hello = (props: Props) => {
          if (props.value) {
            return <div></div>;
          }
          return null;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'value' },
        },
      ],
    },
    {
      code: `
        type User = {
          user: string;
        }

        type Props = User & {
        };

        export default (props: Props) => {
          const { userId, user } = props;

          if (userId === 0) {
            return <p>userId is 0</p>;
          }

          return null;
        };
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'userId' },
        },
      ],
    },
    {
      code: `
        type User = {
        }

        type Props = User & {
          userId
        };

        export default (props: Props) => {
          const { userId, user } = props;

          if (userId === 0) {
            return <p>userId is 0</p>;
          }

          return null;
        };
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'user' },
        },
      ],
    },
    {
      code: `
        type User = {
          user: string;
        }
        type UserProps = {
        }

        type Props = User & UserProps;

        export default (props: Props) => {
          const { userId, user } = props;

          if (userId === 0) {
            return <p>userId is 0</p>;
          }

          return null;
        };
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'userId' },
        },
      ],
    },
    {
      code: `
        interface GenericProps {
          onClose: () => void
        }

        interface ImplementationProps extends GenericProps {
        }

        export const Implementation: FC<ImplementationProps> = (
          {
            onClick,
            onClose,
          }: ImplementationProps
        ) => (<div />)
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'onClick' },
        },
      ],
    },
    {
      code: `
        const mapStateToProps = state => ({
        });

        interface BooksTable extends ReturnType<typeof mapStateToProps> {
          username: string;
        }

        const App = (props: BooksTable) => {
          props.books();
          return <div><span>{props.username}</span></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'books' },
        },
      ],
    },
    {
      code: `
        const mapStateToProps = state => ({
          books: state.books,
        });

        interface BooksTable extends ReturnType<typeof mapStateToProps> {
        }

        const App = (props: BooksTable) => {
          props.books();
          return <div><span>{props.username}</span></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'username' },
        },
      ],
    },
    {
      code: `
        type Event = {
            name: string;
            type: string;
        }

        interface UserEvent extends Event {
            UserId: string;
        }
        const App = (props: UserEvent) => {
          props.name();
          props.type;
          props.UserId;
          return <div><span>{props.dateCreated}</span></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'dateCreated' },
        },
      ],
    },
    {
      code: `
        function Zoo(props) {
          return (
            <>
              {props.foo.c}
            </>
          );
        }

        Zoo.propTypes = {
          foo: PropTypes.exact({
            a: PropTypes.number,
            b: PropTypes.number,
          }),
        };
      `,
      features: ['fragment'],
      errors: [{ message: "'foo.c' is missing in props validation" }],
    },
    {
      code: `
        function Zoo(props) {
          return (
            <>
              {props.foo.c}
            </>
          );
        }

        Zoo.propTypes = {
          foo: React.PropTypes.exact({
            a: PropTypes.number,
            b: PropTypes.number,
          }),
        };
      `,
      features: ['fragment'],
      errors: [{ message: "'foo.c' is missing in props validation" }],
    },
    {
      code: `
        function Zoo(props) {
          return (
            <>
              {props.foo.c}
            </>
          );
        }

        Zoo.propTypes = {
          foo: Foo.PropTypes.exact({
            a: PropTypes.number,
            b: PropTypes.number,
          }),
        };
      `,
      settings,
      features: ['fragment'],
      errors: [{ message: "'foo.c' is missing in props validation" }],
    },
    {
      code: `
        const Foo: JSX.Element = ({ bar }) => {
          return <div>{bar}</div>;
        }
      `,
      settings,
      features: ['ts', 'no-babel'],
      errors: [{ message: "'bar' is missing in props validation" }],
    },
    {
      code: `
        const Foo: JSX.Element = function foo ({ bar }) {
          return <div>{bar}</div>;
        }
      `,
      settings,
      features: ['ts', 'no-babel'],
      errors: [{ message: "'bar' is missing in props validation" }],
    },
    // fix #2804
    {
      code: `
        import React from 'react'

        const InputField = ({ type, ...restProps }) => {

          return(
            <input
              type={type}
              {...restProps}
            />
          )
        }

        export default InputField;
      `,
      errors: [{ message: "'type' is missing in props validation" }],
    },
    {
      code: `
        const Foo: JSX.Element = ({ bar = "" }) => {
          return <div>{bar}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        function Foo({ foo = "" }): JSX.Element {
          return <div>{foo}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'foo' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
      const Foo: JSX.Element = function foo ({ bar = "" }) {
        return <div>{bar}</div>;
      }
    `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
      function Foo({ bar = "" as string }): JSX.Element {
        return <div>{bar}</div>;
      }
    `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'bar' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';
        interface PersonProps {
            test: string;
        }
        const Person: React.FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'username' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';
        interface PersonProps {
            username: string;
        }
        const Person: React.FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.test}</div>
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'test' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react';
        interface PersonProps {
            username: string;
        }
        const Person: FunctionComponent<PersonProps> = (props): React.ReactElement => (
            <div>{props.test}</div>
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'test' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface PersonProps {
            username: string;
        }
        const Person: X.FC<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'username' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        interface PersonProps {
            username: string;
        }
        const Person: FC<PersonProps> = (props): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'username' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        type PersonProps<T> = {
            x: T;
        }
        const Person = (props: PersonProps<string>): React.ReactElement => (
            <div>{props.username}</div>
        );
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'username' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { VoidFunctionComponent } from 'react'

        interface Props {
        age: number
        }
        const Hello: VoidFunctionComponent<Props> = function Hello(props) {
        const { test } = props;

        return <div>Hello {name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'test' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'

        interface Props {
        age: number
        }
        const Hello: React.VoidFunctionComponent<Props> = function Hello(props) {
        const { test } = props;

        return <div>Hello {name}</div>;
        }
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'test' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'

        type IfooProps = { e: string };
          const Foo: React.ForwardRefRenderFunction<HTMLDivElement, IfooProps> = function Foo (props, ref) {
          const { name } = props;
          return  <div ref={ref}>{name}</div>;
        };
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'name' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'
        type IfooProps = { k: string, a: number }
        const Foo= React.forwardRef<HTMLDivElement, IfooProps>((props, ref) => {
          return  <div ref={ref}>{props.l}</div>;
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'l' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React from 'react'

        type IfooProps = { e: string };
        const Foo= React.forwardRef<HTMLDivElement, IfooProps>(function Foo(props, ref) {
          const { l } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'l' },
        },
      ],
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        import React, { forwardRef } from 'react'

        type IfooProps = { e: string };
        const Foo= forwardRef<HTMLDivElement, IfooProps>(function Foo(props, ref) {
          const { l } = props;
          return  <div ref={ref}>hello</div>;
        });
      `,
      errors: [
        {
          messageId: 'missingPropType',
          data: { name: 'l' },
        },
      ],
      features: ['ts', 'no-babel'],
    }
  )),
});
