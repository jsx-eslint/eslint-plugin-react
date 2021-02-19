/**
 * @fileoverview Prevent usage of findDOMNode
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-find-dom-node');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-find-dom-node', rule, {

  valid: [{
    code: `
      var Hello = function() {};
    `
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div>Hello</div>;
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          someNonMemberFunction(arg);
          this.someFunc = React.findDOMNode;
        },
        render: function() {
          return <div>Hello</div>;
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          React.someFunc(this);
        },
        render: function() {
          return <div>Hello</div>;
        }
      });
    `
  }],

  invalid: [{
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          React.findDOMNode(this).scrollIntoView();
        },
        render: function() {
          return <div>Hello</div>;
        }
      });
    `,
    errors: [{
      message: 'Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          ReactDOM.findDOMNode(this).scrollIntoView();
        },
        render: function() {
          return <div>Hello</div>;
        }
      });
    `,
    errors: [{
      message: 'Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode'
    }]
  }, {
    code: `
      class Hello extends Component {
        componentDidMount() {
          findDOMNode(this).scrollIntoView();
        }
        render() {
          return <div>Hello</div>;
        }
      };
    `,
    errors: [{
      message: 'Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode'
    }]
  }, {
    code: `
      class Hello extends Component {
        componentDidMount() {
          this.node = findDOMNode(this);
        }
        render() {
          return <div>Hello</div>;
        }
      };
    `,
    errors: [{
      message: 'Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode'
    }]
  }]
});
