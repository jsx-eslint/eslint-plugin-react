/**
 * @fileoverview Prefer exact proptype definitions
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/prefer-exact-props');

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

const settings = {
  propWrapperFunctions: [
    {property: 'exact', exact: true}
  ]
};

const PROP_TYPES_MESSAGE = 'Component propTypes should be exact by using \'exact\'.';
const FLOW_MESSAGE = 'Component flow props should be set with exact objects.';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prefer-exact-props', rule, {
  valid: [{
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {};
    `,
    settings
  }, {
    code: `
      class Component extends React.Component {
        static propTypes = {};
        render() {
          return <div />;
        }
      }
    `,
    parser: require.resolve('babel-eslint'),
    settings
  }, {
    code: `
      class Component extends React.Component {
        props: {};
        render() {
          return <div />;
        }
      }
    `,
    parser: require.resolve('babel-eslint'),
    settings
  }, {
    code: `
      function Component(props) {
        return <div />;
      }
      Component.propTypes = {};
    `,
    settings
  }, {
    code: `
      function Component(props: {}) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint')
  }, {
    code: `
      type Props = {|
        foo: string
      |}
      function Component(props: Props) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint')
  }, {
    code: `
      function Component(props: {| foo : string |}) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint')
  }, {
    code: `
      type Props = {}
      function Component(props: Props) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint')
  }, {
    code: `
      import type Props from 'foo';
      function Component(props: Props) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint')
  }, {
    code: `
      const props = {};
      function Component(props) {
        return <div />;
      }
      Component.propTypes = props;
    `,
    settings
  }, {
    code: `
      const props = {};
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = props;
    `,
    settings
  }, {
    code: `
      import props from 'foo';
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = props;
    `,
    settings
  }, {
    code: `
      class Component extends React.Component {
        state = {hi: 'hi'}
        render() {
          return <div>{this.state.hi}</div>;
        }
      }
    `,
    parser: require.resolve('babel-eslint')
  }, {
    code: `
      import exact from "prop-types-exact";
      function Component({ foo, bar }) {
        return <div>{foo}{bar}</div>;
      }
      Component.propTypes = exact({
        foo: PropTypes.string,
        bar: PropTypes.string,
      });
    `,
    settings
  }, {
    code: `
      function Component({ foo, bar }) {
        return <div>{foo}{bar}</div>;
      }
      Component.propTypes = {
        foo: PropTypes.string,
        bar: PropTypes.string,
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          const { foo, bar } = this.props;
          return <div>{foo}{bar}</div>;
        }
      }
      Component.propTypes = {
        foo: PropTypes.string,
        bar: PropTypes.string,
      };
    `
  }, {
    code: `
      import somethingElse from "something-else";
      const props = {
        foo: PropTypes.string,
        bar: PropTypes.shape({
          baz: PropTypes.string
        })
      };
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = somethingElse(props);
    `
  }, {
    code: `
      import somethingElse from "something-else";
      const props =
      class Component extends React.Component {
        static propTypes = somethingElse({
          foo: PropTypes.string,
          bar: PropTypes.shape({
            baz: PropTypes.string
          })
        });
        render() {
          return <div />;
        }
      }
    `,
    parser: require.resolve('babel-eslint')
  }],
  invalid: [{
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        foo: PropTypes.string
      };
    `,
    settings,
    errors: [{message: PROP_TYPES_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static propTypes = {
          foo: PropTypes.string
        }
        render() {
          return <div />;
        }
      }
    `,
    settings,
    parser: require.resolve('babel-eslint'),
    errors: [{message: PROP_TYPES_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        props: {
          foo: string
        }
        render() {
          return <div />;
        }
      }
    `,
    parser: require.resolve('babel-eslint'),
    errors: [{message: FLOW_MESSAGE}]
  }, {
    code: `
      function Component(props: { foo: string }) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint'),
    errors: [{message: FLOW_MESSAGE}]
  }, {
    code: `
      type Props = {
        foo: string
      }
      function Component(props: Props) {
        return <div />;
      }
    `,
    parser: require.resolve('babel-eslint'),
    errors: [{message: FLOW_MESSAGE}]
  }, {
    code: `
      const props = {
        foo: PropTypes.string
      };
      function Component(props) {
        return <div />;
      }
      Component.propTypes = props;
    `,
    settings,
    errors: [{message: PROP_TYPES_MESSAGE}]
  }, {
    code: `
      const props = {
        foo: PropTypes.string
      };
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = props;
    `,
    settings,
    errors: [{message: PROP_TYPES_MESSAGE}]
  }, {
    code: `
      const props = {
        foo: PropTypes.string
      };
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = props;
    `,
    settings: {
      propWrapperFunctions: [
        {property: 'exact', exact: true},
        {property: 'forbidExtraProps', exact: true}
      ]
    },
    errors: [{message: 'Component propTypes should be exact by using one of \'exact\', \'forbidExtraProps\'.'}]
  }, {
    code: `
      const props = {
        foo: PropTypes.string,
        bar: PropTypes.shape({
          baz: PropTypes.string
        })
      };
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = props;
    `,
    settings: {
      propWrapperFunctions: [
        {property: 'exact', exact: true},
        {property: 'forbidExtraProps', exact: true}
      ]
    },
    errors: [{message: 'Component propTypes should be exact by using one of \'exact\', \'forbidExtraProps\'.'}]
  }, {
    code: `
      import somethingElse from "something-else";
      function Component({ foo, bar }) {
        return <div>{foo}{bar}</div>;
      }
      Component.propTypes = somethingElse({
        foo: PropTypes.string,
        bar: PropTypes.string,
      });
    `,
    settings,
    errors: [{message: 'Component propTypes should be exact by using \'exact\'.'}]
  }, {
    code: `
      import somethingElse from "something-else";
      const props = {
        foo: PropTypes.string,
        bar: PropTypes.shape({
          baz: PropTypes.string
        })
      };
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = somethingElse(props);
    `,
    settings,
    errors: [{message: 'Component propTypes should be exact by using \'exact\'.'}]
  }, {
    code: `
      import somethingElse from "something-else";
      const props =
      class Component extends React.Component {
        static propTypes = somethingElse({
          foo: PropTypes.string,
          bar: PropTypes.shape({
            baz: PropTypes.string
          })
        });
        render() {
          return <div />;
        }
      }
    `,
    settings,
    parser: require.resolve('babel-eslint'),
    errors: [{message: 'Component propTypes should be exact by using \'exact\'.'}]
  }]
});
