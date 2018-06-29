
/**
 * @fileoverview Rule to forbid or enforce destructuring assignment consistency.
 **/
'use strict';

const rule = require('../../../lib/rules/destructuring-assignment');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});

ruleTester.run('destructuring-assignment', rule, {
  valid: [{
    code: `function Component({ color }) {
      return <span>{color}</span>;
    }`
  }, {
    code: 'const Component = ({ color }) => <span>{color}</span>;'
  }, {
    code: 'const Component = ({ color }, { onChange }) => <span>{color}</span>;'
  }, {
    code: 'const Component = (props) => <span>{props.color}</span>;',
    options: [{SFC: 'never'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return this.props.children;
        }
      }
    `,
    options: [{class: 'never'}]
  }, {
    code: `
      class Component extends React.Component {
        componentDidMount() {
          this.props.onMount();
        }

        render() {
          const { children } = this.props;
          return children;
        }
      }
    `,
    options: [{class: 'always'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          return this.props.children;
        }
      });
    `,
    options: [{createClass: 'never'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          const { children } = this.props;
          
          return children;
        }
      });
    `,
    options: [{createClass: 'always'}]
  }, {
    code: `
      const Component = createReactClass({
        componentDidMount() {
          this.props.onMount();
        },
        
        render() {
          const { children } = this.props;
          
          return children;
        }
      });
    `,
    options: [{createClass: 'always'}],
    parser: 'babel-eslint'
  }, {
    code: `const MyComponent = (props) => {
      const { h, i } = hi;
      return <div id={props.id} className={props.className} />
    };`,
    options: ['never'],
    parser: 'babel-eslint'
  }, {
    code: `const Foo = class extends React.PureComponent {
      constructor() {
        this.state = {};
        this.state.foo = 'bar';
      }
    };`,
    options: ['always']
  }],

  invalid: [{
    code: `function Component({ color }) {
      return <span>{color}</span>;
    }`,
    options: ['never'],
    errors: [{message: 'Must never use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = ({ color }) => <span>{color}</span>;',
    options: ['never'],
    errors: [{message: 'Must never use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = (props) => <span>{props.color}</span>;',
    options: [{class: 'never'}],
    errors: [{message: 'Must use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = (props) => <span>{props.color.primary}</span>;',
    options: ['always'],
    errors: [{message: 'Must use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = (props, { onChange }) => <span>{props.color}</span>;',
    options: ['never'],
    errors: [{message: 'Must never use destructuring context assignment in SFC argument'}]
  }, {
    code: 'const Component = (props) => <span>{props.color}</span>;',
    options: [{SFC: 'always'}],
    errors: [{message: 'Must use destructuring props assignment in SFC argument'}]
  }, {
    code: 'const Component = (props, context) => <span>{context.color}</span>;',
    options: [{SFC: 'always'}],
    errors: [{message: 'Must use destructuring context assignment in SFC argument'}]
  }, {
    code: `
      function Component(props, context) {
        const { onClick } = context;
        
        return <div />
      }
    `,
    options: [{SFC: 'never'}],
    errors: [{message: 'Must never use destructuring context assignment'}]
  }, {
    code: `
      function Component(props) {
        const { children } = props;
        
        return <div>{children}</div>;
      }
    `,
    options: [{SFC: 'never'}],
    errors: [{message: 'Must never use destructuring props assignment'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return this.props.children;
        }
      }
    `,
    options: [{class: 'always'}],
    errors: [{message: 'Must use destructuring props assignment'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          return this.props.children;
        }
      });
    `,
    options: [{createClass: 'always'}],
    errors: [{message: 'Must use destructuring props assignment'}]
  }, {
    code: `
      const Component = createReactClass({
        render() {
          const { children } = this.props;

          return children;
        }
      });
    `,
    options: [{createClass: 'never'}],
    errors: [{message: 'Must never use destructuring props assignment'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          const { children } = this.props;

          return children;
        }
      }
    `,
    options: [{class: 'never'}],
    errors: [{message: 'Must never use destructuring props assignment'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          const { value } = this.state;

          return value;
        }
      }
    `,
    options: [{class: 'never'}],
    errors: [{message: 'Must never use destructuring state assignment'}]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return this.state.value;
        }
      }
    `,
    options: [{class: 'always'}],
    errors: [{message: 'Must use destructuring state assignment'}]
  }]
});
