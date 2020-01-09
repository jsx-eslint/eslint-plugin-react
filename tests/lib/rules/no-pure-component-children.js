/**
 * @fileoverview Tests for no-pure-component-children
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-pure-component-children');
const RuleTester = require('eslint').RuleTester;
require('babel-eslint');

const ERROR_MESSAGE = 'Do not use children with PureComponent';

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-pure-component-children', rule, {
  valid: [{
    code: `
      var First = createReactClass({
        render: function() {
          return <div />;
        }
      });
    `
  }, {
    code: `
      var First = createReactClass({
        propTypes: externalPropTypes,
        render: function() {
          return <div />;
        }
      });
    `
  }, {
    code: `
      var First = createReactClass({
        propTypes: {
          foo: PropTypes.string
        },
        render: function() {
          return <div />;
        }
      });
    `
  }, {
    code: `
      var First = createReactClass({
        propTypes: {
          children: PropTypes.string
        },
        render: function() {
          return <div />;
        }
      });
    `
  }, {
    code: `
      var First = createReactClass({
        propTypes: {
          foo: PropTypes.string
        },
        render: function() {
          return <div />;
        }
      });
      
      var Second = createReactClass({
        propTypes: {
          bar: PropTypes.string
        },
        render: function() {
          return <div />;
        }
      });
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        foo: PropTypes.node,
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      
      Component.propTypes = {
        children: PropTypes.node,
      };
    `
  }, {
    code: `
      class Component extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        foo: PropTypes.node,
      };
    `
  }, {
    code: `
      class FirstComponent extends React.Component {
        render() {
          return <div />;
        }
      }
      
      FirstComponent.propTypes = {
        children: PropTypes.node,
      };
      
      class SecondComponent extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      SecondComponent.propTypes = {
        foo: PropTypes.node,
      };
    `
  }, {
    parser: 'babel-eslint',
    code: `
      class Component extends React.Component {
        static propTypes = {
          foo: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `
  }, {
    parser: 'babel-eslint',
    code: `
      class Component extends React.Component {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `
  }, {
    parser: 'babel-eslint',
    code: `
      class Component extends React.PureComponent {
        static propTypes = {
          foo: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `
  }, {
    parser: 'babel-eslint',
    code: `
      class FirstComponent extends React.Component {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
      
      class SecondComponent extends React.PureComponent {
        static propTypes = {
          foo: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `
  }],
  invalid: [{
    code: `
      class Component extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        children: PropTypes.node,
      };
    `,
    errors: [{
      message: ERROR_MESSAGE,
      line: 8,
      column: 19,
      type: 'MemberExpression'
    }],
    output: `
      class Component extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        children: PropTypes.node,
      };
    `
  }, {
    code: `
      class FirstComponent extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      FirstComponent.propTypes = {
        children: PropTypes.node,
      };
      
      class SecondComponent extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      SecondComponent.propTypes = {
        children: PropTypes.node,
      };
    `,
    errors: [{
      message: ERROR_MESSAGE,
      line: 8,
      column: 19,
      type: 'MemberExpression'
    }, {
      message: ERROR_MESSAGE,
      line: 17,
      column: 19,
      type: 'MemberExpression'
    }],
    output: `
      class FirstComponent extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      FirstComponent.propTypes = {
        children: PropTypes.node,
      };
      
      class SecondComponent extends React.PureComponent {
        render() {
          return <div />;
        }
      }
      SecondComponent.propTypes = {
        children: PropTypes.node,
      };
    `
  },
  {
    parser: 'babel-eslint',
    code: `
      class Component extends React.PureComponent {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 21,
      type: 'MemberExpression'
    }],
    output: `
      class Component extends React.PureComponent {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `
  },
  {
    parser: 'babel-eslint',
    code: `
      class FirstComponent extends React.PureComponent {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
      
      class SecondComponent extends React.PureComponent {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `,
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 21,
      type: 'MemberExpression'
    }, {
      message: ERROR_MESSAGE,
      line: 13,
      column: 21,
      type: 'MemberExpression'
    }],
    output: `
      class FirstComponent extends React.PureComponent {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
      
      class SecondComponent extends React.PureComponent {
        static propTypes = {
          children: PropTypes.node,
        };
        render() {
          return <div />;
        }
      }
    `
  }]
});
