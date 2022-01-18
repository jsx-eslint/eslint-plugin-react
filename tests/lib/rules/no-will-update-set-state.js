/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-will-update-set-state');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-will-update-set-state', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {}
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            function handleEvent(data) {
              this.setState({
                data: data
              });
            }
            someClass.onSomeEvent(handleEvent)
          }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          UNSAFE_componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `,
      settings: { react: { version: '16.2.0' } },
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            this.setState({
              data: data
            });
          }
        });
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            this.setState({
              data: data
            });
          }
        });
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        }
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            if (true) {
              this.setState({
                data: data
              });
            }
          }
        });
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            if (true) {
              this.setState({
                data: data
              });
            }
          }
        }
      `,
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent((data) => this.setState({data: data}));
          }
        });
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            someClass.onSomeEvent((data) => this.setState({data: data}));
          }
        }
      `,
      options: ['disallow-in-func'],
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          UNSAFE_componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `,
      settings: { react: { version: '16.3.0' } },
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'UNSAFE_componentWillUpdate' },
        },
      ],
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: function() {
            this.setState({
              data: data
            });
          }
        });
      `,
      settings: { react: { version: '16.3.0' } },
      errors: [
        {
          messageId: 'noSetState',
          data: { name: 'UNSAFE_componentWillUpdate' },
        },
      ],
    },
  ]),
});
