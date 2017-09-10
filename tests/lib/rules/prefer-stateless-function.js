/**
 * @fileoverview Enforce stateless components to be written as a pure function
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-stateless-function');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prefer-stateless-function', rule, {

  valid: [
    {
      code: `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `
    }, {
      // Already a stateless (arrow) function
      code: 'const Foo = ({foo}) => <div>{foo}</div>;'
    }, {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.context.foo}</div>;
          }
        }
      `,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      code: `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `,
      parserOptions: parserOptions,
      options: [{
        ignorePureComponents: true
      }]
    }, {
      code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return false;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          changeState() {
            this.setState({foo: "clicked"});
          }
          render() {
            return <div onClick={this.changeState.bind(this)}>{this.state.foo || "bar"}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          doStuff() {
            this.refs.foo.style.backgroundColor = "red";
          }
          render() {
            return <div ref="foo" onClick={this.doStuff}>{this.props.foo}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          doStuff() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          constructor() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          constructor() {
            doSpecialStuffs();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          constructor() {
            foo;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.bar}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, bar} = this;
            return <div>{foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this[bar]}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this['bar']}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      code: `
        var Foo = createReactClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `,
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `,
      parser: 'babel-eslint',
      settings: {
        react: {
          version: '0.14.0'
        }
      }
    }, {
      code: `
        export default (Component) => (
          class Test extends React.Component {
            componentDidMount() {}
            render() {
              return <Component />;
            }
          }
        );
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
        Foo.childContextTypes = {
          color: PropTypes.string
        };
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        @foo
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        @foo("bar")
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }, {
      code: `
        @foo
        @bar()
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>{this['props'].foo}</div>;
          }
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>foo</div>;
          }
        }
      `,
      options: [{
        ignorePureComponents: true
      }],
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static get displayName() {
            return 'Foo';
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static displayName = 'Foo';
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          props: {
            name: string;
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          constructor() {
            super();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, context:{bar}} = this;
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        var Foo = createReactClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `,
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }, {
      code: `
        class Foo extends React.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `,
      parser: 'babel-eslint',
      errors: [{
        message: 'Component should be written as a pure function'
      }]
    }
  ]
});
