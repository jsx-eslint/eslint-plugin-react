/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-did-mount-set-state');
const RuleTester = require('eslint').RuleTester;

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
ruleTester.run('no-did-mount-set-state', rule, {

  valid: [{
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {}
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          someNonMemberFunction(arg);
          this.someHandler = this.setState;
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          someClass.onSomeEvent(function(data) {
            this.setState({
              data: data
            });
          })
        }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          function handleEvent(data) {
            this.setState({
              data: data
            });
          }
          someClass.onSomeEvent(handleEvent)
        }
      });
    `,
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          this.setState({
            data: data
          });
        }
      });
    `,
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        componentDidMount() {
          this.setState({
            data: data
          });
        }
      }
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          this.setState({
            data: data
          });
        }
      });
    `,
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        componentDidMount() {
          this.setState({
            data: data
          });
        }
      }
    `,
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          someClass.onSomeEvent(function(data) {
            this.setState({
              data: data
            });
          })
        }
      });
    `,
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        componentDidMount() {
          someClass.onSomeEvent(function(data) {
            this.setState({
              data: data
            });
          })
        }
      }
    `,
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      });
    `,
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        componentDidMount() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      }
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
          someClass.onSomeEvent((data) => this.setState({data: data}));
        }
      });
    `,
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        componentDidMount() {
          someClass.onSomeEvent((data) => this.setState({data: data}));
        }
      }
    `,
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidMount'
    }]
  }]
});
