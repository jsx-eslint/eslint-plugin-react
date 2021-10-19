/**
 * @fileoverview Prevent direct mutation of this.state
 * @author David Petersen
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-direct-mutation-state');

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
ruleTester.run('no-direct-mutation-state', rule, {
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
          render: function() {
            var obj = {state: {}};
            obj.state.name = "foo";
            return <div>Hello {obj.state.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = "foo";
        module.exports = {};
      `,
    },
    {
      code: `
        class Hello {
          getFoo() {
            this.state.foo = 'bar'
            return this.state.foo;
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = "bar"
          }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = 1;
          }
        }
      `,
    },
    {
      code: `
        class OneComponent extends Component {
          constructor() {
            super();
            class AnotherComponent extends Component {
              constructor() {
                super();
              }
            }
            this.state = {};
          }
        }
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            this.state.foo = "bar"
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            this.state.foo++;
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name= "bar"
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name.first = "bar"
            return <div>Hello</div>;
          }
        });
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name.first = "bar"
            this.state.person.name.last = "baz"
            return <div>Hello</div>;
          }
        });
      `,
      errors: [
        {
          message: 'Do not mutate state directly. Use setState().',
          line: 4,
          column: 13,
        },
        {
          message: 'Do not mutate state directly. Use setState().',
          line: 5,
          column: 13,
        },
      ],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor() {
            someFn()
          }
          someFn() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          constructor(props) {
            super(props)
            doSomethingAsync(() => {
              this.state = "bad";
            });
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillMount() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          componentDidMount() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillReceiveProps() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          shouldComponentUpdate() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          componentDidUpdate() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    {
      code: `
        class Hello extends React.Component {
          componentWillUnmount() {
            this.state.foo = "bar"
          }
        }
      `,
      errors: [{ messageId: 'noDirectMutation' }],
    },
    /**
     * Would be nice to prevent this too
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            var that = this;
            that.state.person.name.first = "bar"
            return <div>Hello</div>;
          }
        });
      `,
      errors: [{messageId: 'noDirectMutation'}]
    } */
  ]),
});
