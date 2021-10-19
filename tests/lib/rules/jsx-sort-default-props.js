/**
 * @fileoverview Tests for jsx-sort-default-props
 * @author Vladimir Kattsov
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const babelEslintVersion = require('babel-eslint/package.json').version;
const semver = require('semver');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/jsx-sort-default-props');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-sort-default-props', rule, {
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
          propTypes: {
            A: PropTypes.any,
            Z: PropTypes.string,
            a: PropTypes.any,
            z: PropTypes.string
          },
          getDefaultProps: function() {
            return {
              A: "A",
              Z: "Z",
              a: "a",
              z: "z"
            };
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
          getDefaultProps: function() {
            return {
              a: "a",
              A: "A",
              z: "z",
              Z: "Z"
            };
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
          getDefaultProps: function() {
            return {
              a: "a",
              z: "z"
            };
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
          getDefaultProps: function() {
            return {
              AA: "AA",
              ZZ: "ZZ"
            };
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
        First.defaultProps = {
          a: a,
          z: z
        };
        First.defaultProps.justforcheck = "justforcheck";
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
        First.defaultProps = {
          a: "a",
          A: "A",
          z: "z",
          Z: "Z"
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
          static defaultProps = {
            a: "a",
            b: "b",
            c: "c"
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
        Hello.defaultProps = {
          "aria-controls": "aria-controls"
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
          defaultProps: {
            a: "a",
            c: "c",
            b: "b"
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
          getDefaultProps: function() {
            return {
              barRequired: "barRequired",
              onBar: "onBar",
              z: "z"
            };
          },
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      code: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...c.propTypes,
            a: PropTypes.string
          }
          static defaultProps = {
            b: "b",
            ...c.defaultProps,
            a: "a"
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            a: PropTypes.string,
            b: PropTypes.string,
            c: PropTypes.string,
            d: PropTypes.string,
            e: PropTypes.string,
            f: PropTypes.string
          }
          static defaultProps = {
            a: "a",
            b: "b",
            ...c.defaultProps,
            e: "e",
            f: "f",
            ...d.defaultProps
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        const defaults = {
          b: "b"
        };
        const types = {
          a: PropTypes.string,
          b: PropTypes.string,
          c: PropTypes.string
        };
        function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {
          return <div>{a}{b}{c}</div>;
        }
        StatelessComponentWithSpreadInPropTypes.propTypes = types;
        StatelessComponentWithSpreadInPropTypes.defaultProps = {
          c: "c",
          ...defaults,
          a: "a"
        };
      `,
    },
    {
      code: `
        const propTypes = require('./externalPropTypes')
        const defaultProps = require('./externalDefaultProps')
        const TextFieldLabel = (props) => {
          return <div />;
        };
        TextFieldLabel.propTypes = propTypes;
        TextFieldLabel.defaultProps = defaultProps;
      `,
    },
    {
      code: `
        const First = (props) => <div />;
        export const propTypes = {
            a: PropTypes.any,
            z: PropTypes.string,
        };
        export const defaultProps = {
            a: "a",
            z: "z",
        };
        First.propTypes = propTypes;
        First.defaultProps = defaultProps;
      `,
    },
    {
      code: `
        const defaults = {
          b: "b"
        };
        const First = (props) => <div />;
        export const propTypes = {
            a: PropTypes.string,
            b: PropTypes.string,
            z: PropTypes.string,
        };
        export const defaultProps = {
            ...defaults,
            a: "a",
            z: "z",
        };
        First.propTypes = propTypes;
        First.defaultProps = defaultProps;
      `,
    }
  )),

  invalid: parsers.all([
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any,
            c: PropTypes.any
          };
          static defaultProps = {
            a: "a",
            c: "c",
            b: "b"
          };
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 11,
          column: 13,
          type: 'Property',
        },
      ], /* ,
      output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any,
            c: PropTypes.any
          };
          static defaultProps = {
            a: "a",
            b: "b",
            c: "c"
          };
          render() {
            return <div />;
          }
        }
      ` */
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any,
            c: PropTypes.any
          };
          static defaultProps = {
            c: "c",
            b: "b",
            a: "a"
          };
          render() {
            return <div />;
          }
        }
      `,
      /* output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any,
            c: PropTypes.any
          };
          static defaultProps = {
            a: "a",
            b: "b",
            c: "c"
          };
          render() {
            return <div />;
          }
        }
      `, */
      features: ['class fields'],
      errors: 2,
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any
          };
          static defaultProps = {
            Z: "Z",
            a: "a",
          };
          render() {
            return <div />;
          }
        }
      `,
      /* output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            b: PropTypes.any
          };
          static defaultProps = {
            a: "a",
            Z: "Z",
          };
          render() {
            return <div />;
          }
        }
      `, */
      features: ['class fields'],
      options: [{ ignoreCase: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 9,
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
            z: PropTypes.any
          };
          static defaultProps = {
            a: "a",
            Z: "Z",
          };
          render() {
            return <div />;
          }
        }
      `,
      /* output: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.any,
            z: PropTypes.any
          };
          static defaultProps = {
            Z: "Z",
            a: "a",
          };
          render() {
            return <div />;
          }
        }
      `, */
      features: ['class fields'],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 9,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "b": PropTypes.string
        };
        Hello.defaultProps = {
          "b": "b",
          "a": "a"
        };
      `,
      /* output: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "b": PropTypes.string
        };
        Hello.defaultProps = {
          "a": "a",
          "b": "b"
        };
      `, */
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "b": PropTypes.string,
          "c": PropTypes.string
        };
        Hello.defaultProps = {
          "c": "c",
          "b": "b",
          "a": "a"
        };
      `,
      /* output: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "b": PropTypes.string,
          "c": PropTypes.string
        };
        Hello.defaultProps = {
          "a": "a",
          "b": "b",
          "c": "c"
        };
      `, */
      errors: 2,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "B": PropTypes.string,
        };
        Hello.defaultProps = {
          "a": "a",
          "B": "B",
        };
      `,
      /* output: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "B": PropTypes.string,
        };
        Hello.defaultProps = {
          "B": "B",
          "a": "a",
        };
      `, */
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 11,
          type: 'Property',
        },
      ],
    },
    // {
    // Disabled test for comments -- fails
    //   code: `
    //     class Hello extends React.Component {
    //       render() {
    //         return <div>Hello</div>;
    //       }
    //     }
    //     Hello.propTypes = {
    //       "a": PropTypes.string,
    //       "B": PropTypes.string,
    //     };
    //     Hello.defaultProps = {
    //       /* a */
    //       "a": "a",
    //       /* B */
    //       "B": "B",
    //     };
    //   `,
    //   errors: [
    //     {
    //       messageId: 'propsNotSorted',
    //       line: 14,
    //       column: 3,
    //       type: 'Property'
    //     }
    //   ],
    //   output: `
    //     class Hello extends React.Component {
    //       render() {
    //         return <div>Hello</div>;
    //       }
    //     }
    //     Hello.propTypes = {
    //       "a": PropTypes.string,
    //       "B": PropTypes.string,
    //     };
    //     Hello.defaultProps = {
    //       /* B */
    //       "B": "B",
    //       /* a */
    //       "a": "a",
    //     };
    //   `
    // },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "B": PropTypes.string,
        };
        Hello.defaultProps = {
          "B": "B",
          "a": "a",
        };
      `,
      /* output: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "a": PropTypes.string,
          "B": PropTypes.string,
        };
        Hello.defaultProps = {
          "a": "a",
          "B": "B",
        };
      `, */
      options: [{ ignoreCase: true }],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 13,
          column: 11,
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
        const defaultProps = {
          z: "z",
          a: "a",
        };
        First.propTypes = propTypes;
        First.defaultProps = defaultProps;
      `,
      /* output: `
        const First = (props) => <div />;
        const propTypes = {
          z: PropTypes.string,
          a: PropTypes.any,
        };
        const defaultProps = {
          a: "a",
          z: "z",
        };
        First.propTypes = propTypes;
        First.defaultProps = defaultProps;
      `, */
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
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...c.propTypes,
            a: PropTypes.string
          }
          static defaultProps = {
            b: "b",
            a: "a",
            ...c.defaultProps
          }
        }
      `,
      /* output: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            b: PropTypes.string,
            ...c.propTypes,
            a: PropTypes.string
          }
          static defaultProps = {
            a: "a",
            b: "b",
            ...c.defaultProps
          }
        }
      `, */
      features: ['class fields'],
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 10,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            a: PropTypes.string,
            b: PropTypes.string,
            c: PropTypes.string,
            d: PropTypes.string,
            e: PropTypes.string,
            f: PropTypes.string
          }
          static defaultProps = {
            b: "b",
            a: "a",
            ...c.defaultProps,
            f: "f",
            e: "e",
            ...d.defaultProps
          }
        }
      `,
      /* output: `
        export default class ClassWithSpreadInPropTypes extends BaseClass {
          static propTypes = {
            a: PropTypes.string,
            b: PropTypes.string,
            c: PropTypes.string,
            d: PropTypes.string,
            e: PropTypes.string,
            f: PropTypes.string
          }
          static defaultProps = {
            a: "a",
            b: "b",
            ...c.defaultProps,
            e: "e",
            f: "f",
            ...d.defaultProps
          }
        }
      `, */
      features: ['class fields'],
      errors: 2,
    },
    {
      code: `
        const defaults = {
          b: "b"
        };
        const types = {
          a: PropTypes.string,
          b: PropTypes.string,
          c: PropTypes.string
        };
        function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {
          return <div>{a}{b}{c}</div>;
        }
        StatelessComponentWithSpreadInPropTypes.propTypes = types;
        StatelessComponentWithSpreadInPropTypes.defaultProps = {
          c: "c",
          a: "a",
          ...defaults,
        };
      `,
      /* output: `
        const defaults = {
          b: "b"
        };
        const types = {
          a: PropTypes.string,
          b: PropTypes.string,
          c: PropTypes.string
        };
        function StatelessComponentWithSpreadInPropTypes({ a, b, c }) {
          return <div>{a}{b}{c}</div>;
        }
        StatelessComponentWithSpreadInPropTypes.propTypes = types;
        StatelessComponentWithSpreadInPropTypes.defaultProps = {
          a: "a",
          c: "c",
          ...defaults,
        };
      `, */
      errors: [
        {
          messageId: 'propsNotSorted',
          line: 16,
          column: 11,
          type: 'Property',
        },
      ],
    },
  ]),
});
