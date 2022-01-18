/**
 * @fileoverview Tests for forbid-prop-types
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const babelEslintVersion = require('babel-eslint/package.json').version;
const semver = require('semver');
const RuleTester = require('eslint').RuleTester;

const rule = require('../../../lib/rules/forbid-prop-types');

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
ruleTester.run('forbid-prop-types', rule, {
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
            s: PropTypes.string,
            n: PropTypes.number,
            i: PropTypes.instanceOf,
            b: PropTypes.bool
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
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        })
      `,
      options: [{ forbid: ['any', 'object'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            o: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ forbid: ['any', 'array'] }],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            o: PropTypes.object,
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        { forbid: ['any', 'array'] },
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
          a: PropTypes.string,
          b: PropTypes.string
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
          elem: PropTypes.instanceOf(HTMLElement)
        };
      `,
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
        var Hello = createReactClass({
          propTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
    },
    {
      // Proptypes declared with a spread property
      code: `
        class Test extends React.component {
          static propTypes = {
            intl: React.propTypes.number,
            ...propTypes
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Proptypes declared with a spread property
      code: `
        class Test extends React.component {
          static get propTypes() {
            return {
              intl: React.propTypes.number,
              ...propTypes
            };
          };
        }
      `,
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: externalPropTypes,
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkContextTypes: true }],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            s: PropTypes.string,
            n: PropTypes.number,
            i: PropTypes.instanceOf,
            b: PropTypes.bool
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkContextTypes: true }],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['any', 'object'],
          checkContextTypes: true,
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            o: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['any', 'array'],
          checkContextTypes: true,
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            o: PropTypes.object,
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['any', 'array'],
          checkContextTypes: true,
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
        First.childContextTypes = {
          a: PropTypes.string,
          b: PropTypes.string
        };
        First.childContextTypes.justforcheck = PropTypes.string;
      `,
      options: [{ checkContextTypes: true }],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.childContextTypes = {
          elem: PropTypes.instanceOf(HTMLElement)
        };
      `,
      options: [{ checkContextTypes: true }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.childContextTypes = {
          "aria-controls": PropTypes.string
        };
      `,
      options: [{ checkContextTypes: true }],
    },
    semver.satisfies(babelEslintVersion, '< 9') ? {
      // Invalid code, should not be validated
      code: `
        class Component extends React.Component {
          childContextTypes: {
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
      options: [{ checkContextTypes: true }],
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
      options: [{ checkContextTypes: true }],
    },
    {
      code: `
        var Hello = createReactClass({
          childContextTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkContextTypes: true }],
    },
    {
      // Proptypes declared with a spread property
      code: `
        class Test extends React.component {
          static childContextTypes = {
            intl: React.childContextTypes.number,
            ...childContextTypes
          };
        }
      `,
      features: ['class fields'],
      options: [{ checkContextTypes: true }],
    },
    {
      // Proptypes declared with a spread property
      code: `
        class Test extends React.component {
          static get childContextTypes() {
            return {
              intl: React.childContextTypes.number,
              ...childContextTypes
            };
          };
        }
      `,
      options: [{ checkContextTypes: true }],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: externalPropTypes,
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkChildContextTypes: true }],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            s: PropTypes.string,
            n: PropTypes.number,
            i: PropTypes.instanceOf,
            b: PropTypes.bool
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkChildContextTypes: true }],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['any', 'object'],
          checkChildContextTypes: true,
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            o: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['any', 'array'],
          checkChildContextTypes: true,
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            o: PropTypes.object,
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['any', 'array'],
          checkChildContextTypes: true,
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
        First.childContextTypes = {
          a: PropTypes.string,
          b: PropTypes.string
        };
        First.childContextTypes.justforcheck = PropTypes.string;
      `,
      options: [{ checkChildContextTypes: true }],
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.childContextTypes = {
          elem: PropTypes.instanceOf(HTMLElement)
        };
      `,
      options: [{ checkChildContextTypes: true }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.childContextTypes = {
          "aria-controls": PropTypes.string
        };
      `,
      options: [{ checkChildContextTypes: true }],
    },
    semver.satisfies(babelEslintVersion, '< 9') ? {
      // Invalid code, should not be validated
      code: `
        class Component extends React.Component {
          childContextTypes: {
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
      options: [{ checkChildContextTypes: true }],
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
      options: [{ checkChildContextTypes: true }],
    },
    {
      code: `
        var Hello = createReactClass({
          childContextTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkChildContextTypes: true }],
    },
    {
      // Proptypes declared with a spread property
      code: `
        class Test extends React.component {
          static childContextTypes = {
            intl: React.childContextTypes.number,
            ...childContextTypes
          };
        }
      `,
      features: ['class fields'],
      options: [{ checkChildContextTypes: true }],
    },
    {
      // Proptypes declared with a spread property
      code: `
        class Test extends React.component {
          static get childContextTypes() {
            return {
              intl: React.childContextTypes.number,
              ...childContextTypes
            };
          };
        }
      `,
      options: [{ checkChildContextTypes: true }],
    },
    {
      code: `
        class TestComponent extends React.Component {
          static defaultProps = function () {
            const date = new Date();
            return {
              date
            };
          }();
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class HeroTeaserList extends React.Component {
          render() { return null; }
        }
        HeroTeaserList.propTypes = Object.assign({
          heroIndex: PropTypes.number,
          preview: PropTypes.bool,
        }, componentApi, teaserListProps);
      `,
    },
    {
      code: `
        import PropTypes from "prop-types";
        const Foo = {
          foo: PropTypes.string,
        };
        const Bar = {
          bar: PropTypes.shape(Foo),
        };
      `,
    }
  )),

  invalid: parsers.all([
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            n: PropTypes.number
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'number' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
      options: [
        { forbid: ['number'] },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'array' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'array' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'object' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.object.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'object' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array,
            o: PropTypes.object
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
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        });
        var Second = createReactClass({
          propTypes: {
            o: PropTypes.object
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
            a: PropTypes.array,
            o: PropTypes.object
        };
        class Second extends React.Component {
          render() {
            return <div />;
          }
        }
        Second.propTypes = {
            a: PropTypes.array,
            o: PropTypes.object
        };
      `,
      errors: 4,
    },
    {
      code: `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = forbidExtraProps({
            a: PropTypes.array
        });
      `,
      errors: 1,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        import { forbidExtraProps } from "airbnb-prop-types";
        export const propTypes = {dpm: PropTypes.any};
        export default function Component() {}
        Component.propTypes = propTypes;
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
        },
      ],
    },
    {
      code: `
        import { forbidExtraProps } from "airbnb-prop-types";
        export const propTypes = {a: PropTypes.any};
        export default function Component() {}
        Component.propTypes = forbidExtraProps(propTypes);
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
        },
      ],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.array,
            o: PropTypes.object
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
          static get propTypes() {
            return {
              a: PropTypes.array,
              o: PropTypes.object
            };
          };
          render() {
            return <div />;
          }
        }
      `,
      errors: 2,
    },
    {
      code: `
        class Component extends React.Component {
          static propTypes = forbidExtraProps({
            a: PropTypes.array,
            o: PropTypes.object
          });
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      errors: 2,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Component extends React.Component {
          static get propTypes() {
            return forbidExtraProps({
              a: PropTypes.array,
              o: PropTypes.object
            });
          }
          render() {
            return <div />;
          }
        }
      `,
      errors: 2,
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        var Hello = createReactClass({
          propTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ forbid: ['instanceOf'] }],
      errors: 1,
    },
    {
      code: `
        var object = PropTypes.object;
        var Hello = createReactClass({
          propTypes: {
            retailer: object,
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ forbid: ['object'] }],
      errors: 1,
    },
    {
      code: `
        var First = createReactClass({
          contextTypes: {
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Foo extends Component {
          static contextTypes = {
            a: PropTypes.any
          }
          render() {
            return <div />;
          }
        }
      `,
      options: [{ checkContextTypes: true }],
      features: ['class fields'],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Foo extends Component {
          static get contextTypes() {
            return {
              a: PropTypes.any
            };
          }
          render() {
            return <div />;
          }
        }
      `,
      options: [{ checkContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 5,
          column: 15,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Foo extends Component {
          render() {
            return <div />;
          }
        }
        Foo.contextTypes = {
          a: PropTypes.any
        };
      `,
      options: [{ checkContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 8,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        function Foo(props) {
          return <div />;
        }
        Foo.contextTypes = {
          a: PropTypes.any
        };
      `,
      options: [{ checkContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 6,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const Foo = (props) => {
          return <div />;
        };
        Foo.contextTypes = {
          a: PropTypes.any
        };
      `,
      options: [{ checkContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 6,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          static contextTypes = forbidExtraProps({
            a: PropTypes.array,
            o: PropTypes.object
          });
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      errors: 2,
      options: [{ checkContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Component extends React.Component {
          static get contextTypes() {
            return forbidExtraProps({
              a: PropTypes.array,
              o: PropTypes.object
            });
          }
          render() {
            return <div />;
          }
        }
      `,
      errors: 2,
      options: [{ checkContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.contextTypes = forbidExtraProps({
          a: PropTypes.array,
          o: PropTypes.object
        });
      `,
      errors: 2,
      options: [{ checkContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        function Component(props) {
          return <div />;
        }
        Component.contextTypes = forbidExtraProps({
          a: PropTypes.array,
          o: PropTypes.object
        });
      `,
      errors: 2,
      options: [{ checkContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        const Component = (props) => {
          return <div />;
        };
        Component.contextTypes = forbidExtraProps({
          a: PropTypes.array,
          o: PropTypes.object
        });
      `,
      errors: 2,
      options: [{ checkContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        var Hello = createReactClass({
          contextTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        class Component extends React.Component {
          static contextTypes = {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          }
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          forbid: ['instanceOf'],
          checkContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        class Component extends React.Component {
          static get contextTypes() {
            return {
              retailer: PropTypes.instanceOf(Map).isRequired,
              requestRetailer: PropTypes.func.isRequired
            };
          }
          render() {
            return <div />;
          }
        }
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.contextTypes = {
          retailer: PropTypes.instanceOf(Map).isRequired,
          requestRetailer: PropTypes.func.isRequired
        };
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        function Component(props) {
          return <div />;
        }
        Component.contextTypes = {
          retailer: PropTypes.instanceOf(Map).isRequired,
          requestRetailer: PropTypes.func.isRequired
        };
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        const Component = (props) => {
          return <div />;
        };
        Component.contextTypes = {
          retailer: PropTypes.instanceOf(Map).isRequired,
          requestRetailer: PropTypes.func.isRequired
        }
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        var First = createReactClass({
          childContextTypes: {
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [{ checkChildContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Foo extends Component {
          static childContextTypes = {
            a: PropTypes.any
          }
          render() {
            return <div />;
          }
        }
      `,
      options: [{ checkChildContextTypes: true }],
      features: ['class fields'],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 4,
          column: 13,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Foo extends Component {
          static get childContextTypes() {
            return {
              a: PropTypes.any
            };
          }
          render() {
            return <div />;
          }
        }
      `,
      options: [{ checkChildContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 5,
          column: 15,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Foo extends Component {
          render() {
            return <div />;
          }
        }
        Foo.childContextTypes = {
          a: PropTypes.any
        };
      `,
      options: [{ checkChildContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 8,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        function Foo(props) {
          return <div />;
        }
        Foo.childContextTypes = {
          a: PropTypes.any
        };
      `,
      options: [{ checkChildContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 6,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const Foo = (props) => {
          return <div />;
        };
        Foo.childContextTypes = {
          a: PropTypes.any
        };
      `,
      options: [{ checkChildContextTypes: true }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          data: { target: 'any' },
          line: 6,
          column: 11,
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class Component extends React.Component {
          static childContextTypes = forbidExtraProps({
            a: PropTypes.array,
            o: PropTypes.object
          });
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      errors: 2,
      options: [{ checkChildContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Component extends React.Component {
          static get childContextTypes() {
            return forbidExtraProps({
              a: PropTypes.array,
              o: PropTypes.object
            });
          }
          render() {
            return <div />;
          }
        }
      `,
      errors: 2,
      options: [{ checkChildContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.childContextTypes = forbidExtraProps({
          a: PropTypes.array,
          o: PropTypes.object
        });
      `,
      errors: 2,
      options: [{ checkChildContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        function Component(props) {
          return <div />;
        }
        Component.childContextTypes = forbidExtraProps({
          a: PropTypes.array,
          o: PropTypes.object
        });
      `,
      errors: 2,
      options: [{ checkChildContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        const Component = (props) => {
          return <div />;
        };
        Component.childContextTypes = forbidExtraProps({
          a: PropTypes.array,
          o: PropTypes.object
        });
      `,
      errors: 2,
      options: [{ checkChildContextTypes: true }],
      settings: {
        propWrapperFunctions: ['forbidExtraProps'],
      },
    },
    {
      code: `
        var Hello = createReactClass({
          childContextTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkChildContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        class Component extends React.Component {
          static childContextTypes = {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          }
          render() {
            return <div />;
          }
        }
      `,
      features: ['class fields'],
      options: [
        {
          forbid: ['instanceOf'],
          checkChildContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.childContextTypes = {
          retailer: PropTypes.instanceOf(Map).isRequired,
          requestRetailer: PropTypes.func.isRequired
        };
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkChildContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        function Component(props) {
          return <div />;
        }
        Component.childContextTypes = {
          retailer: PropTypes.instanceOf(Map).isRequired,
          requestRetailer: PropTypes.func.isRequired
        };
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkChildContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        const Component = (props) => {
          return <div />;
        };
        Component.childContextTypes = {
          retailer: PropTypes.instanceOf(Map).isRequired,
          requestRetailer: PropTypes.func.isRequired
        };
      `,
      options: [
        {
          forbid: ['instanceOf'],
          checkChildContextTypes: true,
        },
      ],
      errors: 1,
    },
    {
      code: `
        import { object, string } from "prop-types";
        function C({ a, b }) { return [a, b]; }
        C.propTypes = {
          a: object,
          b: string
        };
      `,
      options: [
        { forbid: ['object'] },
      ],
      errors: 1,
    },
    {
      code: `
        import { objectOf, any } from "prop-types";
        function C({ a }) { return a; }
        C.propTypes = {
          a: objectOf(any)
        };
      `,
      options: [
        { forbid: ['any'] },
      ],
      errors: 1,
    },
    {
      code: `
        import { objectOf, any } from "prop-types";
        function C({ a }) { return a; }
        C.propTypes = {
          a: objectOf(any)
        };
      `,
      options: [{ forbid: ['objectOf'] }],
      errors: 1,
    },
    {
      code: `
        import { shape, any } from "prop-types";
        function C({ a }) { return a; }
        C.propTypes = {
          a: shape({
            b: any
          })
        };
      `,
      options: [{ forbid: ['any'] }],
      errors: 1,
    },
    {
      code: `
        import { any } from "prop-types";
        function C({ a }) { return a; }
        C.propTypes = {
          a: PropTypes.shape({
            b: any
          })
        };
      `,
      options: [{ forbid: ['any'] }],
      errors: 1,
    },
    {
      code: `
        var First = createReactClass({
          propTypes: {
            s: PropTypes.shape({
              o: PropTypes.object
            })
          },
          render: function() {
            return <div />;
          }
        });
      `,
      errors: 1,
    },
  ]),
});
