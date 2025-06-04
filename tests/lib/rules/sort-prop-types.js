/**
 * @fileoverview Tests for sort-prop-types
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const babelEslintVersion = require('babel-eslint/package.json').version;
const semver = require('semver');
const eslintPkg = require('eslint/package.json');
const RuleTester = require('../../helpers/ruleTester');

const rule = require('../../../lib/rules/sort-prop-types');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('sort-prop-types', rule, {
  valid: parsers.all([].concat(
    {
      code: `
        var First = createReactClass({
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            A: PropTypes.any,
            Z: PropTypes.string,
            a: PropTypes.any,
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            A: PropTypes.any,
            z: PropTypes.string,
            Z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ ignoreCase: true }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
        var Second = createReactClass({
          propTypes: {
            AA: PropTypes.any,
            ZZ: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
          a: PropTypes.string,
          z: PropTypes.string
        };
        First.propTypes.justforcheck = PropTypes.string;
      `,
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
          a: PropTypes.any,
          A: PropTypes.any,
          z: PropTypes.string,
          Z: PropTypes.string
        };
      `,
      options: [{ ignoreCase: true }],
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any,
            c: PropTypes.any
          };
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "aria-controls": PropTypes.string
        };
      `,
      options: [{ ignoreCase: true }],
    },
    semver.satisfies(babelEslintVersion, '< 9') ? {
      // Invalid code, should not be validated
      code: `
        class Component extends React.Component {
          propTypes: {
            a: PropTypes.any,
            c: PropTypes.any,
            b: PropTypes.any
          };
          render() {
            return <div />;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    } : [],
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
        var First = createReactClass({
          propTypes: {
            barRequired: PropTypes.func.isRequired,
            onBar: PropTypes.func,
            z: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ callbacksLast: true }],
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
          };
          render() {
            return <div />;
          }
        }
      `,
      options: [{ callbacksLast: true }],
      features: ['class fields'],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
        };
      `,
      options: [{ callbacksLast: true }],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            barRequired: PropTypes.string.isRequired,
            a: PropTypes.any
        };
      `,
      options: [{ requiredFirst: true }],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            fooRequired: MyPropType,
        };
      `,
      options: [{ requiredFirst: true }],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            barRequired: PropTypes.string.isRequired,
            fooRequired: PropTypes.any.isRequired,
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
        };
      `,
      options: [
        {
          requiredFirst: true,
          callbacksLast: true,
        },
      ],
    },
    {
      code: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...c.propTypes,
            a: PropTypes.string
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        const propTypes = require('./externalPropTypes')
        const TextFieldLabel = (props) => {
          return <div />;
        };
        TextFieldLabel.propTypes = propTypes;
      `,
    },
    {
      code: `
        const First = (props) => <div />;
        export const propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
        };
        First.propTypes = propTypes;
      `,
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            c: PropTypes.any,
            C: PropTypes.string,
            a: PropTypes.any,
            b: PropTypes.bool,
          }),
        };
      `,
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          a: PropTypes.any,
          b: PropTypes.any,
          c: PropTypes.shape({
            c: PropTypes.any,
            ...otherPropTypes,
            a: PropTypes.any,
            b: PropTypes.bool,
          }),
        };
      `,
      options: [{ sortShapeProp: true }],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          a: PropTypes.any,
          b: PropTypes.any,
          c: PropTypes.shape(
            importedPropType,
          ),
        };
      `,
      options: [{ sortShapeProp: true }],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          a: PropTypes.any,
          z: PropTypes.any,
        };
      `,
      options: [{ noSortAlphabetically: true }],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          z: PropTypes.any,
          a: PropTypes.any,
        };
      `,
      options: [{ noSortAlphabetically: true }],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          0: PropTypes.any,
          1: PropTypes.any,
        };
      `,
      options: [{ ignoreCase: true }],
    },
    {
      code: `
        const shape = {
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
        };
        class Component extends React.Component {
          static propTypes = {
            x: PropTypes.shape(shape),
          };
          render() {
            return <div />;
          }
        }
      `,
      options: [{ sortShapeProp: true }],
      features: ['class fields'],
    },
    {
      code: `
        const shape = {
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
        };
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.shape(shape)
        };
      `,
      options: [{ sortShapeProp: true }],
    },
    {
      code: `
        var Component = createReactClass({
          propTypes: {
            a: React.PropTypes.string,
            c: React.PropTypes.string,
            b: React.PropTypes.string,
            onChange: React.PropTypes.func,
          }
        });
      `,
      options: [{ callbacksLast: true, noSortAlphabetically: true }],
    },
    {
      code: `
        type Props = {
          zzz: string;
          aaa: string;
        }
        function Foo(props: Props) {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: false }],
    },
    {
      code: `
        function Foo() {
          return <div />;
        }
      `,
      options: [{ checkTypes: true }],
    },
    {
      code: `
        const Foo = (props: {
          aaa: string,
          zzz: string
        }) => {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: true }],
    },
  )),
  invalid: parsers.all([].concat(
    {
      code: `
        var First = createReactClass({
          propTypes: {
            z: PropTypes.string,
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var First = createReactClass({
          propTypes: {
            /* z */
            z: PropTypes.string,
            /* a */
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            /* a */
            a: PropTypes.any,
            /* z */
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 7,
          column: 13,
          type: 'Property',
        },
      ],
    } : [],
    {
      code: `
        var First = createReactClass({
          propTypes: {
            z: PropTypes.any,
            Z: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            Z: PropTypes.any,
            z: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            Z: PropTypes.any,
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            Z: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ ignoreCase: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            A: PropTypes.any,
            z: PropTypes.string,
            Z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            A: PropTypes.any,
            Z: PropTypes.string,
            a: PropTypes.any,
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: 2,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            Zz: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
        var Second = createReactClass({
          propTypes: {
            aAA: PropTypes.any,
            ZZ: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            Zz: PropTypes.string,
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
        var Second = createReactClass({
          propTypes: {
            ZZ: PropTypes.string,
            aAA: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: 2,
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            yy: PropTypes.any,
            bb: PropTypes.string
        };
        class Second extends React.Component {
          render() {
            return <div />;
          }
        }
        Second.propTypes = {
            aAA: PropTypes.any,
            ZZ: PropTypes.string
        };
      `,
      output: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            bb: PropTypes.string,
            yy: PropTypes.any
        };
        class Second extends React.Component {
          render() {
            return <div />;
          }
        }
        Second.propTypes = {
            ZZ: PropTypes.string,
            aAA: PropTypes.any
        };
      `,
      errors: 2,
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            z: PropTypes.any,
            y: PropTypes.any,
            a: PropTypes.any
          };
          render() {
            return <div />;
          }
        }
      `,
      output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            y: PropTypes.any,
            z: PropTypes.any
          };
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      errors: 2,
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = forbidExtraProps({
            z: PropTypes.any,
            y: PropTypes.any,
            a: PropTypes.any
          });
          render() {
            return <div />;
          }
        }
      `,
      output: `
        class Component extends React.Component {
          static propTypes = forbidExtraProps({
            a: PropTypes.any,
            y: PropTypes.any,
            z: PropTypes.any
          });
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
      errors: 2,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string,
            onFoo: PropTypes.func,
            onBar: PropTypes.func
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ callbacksLast: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 7,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
            onFoo: PropTypes.func,
            onBar: PropTypes.func
          };
          render() {
            return <div />;
          }
        }
      `,
      output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
          };
          render() {
            return <div />;
          }
        }
      `,
      options: [{ callbacksLast: true }],
      features: ['class fields'],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 7,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
            onFoo: PropTypes.func,
            onBar: PropTypes.func
        };
      `,
      output: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
        };
      `,
      options: [{ callbacksLast: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 11,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = forbidExtraProps({
            a: PropTypes.any,
            z: PropTypes.string,
            onFoo: PropTypes.func,
            onBar: PropTypes.func
        });
      `,
      output: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = forbidExtraProps({
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
        });
      `,
      options: [{ callbacksLast: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 11,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const First = (props) => <div />;
        const propTypes = {
            z: PropTypes.string,
            a: PropTypes.any,
        };
        First.propTypes = forbidExtraProps(propTypes);
      `,
      output: `
        const First = (props) => <div />;
        const propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
        };
        First.propTypes = forbidExtraProps(propTypes);
      `,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const First = (props) => <div />;
        const propTypes = {
            z: PropTypes.string,
            a: PropTypes.any,
        };
        First.propTypes = propTypes;
      `,
      output: `
        const First = (props) => <div />;
        const propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
        };
        First.propTypes = propTypes;
      `,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            onBar: PropTypes.func,
            onFoo: PropTypes.func,
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string,
            onBar: PropTypes.func,
            onFoo: PropTypes.func
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ callbacksLast: true }],
      errors: [
        {
          messageId: 'callbackPropsLast',
          line: 6,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            fooRequired: PropTypes.string.isRequired,
            barRequired: PropTypes.string.isRequired,
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            barRequired: PropTypes.string.isRequired,
            fooRequired: PropTypes.string.isRequired,
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ requiredFirst: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            barRequired: PropTypes.string.isRequired,
            onFoo: PropTypes.func
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            barRequired: PropTypes.string.isRequired,
            a: PropTypes.any,
            onFoo: PropTypes.func
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ requiredFirst: true }],
      errors: [
        {
          messageId: 'requiredPropsFirst',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...a.propTypes,
            d: PropTypes.string,
            c: PropTypes.string
          }
        }
      `,
      output: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...a.propTypes,
            c: PropTypes.string,
            d: PropTypes.string
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 7,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...a.propTypes,
            f: PropTypes.string,
            d: PropTypes.string,
            ...e.propTypes,
            c: PropTypes.string
          }
        }
      `,
      output: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...a.propTypes,
            d: PropTypes.string,
            f: PropTypes.string,
            ...e.propTypes,
            c: PropTypes.string
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 7,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const propTypes = {
          b: PropTypes.string,
          a: PropTypes.string,
        };
        const TextFieldLabel = (props) => {
          return <div />;
        };
        TextFieldLabel.propTypes = propTypes;
      `,
      output: `
        const propTypes = {
          a: PropTypes.string,
          b: PropTypes.string,
        };
        const TextFieldLabel = (props) => {
          return <div />;
        };
        TextFieldLabel.propTypes = propTypes;
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            c: PropTypes.any,
            a: PropTypes.any,
            b: PropTypes.bool,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.any,
            b: PropTypes.bool,
            c: PropTypes.any,
          }),
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 12,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          z: PropTypes.shape(),
          y: PropTypes.any,
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape(),
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 10,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          z: PropTypes.shape(someType),
          y: PropTypes.any,
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape(someType),
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 10,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          z: PropTypes.any,
          y: PropTypes.any,
          a: PropTypes.shape({
            c: PropTypes.any,
            C: PropTypes.string,
            a: PropTypes.any,
            b: PropTypes.bool,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          a: PropTypes.shape({
            C: PropTypes.string,
            a: PropTypes.any,
            b: PropTypes.bool,
            c: PropTypes.any,
          }),
          y: PropTypes.any,
          z: PropTypes.any,
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 9,
          column: 11,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 10,
          column: 11,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 12,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 14,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            c: PropTypes.any,
            C: PropTypes.string,
            a: PropTypes.any,
            b: PropTypes.bool,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.any,
            b: PropTypes.bool,
            c: PropTypes.any,
            C: PropTypes.string,
          }),
        };
      `,
      options: [
        {
          sortShapeProp: true,
          ignoreCase: true,
        },
      ],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 14,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            c: PropTypes.number.isRequired,
            b: PropTypes.any,
            d: PropTypes.bool,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            c: PropTypes.number.isRequired,
            a: PropTypes.string,
            b: PropTypes.any,
            d: PropTypes.bool,
          }),
        };
      `,
      options: [
        {
          sortShapeProp: true,
          requiredFirst: true,
        },
      ],
      errors: [
        {
          messageId: 'requiredPropsFirst',
          line: 12,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            c: PropTypes.number.isRequired,
            b: PropTypes.any,
            onFoo: PropTypes.func,
            d: PropTypes.bool,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            b: PropTypes.any,
            c: PropTypes.number.isRequired,
            d: PropTypes.bool,
            onFoo: PropTypes.func,
          }),
        };
      `,
      options: [
        {
          sortShapeProp: true,
          callbacksLast: true,
        },
      ],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'callbackPropsLast',
          line: 14,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            c: PropTypes.number.isRequired,
            b: PropTypes.any,
            ...otherPropTypes,
            f: PropTypes.bool,
            d: PropTypes.string,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            b: PropTypes.any,
            c: PropTypes.number.isRequired,
            ...otherPropTypes,
            d: PropTypes.string,
            f: PropTypes.bool,
          }),
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 16,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            z: PropTypes.any,
            y: PropTypes.any,
            a: PropTypes.shape({
              c: PropTypes.any,
              a: PropTypes.any,
              b: PropTypes.bool,
            }),
          };
          render() {
            return <div />;
          }
        }
      `,
      output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.shape({
              a: PropTypes.any,
              b: PropTypes.bool,
              c: PropTypes.any,
            }),
            y: PropTypes.any,
            z: PropTypes.any,
          };
          render() {
            return <div />;
          }
        }
      `,
      options: [{ sortShapeProp: true }],
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 6,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 8,
          column: 15,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 9,
          column: 15,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            z: PropTypes.string,
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ noSortAlphabetically: false }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            'data-letter': PropTypes.string,
            a: PropTypes.any,
            e: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any,
            'data-letter': PropTypes.string,
            e: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ noSortAlphabetically: false }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          1: PropTypes.any,
          0: PropTypes.any,
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          0: PropTypes.any,
          1: PropTypes.any,
        };
      `,
      options: [{ ignoreCase: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 9,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const shape = {
          c: PropTypes.any,
          a: PropTypes.any,
          b: PropTypes.bool,
        };
        class Component extends React.Component {
          static propTypes = {
            x: PropTypes.shape(shape),
          };

          render() {
            return <div />;
          }
        }
      `,
      output: `
        const shape = {
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
        };
        class Component extends React.Component {
          static propTypes = {
            x: PropTypes.shape(shape),
          };

          render() {
            return <div />;
          }
        }
      `,
      options: [{ sortShapeProp: true }],
      features: ['class fields', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 11,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const shape = {
          c: PropTypes.any,
          a: PropTypes.any,
          b: PropTypes.bool,
        };
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.shape(shape)
        };
      `,
      output: `
        const shape = {
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
        };
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.shape(shape)
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 11,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var Component = React.createClass({
          propTypes: {
            onChange: React.PropTypes.func,
            a: React.PropTypes.string,
            c: React.PropTypes.string,
            b: React.PropTypes.string,
          }
        });
      `,
      output: `
        var Component = React.createClass({
          propTypes: {
            a: React.PropTypes.string,
            b: React.PropTypes.string,
            c: React.PropTypes.string,
            onChange: React.PropTypes.func,
          }
        });
      `,
      options: [{ callbacksLast: true }],
      errors: [
        {
          messageId: 'callbackPropsLast',
          line: 4,
        },
      ],
    },
    {
      code: `
        var Component = createReactClass({
          propTypes: {
            onChange: React.PropTypes.func,
            a: React.PropTypes.string,
            c: React.PropTypes.string,
            b: React.PropTypes.string,
          }
        });
      `,
      output: `
        var Component = createReactClass({
          propTypes: {
            a: React.PropTypes.string,
            c: React.PropTypes.string,
            b: React.PropTypes.string,
            onChange: React.PropTypes.func,
          }
        });
      `,
      options: [{ callbacksLast: true, noSortAlphabetically: true }],
      errors: [
        {
          messageId: 'callbackPropsLast',
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var First = createReactClass({
          propTypes: {
            z: PropTypes.string /* z */,
            a: PropTypes.any /* a */,
            b: PropTypes.any /* b */
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any /* a */,
            b: PropTypes.any /* b */,
            z: PropTypes.string /* z */
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 6,
          column: 13,
          type: 'Property',
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var First = createReactClass({
          propTypes: {
            /* z */ z: PropTypes.string,
            /* a */ a: PropTypes.any,
            /* b */ b: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            /* a */ a: PropTypes.any,
            /* b */ b: PropTypes.any,
            /* z */ z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 21,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 6,
          column: 21,
          type: 'Property',
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var First = createReactClass({
          propTypes: {
            /* z */ z: PropTypes.string /* z */,
            /* a */ a: PropTypes.any /* a */,
            /* b */ b: PropTypes.any /* b */
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            /* a */ a: PropTypes.any /* a */,
            /* b */ b: PropTypes.any /* b */,
            /* z */ z: PropTypes.string /* z */
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 5,
          column: 21,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 6,
          column: 21,
          type: 'Property',
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var First = createReactClass({
          propTypes: {
            /* z */ z: PropTypes.string, /* a */ a: PropTypes.any, /* b */ b: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            /* a */ a: PropTypes.any, /* b */ b: PropTypes.any, /* z */ z: PropTypes.string
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 50,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 76,
          type: 'Property',
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            c: PropTypes.number.isRequired /* c */,
            b: PropTypes.any,
            ...otherPropTypes,
            f: PropTypes.bool,
            /* d */
            d: PropTypes.string,
          }),
        };
      `,
      output: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = {
          x: PropTypes.any,
          y: PropTypes.any,
          z: PropTypes.shape({
            a: PropTypes.string,
            b: PropTypes.any,
            c: PropTypes.number.isRequired /* c */,
            ...otherPropTypes,
            /* d */
            d: PropTypes.string,
            f: PropTypes.bool,
          }),
        };
      `,
      options: [{ sortShapeProp: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 17,
          column: 13,
          type: 'Property',
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var First = createReactClass({
          propTypes: {
            /* z */
            /* z */
            z: PropTypes.string /* z */,
            /* a */
            a: PropTypes.any /* a */
            /* a */
            /* a */,
            b: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      output: `
        var First = createReactClass({
          propTypes: {
            /* a */
            a: PropTypes.any /* a */
            /* a */
            /* a */,
            b: PropTypes.any,
            /* z */
            /* z */
            z: PropTypes.string /* z */
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 8,
          column: 13,
          type: 'Property',
        },
        {
          messageId: 'propsNotSorted',
          line: 11,
          column: 13,
          type: 'Property',
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var Component = createReactClass({
          propTypes: {
            /* onChange */ onChange: React.PropTypes.func,
            /* a */ a: React.PropTypes.string,
            /* c */ c: React.PropTypes.string,
            /* b */ b: React.PropTypes.string,
          }
        });
      `,
      output: `
        var Component = createReactClass({
          propTypes: {
            /* a */ a: React.PropTypes.string,
            /* c */ c: React.PropTypes.string,
            /* b */ b: React.PropTypes.string,
            /* onChange */ onChange: React.PropTypes.func,
          }
        });
      `,
      options: [{ callbacksLast: true, noSortAlphabetically: true }],
      errors: [
        {
          messageId: 'callbackPropsLast',
          line: 4,
        },
      ],
    } : [],
    semver.satisfies(eslintPkg.version, '> 3') ? {
      code: `
        var Component = createReactClass({
          propTypes: {
            /* onChange */ onChange: React.PropTypes.func /* onChange */,
            /* a */ a: React.PropTypes.string /* a */,
            /* c */ c: React.PropTypes.string /* c */,
            /* b */ b: React.PropTypes.string /* b */,
          }
        });
      `,
      output: `
        var Component = createReactClass({
          propTypes: {
            /* a */ a: React.PropTypes.string /* a */,
            /* c */ c: React.PropTypes.string /* c */,
            /* b */ b: React.PropTypes.string /* b */,
            /* onChange */ onChange: React.PropTypes.func /* onChange */,
          }
        });
      `,
      options: [{ callbacksLast: true, noSortAlphabetically: true }],
      errors: [
        {
          messageId: 'callbackPropsLast',
          line: 4,
        },
      ],
    } : [],
    {
      code: `
        type Props = {
          zzz: string;
          aaa: string;
        }
        function Foo(props: Props) {
          return null;
        }
      `,
      output: `
        type Props = {
          aaa: string;
          zzz: string;
        }
        function Foo(props: Props) {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        type Props = {
          zzz: string;
          aaa: string;
        }
        const Foo = (props: Props) => {
          return null;
        }
      `,
      output: `
        type Props = {
          aaa: string;
          zzz: string;
        }
        const Foo = (props: Props) => {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        const Foo = (props: {
          zzz: string,
          aaa: string,
        }) => {
          return null;
        }
      `,
      output: `
        const Foo = (props: {
          aaa: string,
          zzz: string,
        }) => {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        type CustomProps = { onChange: () => void; name: string };
        const Foo = (props: CustomProps) => {
          return null;
        }
      `,
      output: `
        type CustomProps = { name: string; onChange: () => void };
        const Foo = (props: CustomProps) => {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 2,
          column: 52,
        },
      ],
    },
    {
      code: `
        type CustomProps = { onChange: (event: { target: { name: string; value: string } }) => void; name: string };
        const Foo = (props: CustomProps) => {
          return null;
        }
      `,
      output: `
        type CustomProps = { name: string; onChange: (event: { target: { name: string; value: string } }) => void };
        const Foo = (props: CustomProps) => {
          return null;
        }
      `,
      features: ['types'],
      options: [{ checkTypes: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 2,
          column: 102,
        },
      ],
    },
  )),
});
