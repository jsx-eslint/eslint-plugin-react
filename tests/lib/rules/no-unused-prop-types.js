/**
 * @fileoverview Warn about unused PropType definitions in React components
 * @author Evgueni Naverniouk
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const semver = require('semver');
const eslintPkg = require('eslint/package.json');
const babelEslintVersion = require('babel-eslint/package.json').version;
const RuleTester = require('eslint').RuleTester;

require('object.entries/auto'); // for node 6, eslint 5, new TS parser, `function Hello({firstname}: Props): React$Element {` cases

const rule = require('../../../lib/rules/no-unused-prop-types');

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
ruleTester.run('no-unused-prop-types', rule, {
  valid: parsers.all([
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
      // Props validation is ignored when spread is used
      code: `
        class Hello extends React.Component {
          render() {
            var { firstname, ...props } = this.props;
            var { category, icon } = props;
            return <div>Hello {firstname}</div>;
          }
        }
        Hello.propTypes = {
          firstname: PropTypes.string,
          category: PropTypes.string,
          icon: PropTypes.bool
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
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>Hello {this.props?.name}</div>;
          }
        }
      `,
      features: ['class fields', 'optional chaining'],
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
      options: [{ skipShapeProps: false }],
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
      options: [{ skipShapeProps: false }],
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
      options: [{ skipShapeProps: false }],
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
      options: [{ skipShapeProps: false }],
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
      options: [{ skipShapeProps: false }],
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
      options: [{ skipShapeProps: false }],
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
      options: [{ skipShapeProps: false }],
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
        function Foo({ a }) {
          return <>{ a.b }</>
        }
        Foo.propTypes = {
          a: PropTypes.shape({
            b: PropType.string,
          })
        }
      `,
      options: [{ skipShapeProps: false }],
      features: ['fragment'],
    },
    {
      code: `
        function Foo({ a }) {
          const { b } = a
          return <>{ b.c }</>
        }
        Foo.propTypes = {
          a: PropTypes.shape({
            b: PropType.shape({
              c: PropTypes.string,
            }),
          })
        }
      `,
      options: [{ skipShapeProps: false }],
      features: ['fragment'],
    },
    {
      // Destructured assignment with Shape propTypes with skipShapeProps off issue #816
      code: `
        class Thing extends React.Component {
          static propTypes = {
            i18n: PropTypes.shape({
              gettext: PropTypes.func,
            }),
          }

          render() {
            const { i18n } = this.props;
            return (
              <p>{i18n.gettext('Some Text')}</p>
            );
          }
        }
      `,
      features: ['class fields'],
      options: [{ skipShapeProps: false }],
    },
    {
      code: `
        class Thing extends React.Component {
          static propTypes = {
            a: PropTypes.shape({
              b: PropTypes.string,
            }),
          }

          render() {
            const { a } = this.props;
            return (
              <p>{ a.b }</p>
            );
          }
        }
      `,
      features: ['class fields'],
      options: [{ skipShapeProps: false }],
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
      options: [{ customValidators: ['CustomValidator'], skipShapeProps: false }],
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
      options: [{ customValidators: ['CustomValidator'], skipShapeProps: false }],
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
      options: [{ customValidators: ['CustomValidator'], skipShapeProps: false }],
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
            this.state = { status: props?.source?.uri }
          }
          static propTypes = {
            source: PropTypes.object
          };
        }
      `,
      features: ['class fields', 'optional chaining'],
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
      // Should not be detected as a component
      code: `
        HelloJohn.prototype.render = function() {
          return React.createElement(Hello, {
            name: this.props?.firstname
          });
        };
      `,
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
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
          class Hello extends React.Component {
            render() {
              return <div>Hello {this.props?.name}</div>;
            }
          }
          Hello.propTypes = { name: PropTypes.string };
          return Hello;
        }
        module.exports = HelloComponent();
      `,
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
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
        function HelloComponent() {
          var Hello = createReactClass({
            propTypes: { name: PropTypes.string },
            render: function() {
              return <div>Hello {this.props?.name}</div>;
            }
          });
          return Hello;
        }
        module.exports = HelloComponent();
      `,
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
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
        const Hello = (props) => {
          let team = props?.names.map((name) => {
              return <li>{name}, {props?.company}</li>;
            });
          return <ul>{team}</ul>;
        };
        Hello.propTypes = {
          names: PropTypes.array,
          company: PropTypes.string
        };
      `,
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
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
      // Reassigned props are ignored
      code: `
        export class Hello extends Component {
          render() {
            const props = this.props;
            return <div>Hello {props.name.firstname} {props['name'].lastname}</div>
          }
        }
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
      features: ['types'],
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
      features: ['types'],
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
      features: ['types'],
    },
    {
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
      features: ['types'],
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
      features: ['types'],
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
      features: ['types'],
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
            return <div>Hello {names.join(', ')}</div>;
          }
        }
      `,
      features: ['types'],
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
            return <div>Hello {names.join(', ')}</div>;
          }
        }
      `,
      features: ['types'],
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
            return <div>Hello {names.join(', ')}</div>;
          }
        }
      `,
      features: ['types'],
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
      features: ['types'],
    },
    {
      code: `
        type Props = {notTarget: string};
        class Hello extends React.Component {
          props: Props;
          onEvent({ target }: { target: Object }) {};
          render () {
            return <div>Hello {this.props.notTarget}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
      code: `
        type Props = {notTarget: string};
        class Hello extends React.Component {
          props: Props;
          onEvent(infos: { target: Object }) {};
          render () {
            return <div>Hello {this.props.notTarget}</div>;
          }
        }
      `,
      features: ['types'],
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
      features: ['types'],
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
      features: ['types'],
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
      features: ['no-default'],
    },
    {
      // Destructured shape props are skipped by default
      code: `
        class Hello extends Component {
          static propTypes = {
            params: PropTypes.shape({
              id: PropTypes.string
            })
           }
          render () {
            const {params} = this.props
            const id = (params || {}).id;
            return <span>{id}</span>
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured props in componentWillReceiveProps shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured props in componentWillReceiveProps shouldn't throw errors
      code: `
        class Hello extends Component {
          componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured props in componentWillReceiveProps shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        })
      `,
    },
    {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentWillReceiveProps ({something}) {
            doSomething(something);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors
      code: `
        class Hello extends Component {
          componentWillReceiveProps ({something}) {
            doSomething(something);
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured function props in componentWillReceiveProps shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentWillReceiveProps ({something}) {
            doSomething(something);
          }
        })
      `,
    },
    {
      // Destructured props in the constructor shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          constructor (props) {
            super(props);
            const {something} = props;
            doSomething(something);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured props in the constructor shouldn't throw errors
      code: `
        class Hello extends Component {
          constructor (props) {
            super(props);
            const {something} = props;
            doSomething(something);
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured function props in the constructor shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          constructor ({something}) {
            super({something});
            doSomething(something);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured function props in the constructor shouldn't throw errors
      code: `
        class Hello extends Component {
          constructor ({something}) {
            super({something});
            doSomething(something);
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      code: `
        // Destructured props in the \`shouldComponentUpdate\` method shouldn’t throw errors
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          shouldComponentUpdate(nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        // Destructured props in the \`shouldComponentUpdate\` method shouldn’t throw errors
        class Hello extends Component {
          shouldComponentUpdate(nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      code: `
        // Destructured props in \`shouldComponentUpdate\` shouldn’t throw errors when used with createReactClass
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          shouldComponentUpdate(nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        })
      `,
    },
    {
      // Destructured props in `shouldComponentUpdate` shouldn't throw errors when used createReactClass, with default parser
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          shouldComponentUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        })
      `,
    },
    {
      // Destructured function props in the `shouldComponentUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          shouldComponentUpdate ({something}, nextState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured function props in the `shouldComponentUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          shouldComponentUpdate ({something}, nextState) {
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured function props in `shouldComponentUpdate` shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          shouldComponentUpdate ({something}, nextState) {
            return something;
          }
        })
      `,
    },
    {
      // Destructured props in the `componentWillUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured props in the `componentWillUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured props in `componentWillUpdate` shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        })
      `,
    },
    {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentWillUpdate ({something}, nextState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          componentWillUpdate ({something}, nextState) {
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured function props in the `componentWillUpdate` method shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentWillUpdate ({something}, nextState) {
            return something;
          }
        })
      `,
    },
    {
      // Destructured props in the `componentDidUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentDidUpdate (prevProps, prevState) {
            const {something} = prevProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured props in the `componentDidUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          componentDidUpdate (prevProps, prevState) {
            const {something} = prevProps;
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured props in `componentDidUpdate` shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentDidUpdate (prevProps, prevState) {
            const {something} = prevProps;
            return something;
          }
        })
      `,
    },
    {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentDidUpdate ({something}, prevState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          componentDidUpdate ({something}, prevState) {
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured function props in the `componentDidUpdate` method shouldn't throw errors when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentDidUpdate ({something}, prevState) {
            return something;
          }
        })
      `,
    },
    {
      // Destructured state props in `componentDidUpdate` [Issue #825]
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentDidUpdate ({something}, {state1, state2}) {
            return something;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured state props in `componentDidUpdate` [Issue #825]
      code: `
        class Hello extends Component {
          componentDidUpdate ({something}, {state1, state2}) {
            return something;
          }
        }
        Hello.propTypes = {
          something: PropTypes.bool,
        };
      `,
    },
    {
      // Destructured state props in `componentDidUpdate` [Issue #825] when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentDidUpdate ({something}, {state1, state2}) {
            return something;
          }
        })
      `,
    },
    {
      // Destructured state props in `componentDidUpdate` without custom parser [Issue #825]
      code: `
        var Hello = React.Component({
          propTypes: {
            something: PropTypes.bool
          },
          componentDidUpdate: function ({something}, {state1, state2}) {
            return something;
          }
        });
      `,
    },
    {
      // Destructured state props in `componentDidUpdate` without custom parser [Issue #825] when used createReactClass
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool,
          },
          componentDidUpdate: function ({something}, {state1, state2}) {
            return something;
          }
        })
      `,
    },
    {
      // Destructured props in a stateless function
      code: `
        const Hello = (props) => {
          const {...rest} = props;
          return <div />;
        };
      `,
    },
    {
      // Nested destructuring; issue 2424
      code: `
        function SomeComponent(props) {
          const {aaa: {bbb}} = props;
          return <p>{bbb}</p>;
        }

        SomeComponent.propTypes = {
          aaa: somePropType,
        };
      `,
    },
    {
      // `no-unused-prop-types` in jsx expressions - [Issue #885]
      code: `
        const PagingBlock = function(props) {
          return (
            <span>
              <a onClick={() => props.previousPage()}/>
              <a onClick={() => props.nextPage()}/>
            </span>
         );
        };

        PagingBlock.propTypes = {
          nextPage: PropTypes.func.isRequired,
          previousPage: PropTypes.func.isRequired,
        };
      `,
    },
    {
      // `no-unused-prop-types` rest param props in jsx expressions - [Issue #885]
      code: `
        const PagingBlock = function(props) {
          return (
            <SomeChild {...props} />
         );
        };

        PagingBlock.propTypes = {
          nextPage: PropTypes.func.isRequired,
          previousPage: PropTypes.func.isRequired,
        };
      `,
    },
    {
      // issue 2350
      code: `
        function Foo(props) {
          useEffect(() => {
            const { a } = props;
            document.title = a;
          });

          return <p/>;
        }

        Foo.propTypes = {
          a: PropTypes.string,
        }
      `,
    },
    {
      code: `
        class Hello extends Component {
          componentWillReceiveProps (nextProps) {
            if (nextProps.foo) {
              doSomething(this.props.bar);
            }
          }
        }

        Hello.propTypes = {
          foo: PropTypes.bool,
          bar: PropTypes.bool
        };
      `,
    },
    {
      // The next two test cases are related to: https://github.com/yannickcr/eslint-plugin-react/issues/1183
      code: `
        export default function SomeComponent(props) {
            const callback = () => {
                props.a(props.b);
            };

            const anotherCallback = () => {};

            return (
                <SomeOtherComponent
                    name={props.c}
                    callback={callback}
                />
            );
        }

        SomeComponent.propTypes = {
            a: React.PropTypes.func.isRequired,
            b: React.PropTypes.string.isRequired,
            c: React.PropTypes.string.isRequired,
        };
      `,
    },
    {
      code: `
        export default function SomeComponent(props) {
            const callback = () => {
                props.a(props.b);
            };

            return (
                <SomeOtherComponent
                    name={props.c}
                    callback={callback}
                />
            );
        }

        SomeComponent.propTypes = {
            a: React.PropTypes.func.isRequired,
            b: React.PropTypes.string.isRequired,
            c: React.PropTypes.string.isRequired,
        };
      `,
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          shouldComponentUpdate (props) {
            if (props.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class HelloFooBar extends Component {
          shouldComponentUpdate(props) {
            if (props.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
        HelloFooBar.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          componentWillUpdate (props) {
            if (props.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Component {
          componentWillUpdate (props) {
            if (props.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          componentWillReceiveProps (nextProps) {
            const {foo} = nextProps;
            if (foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Props used inside of an async class property
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
          }
          classProperty = async () => {
            await this.props.foo();
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      // Multiple props used inside of an async class property
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          classProperty = async () => {
            await this.props.foo();
            await this.props.bar();
            await this.props.baz();
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      code: `
        class Hello extends Component {
          componentWillReceiveProps (props) {
            if (props.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          shouldComponentUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured props inside of async class property
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
          }
          classProperty = async () => {
            const { foo } = this.props;
            await foo();
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      // Multiple destructured props inside of async class property
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          classProperty = async () => {
            const { foo, bar, baz } = this.props;
            await foo();
            await bar();
            await baz();
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      code: `
        class Hello extends Component {
          shouldComponentUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          componentWillUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Props used inside of an async class method
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
          }
          async method() {
            await this.props.foo();
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Multiple props used inside of an async class method
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          async method() {
            await this.props.foo();
            await this.props.bar();
            await this.props.baz();
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Destrucuted props inside of async class method
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
          }
          async method() {
            const { foo } = this.props;
            await foo();
          };
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Component {
          componentWillUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          componentDidUpdate (prevProps) {
            if (prevProps.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Multiple destructured props inside of async class method
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          async method() {
            const { foo, bar, baz } = this.props;
            await foo();
            await bar();
            await baz();
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // factory functions that return async functions
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          factory() {
            return async () => {
              await this.props.foo();
              await this.props.bar();
              await this.props.baz();
            };
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // factory functions that return async functions
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          factory() {
            return async function onSubmit() {
              await this.props.foo();
              await this.props.bar();
              await this.props.baz();
            };
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends Component {
          componentDidUpdate (prevProps) {
            if (prevProps.foo) {
              return true;
            }
          }

          render() {
            return (<div>{this.props.bar}</div>);
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
    },
    {
      // Multiple props used inside of an async method
      code: `
        class Example extends Component {
          async method() {
            await this.props.foo();
            await this.props.bar();
          };
        }
        Example.propTypes = {
          foo: PropTypes.func,
          bar: PropTypes.func,
        }
      `,
      parserOptions: Object.assign({}, parserOptions, { ecmaVersion: 2017 }),
    },
    {
      // Multiple props used inside of an async function
      code: `
        class Example extends Component {
          render() {
            async function onSubmit() {
              await this.props.foo();
              await this.props.bar();
            }
            return <Form onSubmit={onSubmit} />
          };
        }
        Example.propTypes = {
          foo: PropTypes.func,
          bar: PropTypes.func,
        }
      `,
      parserOptions: Object.assign({}, parserOptions, { ecmaVersion: 2017 }),
    },
    {
      // Multiple props used inside of an async arrow function
      code: `
        class Example extends Component {
          render() {
            const onSubmit = async () => {
              await this.props.foo();
              await this.props.bar();
            }
            return <Form onSubmit={onSubmit} />
          };
        }
        Example.propTypes = {
          foo: PropTypes.func,
          bar: PropTypes.func,
        }
      `,
      parserOptions: Object.assign({}, parserOptions, { ecmaVersion: 2017 }),
    },
    {
      // Destructured assignment with Shape propTypes issue #816
      code: `
        export default class NavigationButton extends React.Component {
         static propTypes = {
           route: PropTypes.shape({
            getBarTintColor: PropTypes.func.isRequired,
          }).isRequired,
         };

         renderTitle() {
          const { route } = this.props;
           return <Title tintColor={route.getBarTintColor()}>TITLE</Title>;
         }
        }
      `,
      features: ['class fields'],
    },
    {
      // Destructured assignment without Shape propTypes issue #816
      code: `
        const Component = ({ children: aNode }) => (
         <div>{aNode}</div>
        );

        Component.defaultProps = {
         children: null,
        };

        Component.propTypes = {
         children: React.PropTypes.node,
        };
      `,
    },
    {
      // issue 1309
      code: `
        const Thing = (props) => (
            <div>
              {(() => {
                    if(props.enabled && props.test){
                        return (
                            <span>Enabled!</span>
                        )
                    }
                    return (
                        <span>Disabled..</span>
                    )
                })()}
            </div>
        );

        Thing.propTypes = {
            enabled: React.PropTypes.bool,
            test: React.PropTypes.bool
        };
      `,
    },
    {
      // issue 1107
      code: `
        const Test = props => <div>
          {someArray.map(l => <div
            key={l}>
              {props.property + props.property2}
            </div>)}
        </div>

        Test.propTypes = {
          property: React.propTypes.string.isRequired,
          property2: React.propTypes.string.isRequired
        }
      `,
    },
    {
      // issue 811
      code: `
        const Button = React.createClass({
        displayName: "Button",

        propTypes: {
            name: React.PropTypes.string.isRequired,
            isEnabled: React.PropTypes.bool.isRequired
        },

        render() {
            const item = this.props;
            const disabled = !this.props.isEnabled;
            return (
                <div>
                    <button type="button" disabled={disabled}>{item.name}</button>
                </div>
            );
        }
        });
      `,
    },
    {
      // issue 811
      code: `
        class Foo extends React.Component {
         static propTypes = {
         foo: PropTypes.func.isRequired,
        }

        constructor(props) {
          super(props);

          const { foo } = props;
          this.message = foo("blablabla");
        }

        render() {
          return <div>{this.message}</div>;
        }
        }
      `,
      features: ['class fields'],
    },
    {
      // issue #1097
      code: `
        class HelloGraphQL extends Component {
          render() {
              return <div>Hello</div>;
          }
        }

        const HellowQueries = graphql(queryDetails, {
          options: ownProps => ({
          variables: ownProps.aProp
          }),
        })(HelloGraphQL)

        HellowQueries.propTypes = {
          aProp: PropTypes.string.isRequired
        }

        export default connect(mapStateToProps, mapDispatchToProps)(HellowQueries)
      `,
    },
    {
      // issue #1335
      code: `
        type Props = {
         foo: {
          bar: boolean
         }
        };

        class DigitalServices extends React.Component {
         props: Props
         render() {
           const { foo } = this.props;
           return <div>{foo.bar}</div>;
         }
        }
      `,
      features: ['types'],
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
            const {foo: {bar}} = this.props;
            return <div>{bar}</div>;
          }
        }
        Hello.propTypes = {
          foo: PropTypes.shape({
            bar: PropTypes.string,
          })
        };
      `,
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #933
      code: `
        type Props = {
         onMouseOver: Function,
         onClick: Function,
        };

        const MyComponent = (props: Props) => (
        <div>
          <button onMouseOver={() => props.onMouseOver()} />
          <button onClick={() => props.onClick()} />
        </div>
        );
      `,
      features: ['types'],
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #1506
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState((prevState, props) => {
              props.doSomething();
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
        var tempVar2;
      `,
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #1506
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState((prevState, { doSomething }) => {
              doSomething();
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
      `,
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #1506
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState((prevState, obj) => {
              obj.doSomething();
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
        var tempVar2;
      `,
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #1506
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState(() => {
              this.props.doSomething();
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
        var tempVar;
      `,
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #1542
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState((prevState) => {
              this.props.doSomething();
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
      `,
      options: [{ skipShapeProps: false }],
    },
    {
      // issue #1542
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState(({ something }) => {
              this.props.doSomething();
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
      `,
      options: [{ skipShapeProps: false }],
    },
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
    },
    {
      code: `
        type Props = $ReadOnly<{foo: number}>;
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      features: ['types'],
    },
    {
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
      features: ['flow'],
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
      features: ['types'],
    },
    {
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
      features: ['types'],
    },
    {
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
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
    },
    {
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
      features: ['types'],
    },
    {
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
      settings: { react: { flowVersion: '0.53' } },
      features: ['flow'],
    },
    {
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
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
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
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
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
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { other: () => {} };
      `,
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { other() {} };
      `,
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { other: function () {} };
      `,
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>{ this.props.other }</div>
          }
        }
        MyComponent.propTypes = { * other() {} };
      `,
    },
    {
      // Sanity test coverage for new UNSAFE_componentWillReceiveProps lifecycles
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        }
      `,
      settings: { react: { version: '16.3.0' } },
      features: ['class fields'],
    },
    {
      // Destructured props in the `UNSAFE_componentWillUpdate` method shouldn't throw errors
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      settings: { react: { version: '16.3.0' } },
      features: ['class fields'],
    },
    {
      // Simple test of new static getDerivedStateFromProps lifecycle
      code: `
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
      `,
      settings: { react: { version: '16.3.0' } },
      features: ['class fields'],
    },
    {
      // Simple test of new static getSnapshotBeforeUpdate lifecycle
      code: `
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
      `,
      settings: { react: { version: '16.3.0' } },
      features: ['class fields'],
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
      features: ['class fields', 'types'],
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
        import BasePerson from './types'
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.person.firstname}</div>;
          }
        }
        Hello.propTypes = {
          person: ProTypes.shape({
            ...BasePerson,
            lastname: PropTypes.string
          })
        };
      `,
    },
    {
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
      features: ['class fields', 'types'],
    },
    {
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
      features: ['types'],
    },
    {
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
      features: ['types'],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>{this.props.used}</div>;
          }
        }
        Hello.propTypes = {
          used: PropTypes.string,
          foo: PropTypes.string
        };
      `,
      options: [{ ignore: ['foo'] }],
    },
    {
      code: `
        type Props = {
          used: string,
          foo: string,
        }
        class Hello extends React.Component<Props> {
          render() {
            return <div>{this.props.used}</div>;
          }
        }
      `,
      features: ['types'],
      options: [{ ignore: ['foo'] }],
    },
    {
      code: `
        export default class Foo extends React.Component {
          render() {
            return null;
          }
        }

        Foo.defaultProps = Object.assign({});
      `,
    },
    {
      code: `
        const Hello = ({a}) => (
          <div>
            {a.map(({b}) => (
              <div>{b}</div>
            ))}
          </div>
        );
        Hello.propTypes = {
          a: PropTypes.arrayOf(
            PropTypes.exact({
              b: PropTypes.string,
            })
          ),
        };
      `,
    },
    {
      code: `
        const Foo = (props) => {
          const { foo } = props as unknown;
          (props as unknown).bar as unknown;

          return <></>;
        };

        Foo.propTypes = {
          foo,
          bar,
        };
      `,
      features: ['ts', 'fragment', 'no-babel'],
    },
    {
      code: `
        class Foo extends React.Component {
          static propTypes = {
            prevProp,
            nextProp,
            setStateProp,
            thisPropsAliasDestructProp,
            thisPropsAliasProp,
            thisDestructPropsAliasDestructProp,
            thisDestructPropsAliasProp,
            thisDestructPropsDestructProp,
            thisPropsDestructProp,
            thisPropsProp,
          };

          componentDidUpdate(prevProps) {
            (prevProps as unknown).prevProp as unknown;
          }

          shouldComponentUpdate(nextProps) {
            (nextProps as unknown).nextProp as unknown;
          }

          stateProps() {
            ((this as unknown).setState as unknown)((_, props) => (props as unknown).setStateProp as unknown);
          }

          thisPropsAlias() {
            const props = (this as unknown).props as unknown;

            const { thisPropsAliasDestructProp } = props as unknown;
            (props as unknown).thisPropsAliasProp as unknown;
          }

          thisDestructPropsAlias() {
            const { props } = this as unknown;

            const { thisDestructPropsAliasDestructProp } = props as unknown;
            (props as unknown).thisDestructPropsAliasProp as unknown;
          }

          render() {
            const { props: { thisDestructPropsDestructProp } } = this as unknown;
            const { thisPropsDestructProp } = (this as unknown).props as unknown;
            ((this as unknown).props as unknown).thisPropsProp as unknown;

            return null;
          }
        }
      `,
      features: ['ts', 'class fields', 'no-babel'],
    },
    {
      code: `
        declare class Thing {
          constructor({ id }: { id: string });
        }
        export default Thing;
      `,
      features: ['ts', 'no-babel'],
    },
    // this test checks that there is no crash if no declaration is found (TSTypeLiteral).
    {
      code: `
        const Hello = (props: {firstname: string, lastname: string}) => {
            return <div {...props}></div>;
        }
      `,
      features: ['types'],
    },
    // this test checks that there is no crash if no declaration is found (TSTypeReference).
    {
      code: `
        const Hello = (props: UnfoundProps) => {
            return <div {...props}></div>;
        }
      `,
      features: ['types'],
    },
    {
      // Omit, etc, cannot be handled, but must not trigger an error
      code: `
        const Hello = (props: Omit<{a: string, b: string, c: string}, "a">) => {
            return <div>{props.b}</div>;
        }
      `,
      features: ['types'],
    },
    {
      // neither TSTypeReference or TSTypeLiteral, we do nothing. Weird case
      code: `
        const Hello = (props: () => any) => {
            return <div>{props.firstname}</div>;
        }
      `,
      features: ['types'],
    },
    {
      // neither TSTypeReference or TSTypeLiteral, we do nothing. Weird case
      code: `
        const Hello = (props: () => any) => {
            return <div>{props?.firstname}</div>;
        }
      `,
      features: ['types', 'optional chaining'],
    },
    {
      code: `
        interface Props {
          'aria-label': string;
        }
        export default function Component({
          'aria-label': ariaLabel,
        }: Props): JSX.Element {
          return <div aria-label={ariaLabel} />;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        interface Props {
          ['aria-label']: string;
        }
        export default function Component({
          ['aria-label']: ariaLabel,
        }: Props): JSX.Element {
          return <div aria-label={ariaLabel} />;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        interface Props {
          [1234]: string;
        }
        export default function Component(
          props
        : Props): JSX.Element {
          return <div aria-label={props[1234]} />;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        interface Props {
          ['1234']: string;
        }
        export default function Component(
          props
        : Props): JSX.Element {
          return <div aria-label={props[1234]} />;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        interface Props {
          [1234]: string;
        }
        export default function Component(
          props
        : Props): JSX.Element {
          return <div aria-label={props['1234']} />;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        interface Props {
          [1234]: string;
        }
        export default function Component(
          props
        : Props): JSX.Element {
        const handleVerifySubmit = ({
          otp,
          }) => {
          dispatch(
            verifyOTPPhone({
              otp,
            }),
          );
        };
        return <div aria-label={props['1234']} />;
        }
      `,
      features: ['types'],
    },
    {
      code: `
        interface Props {
          foo: string;
        }
        const Component = (props: Props) => (
          <div>{(()=> {return props.foo})()}</div>
        )
        export default Component
      `,
      features: ['types'],
    },
    {
      code: `
        type User = {
          user: string;
        }

        type Props = User;

        export default (props: Props) => {
          return <div><span>{props.user}</span></div>;
        };
      `,
      features: ['types'],
    },
    {
      code: `
        type User = {
          user: string;
        }

        type Props = User & UserProps;

        export default (props: Props) => {
          return <div><span>{props.user}</span></div>;
        };
      `,
      features: ['types'],
    },
    {
      code: `
        interface Person {
          firstname: string
          lastname?: never
        };

        const Hello = ({firstname}: Person) => {
          return <div><span>{firstname}</span></div>;
        };
      `,
      features: ['ts', 'no-babel'],
    },
    {
      code: `
        class App extends Component {
          static propTypes = {
            notifications: PropTypes.array.isRequired
          };
          customizeNotifications() {
            const props = this.props;
            return props.notifications.map((notification) => notification);
          }
          render() {
            const notifications = this.customizeNotifications();
            return (
              <View>
                {notifications.map((notification) => <Text>{notification}</Text>)}
              </View>
            );
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        const Home = () => {
          const renderStaticList = ({
              item,
          }: {
              item: IContent;
          }) => (
              <Section
                  icon={<FlashImage />}
                  title={item.title}
                  titleFontSize={theme.typography.FONT_SIZE_24}
              >
                  <StaticFlatList
                      data={item.pointsOfSale}
                      renderItem={renderStaticItem}
                      keyExtractor={staticItemKeyExtractor}
                  />
              </Section>
          );

          return (
              <SafeAreaViewWrapper>
                  <LightStatusBar />
                  <HomeFlatList
                      ListHeaderComponent={listHeaderComponent}
                      data={home?.static}
                      renderItem={renderStaticList}
                      keyExtractor={staticListKeyExtractor}
                  />
              </SafeAreaViewWrapper>
          );
        };
      `,
      features: ['types'],
    },
    {
      code: `
        const Home = () => {
          const renderStaticList = function({
              item,
          }: {
              item: IContent;
          }) {
            return (
              <Section
                  icon={<FlashImage />}
                  title={item.title}
                  titleFontSize={theme.typography.FONT_SIZE_24}
              >
                  <StaticFlatList
                      data={item.pointsOfSale}
                      renderItem={renderStaticItem}
                      keyExtractor={staticItemKeyExtractor}
                  />
              </Section>
            )
          };

          return (
              <SafeAreaViewWrapper>
                  <LightStatusBar />
                  <HomeFlatList
                      ListHeaderComponent={listHeaderComponent}
                      data={home?.static}
                      renderItem={renderStaticList}
                      keyExtractor={staticListKeyExtractor}
                  />
              </SafeAreaViewWrapper>
          );
        };
      `,
      features: ['types'],
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
        type DispatchProps = ReturnType<typeof mapDispatchToProps>
      `,
      features: semver.satisfies(babelEslintVersion, '> 8') ? ['types'] : ['ts', 'no-babel'],
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
          ...bindActionCreators(
            { prop1: importedAction, prop2: anotherImportedAction },
            dispatch,
          ),
        })

        const mapStateToProps = (state: State) => ({
          prop3: Selector.value(state),
        })

        type StateProps = ReturnType<typeof mapStateToProps>
        type DispatchProps = ReturnType<typeof mapDispatchToProps>
      `,
      features: [semver.satisfies(babelEslintVersion, '> 8') ? 'types' : 'flow'],
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
          bindActionCreators(
            { prop1: importedAction, prop2: anotherImportedAction },
            dispatch,
          )

        const mapStateToProps = (state: State) => ({
          prop3: Selector.value(state),
        })

        type StateProps = ReturnType<typeof mapStateToProps>
        type DispatchProps = ReturnType<typeof mapDispatchToProps>
      `,
      features: [semver.satisfies(babelEslintVersion, '> 8') ? 'types' : 'flow'],
    },
    {
      code: `
        import React from "react";

        interface Props {
          name: string;
        }

        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };

        export default MyComponent;
      `,
      features: ['types'],
    },
  ]),

  invalid: parsers.all([].concat(
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            unused: PropTypes.string
          },
          render: function() {
            return React.createElement("div", {}, this.props.value);
          }
        });
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            name: PropTypes.string
          },
          render: function() {
            return <div>Hello {this.props.value}</div>;
          }
        });
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'name' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {
            name: PropTypes.string
          }
          render() {
            return <div>Hello {this.props.value}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'name' },
          line: 4,
          column: 13,
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
          unused: PropTypes.string
        };
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.propTypes = {
          unused: PropTypes.string
        };
        class HelloBis extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            unused: PropTypes.string.isRequired,
            anotherunused: PropTypes.string.isRequired
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
        { message: '\'unused\' PropType is defined but prop is never used' },
        { message: '\'anotherunused\' PropType is defined but prop is never used' },
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
          unused: PropTypes.string
        };
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.z
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.shape({
            b: PropTypes.string
          })
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [{ message: '\'a.b\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            this.props.a.b.z;
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          a: PropTypes.shape({
            b: PropTypes.shape({
              c: PropTypes.string
            })
          })
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [{ message: '\'a.b.c\' PropType is defined but prop is never used' }],
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
              unused: PropTypes.string
            })
          )
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'a.*.unused\' PropType is defined but prop is never used' },
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
              unused: PropTypes.string
            })
          )
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'a.*.unused\' PropType is defined but prop is never used' },
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
              unused: PropTypes.number,
              anotherunused: PropTypes.array
            })
          ])
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'a.unused\' PropType is defined but prop is never used' },
        { message: '\'a.anotherunused\' PropType is defined but prop is never used' },
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
          "some.unused": PropTypes.string
        };
      `,
      errors: [
        { message: '\'some.unused\' PropType is defined but prop is never used' },
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
            PropTypes.shape({
              "some.unused": PropTypes.string
        })
          )
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'arr.*.some.unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {
            unused: PropTypes.string
          }
          render() {
            var text;
            text = 'Hello ';
            let {props: {firstname}} = this;
            return <div>{text} {firstname}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
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
          unused: PropTypes.string
        }
      `,
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        var Hello = function(props) {
          return <div>Hello {props.name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        var Hello = (props) => {
          return <div>Hello {props.name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        var Hello = (props) => {
          const {name} = props;
          return <div>Hello {name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        function Hello({ name }) {
          return <div>Hello {name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const Hello = function({ name }) {
          return <div>Hello {name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const Hello = ({ name }) => {
          return <div>Hello {name}</div>;
        }
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {unused: PropTypes.string}
          render() {
            var props = {firstname: 'John'};
            return <div>Hello {props.firstname} {this.props.lastname}</div>;
          }
        }
      `,
      features: ['class fields'],
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {unused: PropTypes.string}
          constructor(props, context) {
            super(props, context)
            this.state = { status: props.source }
          }
        }
      `,
      features: ['class fields'],
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          static propTypes = {unused: PropTypes.string}
          constructor(props, context) {
            super(props, context)
            this.state = { status: props.source.uri }
          }
        }
      `,
      features: ['class fields'],
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        function HelloComponent() {
          var Hello = createReactClass({
            propTypes: {unused: PropTypes.string},
            render: function() {
              return <div>Hello {this.props.name}</div>;
            }
          });
          return Hello;
        }
        module.exports = HelloComponent();
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const Hello = (props) => {
          let team = props.names.map((name) => {
              return <li>{name}, {props.company}</li>;
            });
          return <ul>{team}</ul>;
        };
        Hello.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const Annotation = props => (
          <div>
            {props.text}
          </div>
        )
        Annotation.prototype.propTypes = {unused: PropTypes.string};
      `,
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        for (var key in foo) {
          var Hello = createReactClass({
            propTypes: {unused: PropTypes.string},
            render: function() {
              return <div>Hello {this.props.name}</div>;
            }
          });
        }
      `,
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        var propTypes = {
          unused: PropTypes.string
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
        { message: '\'unused\' PropType is defined but prop is never used' },
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
          unused: PropTypes.string
        };
      `,
      settings,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
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
          unused: PropTypes.string
        };
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            unused: string
          };
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    semver.satisfies(babelEslintVersion, '< 9') ? [
      {
        code: `
          class Hello extends React.Component {
            props: {
              unused: Object;
            };
            render () {
              return <div>Hello {this.props.firstname}</div>;
            }
          }
        `,
        features: ['flow'],
        errors: [
          { message: '\'unused\' PropType is defined but prop is never used' },
        ],
      },
    ] : [],
    {
      code: `
        type Props = {unused: Object;};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Props = $ReadOnly<{unused: Object;}>;
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
      `,
      features: ['flow'],
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
      ],
    },
    {
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
      features: ['types'],
      errors: [
        { message: '\'b\' PropType is defined but prop is never used' },
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
            return <div>{this.props.foo} - {this.props.bar}</div>
          }
        }
      `,
      features: ['types'],
      errors: [
        { message: '\'zap\' PropType is defined but prop is never used' },
      ],
    },
    {
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
        { message: '\'zap\' PropType is defined but prop is never used' },
      ],
      features: ['types'],
    },
    {
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
        { message: '\'zap\' PropType is defined but prop is never used' },
      ],
      features: ['types'],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {
            name: {
              unused: string;
            }
          };
          render () {
            return <div>Hello {this.props.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'name.unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Props = {name: {unused: string;};};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'name.unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          props: {person: {name: {unused: string;};};};
          render () {
            return <div>Hello {this.props.person.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'person.name.unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Props = {person: {name: {unused: string;};};};
        class Hello extends React.Component {
          props: Props;
          render () {
            return <div>Hello {this.props.person.name.lastname}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'person.name.unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {name: {unused: string;}};
        class Hello extends React.Component {
          props: {people: Person[];};
          render () {
            var names = [];
            for (var i = 0; i < this.props.people.length; i++) {
              names.push(this.props.people[i].name.lastname);
            }
            return <div>Hello {names.join(', ')}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'people.*.name.unused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {name: {unused: string;}};
        type Props = {people: Person[];};
        class Hello extends React.Component {
          props: Props;
          render () {
            var names = [];
            for (var i = 0; i < this.props.people.length; i++) {
              names.push(this.props.people[i].name.lastname);
            }
            return <div>Hello {names.join(', ')}</div>;
          }
        }
      `,
      features: ['flow'],
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'people.*.name.unused\' PropType is defined but prop is never used' },
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
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'result.ok\' PropType is defined but prop is never used' },
        { message: '\'result.ok\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        function Greetings({names}) {
          names = names.map(({firstname, lastname}) => <div>{firstname} {lastname}</div>);
          return <Hello>{names}</Hello>;
        }
        Greetings.propTypes = {unused: Object};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const MyComponent = props => (
          <div onClick={() => props.toggle()}></div>
        )
        MyComponent.propTypes = {unused: Object};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const MyComponent = props => props.test ? <div /> : <span />
        MyComponent.propTypes = {unused: Object};
      `,
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        type Props = {
          unused: ?string,
        };
        function Hello({firstname, lastname}: Props): React$Element {
          return <div>Hello {firstname} {lastname}</div>;
        }
      `,
      features: ['types'],
      errors: [{ message: '\'unused\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          constructor (props) {
            super(props);
            const {something} = props;
            doSomething(something);
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          constructor ({something}) {
            super({something});
            doSomething(something);
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          componentWillReceiveProps (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          componentWillReceiveProps ({something}, nextState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          shouldComponentUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          shouldComponentUpdate ({something}, nextState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          componentWillUpdate ({something}, nextState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          componentDidUpdate (prevProps, prevState) {
            const {something} = prevProps;
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            unused: PropTypes.bool
          }
          componentDidUpdate ({something}, prevState) {
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'unused' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          }
          componentDidUpdate (prevProps, {state1, state2}) {
            return something;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'something' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            something: PropTypes.bool
          },
          componentDidUpdate: function (prevProps, {state1, state2}) {
            return something;
          }
        })
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'something' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          componentWillUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      // Multiple props used inside of an async class property
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          classProperty = async () => {
            await this.props.foo();
            await this.props.bar();
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'baz' },
          line: 6,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          componentWillUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 11,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          shouldComponentUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      // Multiple destructured props inside of async class property
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          classProperty = async () => {
            const { bar, baz } = this.props;
            await bar();
            await baz();
          };
        }
      `,
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [{ message: '\'foo\' PropType is defined but prop is never used' }],
    },
    {
      // Multiple props used inside of an async class method
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          async method() {
            await this.props.foo();
            await this.props.baz();
          };
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          shouldComponentUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 11,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            foo: PropTypes.string,
            bar: PropTypes.string,
          };

          componentDidUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
    },
    {
      // Multiple destructured props inside of async class method
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          async method() {
            const { foo, bar } = this.props;
            await foo();
            await bar();
          };
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'baz' },
          line: 6,
          column: 13,
        },
      ],
    },
    {
      // factory functions that return async functions
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          factory() {
            return async () => {
              await this.props.foo();
              await this.props.bar();
            };
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'baz' },
          line: 6,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          componentDidUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
        Hello.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 11,
          column: 11,
        },
      ],
    },
    {
      code: `
        class Hello extends Component {
          componentDidUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        }
        Hello.propTypes = forbidExtraProps({
          foo: PropTypes.string,
          bar: PropTypes.string,
        });
      `,
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 11,
          column: 11,
        },
      ],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Hello extends Component {
          propTypes = forbidExtraProps({
            foo: PropTypes.string,
            bar: PropTypes.string
          });
          componentDidUpdate (nextProps) {
            if (nextProps.foo) {
              return true;
            }
          }
        };
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'bar' },
          line: 5,
          column: 13,
        },
      ],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      // factory functions that return async functions
      code: `
        export class Example extends Component {
          static propTypes = {
            foo: PropTypes.func,
            bar: PropTypes.func,
            baz: PropTypes.func,
          }
          factory() {
            return async function onSubmit() {
              await this.props.bar();
              await this.props.baz();
            };
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'foo' },
          line: 4,
          column: 13,
        },
      ],
    },
    {
      // Multiple props used inside of an async function
      code: `
        class Example extends Component {
          render() {
            async function onSubmit() {
              await this.props.foo();
              await this.props.bar();
            }
            return <Form onSubmit={onSubmit} />
          };
        }
        Example.propTypes = {
          foo: PropTypes.func,
          bar: PropTypes.func,
          baz: PropTypes.func,
        }
      `,
      parserOptions: Object.assign({}, parserOptions, { ecmaVersion: 2017 }),
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'baz' },
          line: 14,
          column: 11,
        },
      ],
    },
    {
      // Multiple props used inside of an async arrow function
      code: `
        class Example extends Component {
          render() {
            const onSubmit = async () => {
              await this.props.bar();
              await this.props.baz();
            }
            return <Form onSubmit={onSubmit} />
          };
        }
        Example.propTypes = {
          foo: PropTypes.func,
          bar: PropTypes.func,
          baz: PropTypes.func,
        }
      `,
      parserOptions: Object.assign({}, parserOptions, { ecmaVersion: 2017 }),
      errors: [
        {
          messageId: 'unusedPropType',
          data: { name: 'foo' },
          line: 12,
          column: 11,
        },
      ],
    },
    {
      // None of the props are used issue #1162
      code: `
        import React from "react";
        var Hello = React.createReactClass({
         propTypes: {
           name: React.PropTypes.string
         },
         render: function() {
           return <div>Hello Bob</div>;
          }
        });
      `,
      errors: [{ message: '\'name\' PropType is defined but prop is never used' }],
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
      errors: [
        { message: '\'prop1\' PropType is defined but prop is never used' },
        { message: '\'prop2\' PropType is defined but prop is never used' },
        { message: '\'prop2.*\' PropType is defined but prop is never used' },
      ],
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
      errors: [
        { message: '\'prop1\' PropType is defined but prop is never used' },
        { message: '\'prop2\' PropType is defined but prop is never used' },
        { message: '\'prop2.*\' PropType is defined but prop is never used' },
      ],
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
      errors: [
        { message: '\'prop1\' PropType is defined but prop is never used' },
        { message: '\'prop2\' PropType is defined but prop is never used' },
        { message: '\'prop2.*\' PropType is defined but prop is never used' },
      ],
    },
    {
      // issue #1097
      code: `
        class HelloGraphQL extends Component {
          render() {
              return <div>Hello</div>;
          }
        }
        HelloGraphQL.propTypes = {
          aProp: PropTypes.string.isRequired
        }

        const HellowQueries = graphql(queryDetails, {
          options: ownProps => ({
          variables: ownProps.aProp
          }),
        })(HelloGraphQL)

        export default connect(mapStateToProps, mapDispatchToProps)(HellowQueries)
      `,
      errors: [{ message: '\'aProp\' PropType is defined but prop is never used' }],
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
          message: "'unusedProp' PropType is defined but prop is never used",
          line: 7,
          column: 11,
        },
      ],
    },
    {
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
      features: ['flow'],
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
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
      settings: { react: { flowVersion: '0.52' } },
      features: ['flow'],
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
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
      features: ['flow'],
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
        MyComponent.propTypes = {
          firstname: PropTypes.string,
          lastname: PropTypes.string,
          foo: PropTypes.string,
        };
      `,
      options: [{ ignore: ['foo'] }],
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        type Props = {
          firstname: string,
          lastname: string,
          foo: string,
        }
        class MyComponent extends React.Component<Props> {
          render() {
            return <div>Hello {this.props.firstname}</div>
          }
        }
      `,
      features: ['flow'],
      options: [{ ignore: ['foo'] }],
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        type Person = string;
        class Hello extends React.Component<{ person: Person }> {
          render () {
            return <div />;
          }
        }
      `,
      features: ['flow'],
      settings: { react: { flowVersion: '0.53' } },
      errors: [{ message: '\'person\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        type Person = string;
        class Hello extends React.Component<void, { person: Person }, void> {
          render () {
            return <div />;
          }
        }
      `,
      settings: { react: { flowVersion: '0.52' } },
      errors: [{ message: '\'person\' PropType is defined but prop is never used' }],
      features: ['flow'],
    },
    (semver.satisfies(eslintPkg.version, '> 3') ? [
      {
        code: `
          function higherOrderComponent<P: { foo: string }>() {
            return class extends React.Component<P> {
              render() {
                return <div />;
              }
            }
          }
        `,
        errors: [{ message: '\'foo\' PropType is defined but prop is never used' }],
        features: ['flow'],
      },
    ] : []),
    {
      // issue #1506
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState(({ doSomething }, props) => {
              return { doSomething: doSomething + 1 };
            });
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
      `,
      errors: [{ message: '\'doSomething\' PropType is defined but prop is never used' }],
    },
    {
      // issue #1685
      code: `
        class MyComponent extends React.Component {
          onFoo() {
            this.setState(prevState => ({
              doSomething: prevState.doSomething + 1,
            }));
          }
          render() {
            return (
               <div onClick={this.onFoo}>Test</div>
            );
          }
        }
        MyComponent.propTypes = {
          doSomething: PropTypes.func
        };
      `,
      errors: [{ message: '\'doSomething\' PropType is defined but prop is never used' }],
    },
    {
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
      settings: { react: { flowVersion: '0.53' } },
      features: ['flow'],
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillReceiveProps (nextProps) {
            const {something} = nextProps;
            doSomething(something);
          }
        }
      `,
      settings: { react: { version: '16.2.0' } },
      features: ['class fields'],
      errors: [{ message: '\'something\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends Component {
          static propTypes = {
            something: PropTypes.bool
          };
          UNSAFE_componentWillUpdate (nextProps, nextState) {
            const {something} = nextProps;
            return something;
          }
        }
      `,
      settings: { react: { version: '16.2.0' } },
      features: ['class fields'],
      errors: [{ message: '\'something\' PropType is defined but prop is never used' }],
    },
    {
      code: `
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
      `,
      settings: { react: { version: '16.2.0' } },
      features: ['class fields'],
      errors: [{ message: '\'defaultValue\' PropType is defined but prop is never used' }],
    },
    {
      code: `
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
      `,
      settings: { react: { version: '16.2.0' } },
      features: ['class fields'],
      errors: [{ message: '\'defaultValue\' PropType is defined but prop is never used' }],
    },
    {
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
      features: ['flow'],
      errors: [{ message: '\'age\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
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
      options: [{ skipShapeProps: false }],
      errors: [
        { message: '\'a\' PropType is defined but prop is never used' },
        { message: '\'a.b\' PropType is defined but prop is never used' },
        { message: '\'a.b.c\' PropType is defined but prop is never used' },
      ],
    },
    {
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
      features: ['flow'],
      errors: [{ message: '\'foo\' PropType is defined but prop is never used' }],
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
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
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
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
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
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
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
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
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
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.firstname}</div>;
          }
        }
        Hello.propTypes = {
          ...BasePerson,
          lastname: PropTypes.string
        };
      `,
      errors: [{ message: '\'lastname\' PropType is defined but prop is never used' }],
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
      options: [{ skipShapeProps: false }],
      errors: [{ message: '\'person.lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        import BasePerson from './types'
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.person.firstname}</div>;
          }
        }
        Hello.propTypes = {
          person: ProTypes.shape({
            ...BasePerson,
            lastname: PropTypes.string
          })
        };
      `,
      options: [{ skipShapeProps: false }],
      errors: [{ message: '\'person.lastname\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        type Props = {notTarget: string, unused: string};
        class Hello extends React.Component {
          props: Props;
          onEvent = ({ target }: { target: Object }) => {};
          render () {
            return <div>Hello {this.props.notTarget}</div>;
          }
        }
      `,
      features: ['types'],
      errors: [
        { message: '\'unused\' PropType is defined but prop is never used' },
      ],
    },
    {
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
      errors: [{ message: '\'unUsedProp\' PropType is defined but prop is never used' }],
    },
    {
      code: `
        const Foo = (props) => {
          const { foo } = props as unknown;
          (props as unknown).bar as unknown;

          return <></>;
        };

        Foo.propTypes = {
          fooUnused,
          barUnused,
        };
      `,
      features: ['ts', 'fragment', 'no-babel'],
      errors: [
        { message: '\'fooUnused\' PropType is defined but prop is never used' },
        { message: '\'barUnused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          static propTypes = {
            prevPropUnused,
            nextPropUnused,
            setStatePropUnused,
            thisPropsAliasDestructPropUnused,
            thisPropsAliasPropUnused,
            thisDestructPropsAliasDestructPropUnused,
            thisDestructPropsAliasPropUnused,
            thisDestructPropsDestructPropUnused,
            thisPropsDestructPropUnused,
            thisPropsPropUnused,
          };

          componentDidUpdate(prevProps) {
            (prevProps as unknown).prevProp as unknown;
          }

          shouldComponentUpdate(nextProps) {
            (nextProps as unknown).nextProp as unknown;
          }

          stateProps() {
            ((this as unknown).setState as unknown)((_, props) => (props as unknown).setStateProp as unknown);
          }

          thisPropsAlias() {
            const props = (this as unknown).props as unknown;

            const { thisPropsAliasDestructProp } = props as unknown;
            (props as unknown).thisPropsAliasProp as unknown;
          }

          thisDestructPropsAlias() {
            const { props } = this as unknown;

            const { thisDestructPropsAliasDestructProp } = props as unknown;
            (props as unknown).thisDestructPropsAliasProp as unknown;
          }

          render() {
            const { props: { thisDestructPropsDestructProp } } = this as unknown;
            const { thisPropsDestructProp } = (this as unknown).props as unknown;
            ((this as unknown).props as unknown).thisPropsProp as unknown;

            return null;
          }
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'prevPropUnused\' PropType is defined but prop is never used' },
        { message: '\'nextPropUnused\' PropType is defined but prop is never used' },
        { message: '\'setStatePropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisPropsAliasDestructPropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisPropsAliasPropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisDestructPropsAliasDestructPropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisDestructPropsAliasPropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisDestructPropsDestructPropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisPropsDestructPropUnused\' PropType is defined but prop is never used' },
        { message: '\'thisPropsPropUnused\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {
          lastname: string
        };
        const Hello = (props: Person) => {
            return <div>Hello {props.firstname}</div>;
        }
      `,
      features: ['types'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {
          lastname: string
        };
        const Hello = (props: Person) => {
            return <div>Hello {props?.firstname}</div>;
        }
      `,
      features: ['types', 'optional chaining'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {
          lastname: string
        };
        const Hello = (props: Person) => {
            return <div>Hello {props?.firstname}</div>;
        }
      `,
      features: ['types'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {
          lastname?: string
        };
        const Hello = (props: Person) => {
            return <div>Hello {props.firstname}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {
          lastname?: string
        };
        const Hello = (props: Person) => {
            return <div>Hello {props?.firstname}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type Person = {
          firstname: string
          lastname: string
        };
        const Hello = ({firstname}: Person) => {
            return <div>Hello {firstname}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        interface Person {
          firstname: string
          lastname: string
        };
        const Hello = ({firstname}: Person) => {
            return <div>Hello {firstname}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        interface Foo {
          foo: string;
          [blah: string]: number;
        }
        const Hello = ({bar}: Foo) => {
            return <div>Hello {bar}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'foo\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        interface Props {
          'aria-label': string;
        }
        export default function Component(props: Props): JSX.Element {
          return <div />;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'aria-label\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        interface Props {
        [1234]: string;
        }
        export default function Component(props: Props): JSX.Element {
          return <div />;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'1234\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        const Hello = ({firstname}: {firstname: string, lastname: string}) => {
            return <div>Hello {firstname}</div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'lastname\' PropType is defined but prop is never used' },
      ],
    },
    {
    // test same name of interface should be merge
      code: `
        interface Foo {
          x: number;
        }

        interface Foo {
          z: string;
        }

        interface Bar extends Foo {
          y: string;
        }

        const Baz = ({ x, y }: Bar) => (
          <span>
              {x}
              {y}
          </span>
        );
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'z\' PropType is defined but prop is never used' },
      ],
    },
    {
    // test extends
      code: `
        interface Foo {
          x: number;
        }

        interface Bar extends Foo {
          y: string;
        }

        const Baz = ({ x }: Bar) => (
          <span>
              {x}
          </span>
        );
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'y\' PropType is defined but prop is never used' },
      ],
    },
    {
    // test extends
      code: `
        interface Foo {
          x: number;
        }

        interface Bar {
          y: string;
        }

        interface Baz {
          z:string;
        }

        const Baz = ({ x }: Bar & Foo & Baz) => (
          <span>
              {x}
          </span>
        );
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'y\' PropType is defined but prop is never used' },
        { message: '\'z\' PropType is defined but prop is never used' },
      ],
    },
    {
    // test same name merge and extends
      code: `
        interface Foo {
          x: number;
        }

        interface Foo {
          z: string;
        }

        interface Bar extends Foo {
          y: string;
        }

        const Baz = ({ x }: Bar) => (
          <span>
              {x}
          </span>
        );
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'z\' PropType is defined but prop is never used' },
        { message: '\'y\' PropType is defined but prop is never used' },
      ],
    },
    {
    // test same name merge and extends
      code: `
        interface Foo {
          x: number;
        }

        interface Foo {
          z: string;
        }

        interface Foo {
          y: string;
        }

        const Baz = ({ x }: Foo) => (
          <span>
              {x}
          </span>
        );
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'z\' PropType is defined but prop is never used' },
        { message: '\'y\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type User = {
          user: string;
        }

        type UserProps = {
          userId: string;
        }

        type AgeProps = {
          age: number;
        }

        type BirthdayProps = {
          birthday: string;
        }

        type intersectionUserProps = AgeProps & BirthdayProps;

        type Props = User & UserProps & intersectionUserProps;

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
        { message: '\'age\' PropType is defined but prop is never used' },
        { message: '\'birthday\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        const mapStateToProps = state => ({
          books: state.books
        });

        interface InfoLibTableProps extends ReturnType<typeof mapStateToProps> {
        }

        const App = (props: InfoLibTableProps) => {
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'books\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        const mapStateToProps = state => ({
          books: state.books,
        });

        interface BooksTable extends ReturnType<typeof mapStateToProps> {
          username: string;
        }

        const App = (props: BooksTable) => {
          return <div />;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'books\' PropType is defined but prop is never used' },
        { message: '\'username\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        interface BooksTable extends ReturnType<() => {books:Array<string>}> {
          username: string;
        }

        const App = (props: BooksTable) => {
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'books\' PropType is defined but prop is never used' },
        { message: '\'username\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type BooksTable = ReturnType<() => {books:Array<string>}> & {
          username: string;
        }

        const App = (props: BooksTable) => {
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'books\' PropType is defined but prop is never used' },
        { message: '\'username\' PropType is defined but prop is never used' },
      ],
    },
    {
      code: `
        type mapStateToProps = ReturnType<() => {books:Array<string>}>;

        type Props = {
          username: string;
        }

        type BooksTable = mapStateToProps & Props;

        const App = (props: BooksTable) => {
          return <div></div>;
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { message: '\'books\' PropType is defined but prop is never used' },
        { message: '\'username\' PropType is defined but prop is never used' },
      ],
    },
    // Issue: #2795
    {
      code: `
        type ConnectedProps = DispatchProps &
          StateProps

        const Component = ({ prop2, prop3 }: ConnectedProps) => {
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
        type DispatchProps = ReturnType<typeof mapDispatchToProps>
      `,
      features: ['ts', 'no-ts-old', 'no-babel'], // TODO: FIXME: remove no-ts-old and no-babel and fix
      errors: [{ message: '\'prop1\' PropType is defined but prop is never used' }],
    },
    // Issue: #296
    {
      code: `
        function Foo(props) {
          const { bar: { nope } } = props;
          return <div test={nope} />;
        }
        Foo.propTypes = {
          foo: PropTypes.number,
          bar: PropTypes.shape({
            faz: PropTypes.number,
            qaz: PropTypes.object,
          }),
        };
      `,
      errors: [{ message: '\'foo\' PropType is defined but prop is never used' }],
    }
  )),
});
