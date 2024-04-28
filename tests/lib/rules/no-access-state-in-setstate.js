/**
 * @fileoverview Prevent usage of this.state within setState
 * @author Rolf Erik Lekang, Jørgen Aaberg
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-access-state-in-setstate');

const languageOptions = {
  ecmaVersion: 2018,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

const settings = {
  react: {
    createClass: 'createClass',
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ settings });
ruleTester.run('no-access-state-in-setstate', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(state => ({value: state.value + 1}))
          }
        });
      `,
      languageOptions,
    },
    {
      code: `
        var Hello = React.createClass({
          multiplyValue: function(obj) {
            return obj.value*2
          },
          onClick: function() {
            var value = this.state.value
            this.multiplyValue({ value: value })
          }
        });
      `,
      languageOptions,
    },
    {
    // issue 1559: don't crash
      code: `
        var SearchForm = createReactClass({
          render: function () {
            return (
              <div>
                {(function () {
                  if (this.state.prompt) {
                    return <div>{this.state.prompt}</div>
                  }
                }).call(this)}
              </div>
            );
          }
        });
      `,
      languageOptions,
    },
    {
    // issue 1604: allow this.state in callback
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({}, () => console.log(this.state));
          }
        });
      `,
      languageOptions,
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({}, () => 1 + 1);
          }
        });
      `,
      languageOptions,
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            var nextValueNotUsed = this.state.value + 1
            var nextValue = 2
            this.setState({value: nextValue})
          }
        });
      `,
      languageOptions,
    },
    {
      // https://github.com/jsx-eslint/eslint-plugin-react/pull/1611
      code: `
        function testFunction({a, b}) {
        };
      `,
      languageOptions,
    },
    {
      code: `
        class ComponentA extends React.Component {
          state = {
            greeting: 'hello',
          };

          myFunc = () => {
            this.setState({ greeting: 'hi' }, () => this.doStuff());
          };

          doStuff = () => {
            console.log(this.state.greeting);
          };
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Foo extends Abstract {
          update = () => {
            const result = this.getResult ( this.state.foo );
            return this.setState ({ result });
          };
        }
      `,
      features: ['class fields'],
      languageOptions,
    },
    {
      code: `
        class StateContainer extends Container {
          anything() {
            return this.setState({value: this.state.value + 1})
          }
        };
      `,
      languageOptions,
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({value: this.state.value + 1})
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(() => ({value: this.state.value + 1}))
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            var nextValue = this.state.value + 1
            this.setState({value: nextValue})
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            var {state, ...rest} = this
            this.setState({value: state.value + 1})
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        function nextState(state) {
          return {value: state.value + 1}
        }
        var Hello = React.createClass({
          onClick: function() {
            this.setState(nextState(this.state))
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(this.state, () => 1 + 1);
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(this.state, () => console.log(this.state));
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        var Hello = React.createClass({
          nextState: function() {
            return {value: this.state.value + 1}
          },
          onClick: function() {
            this.setState(nextState())
          }
        });
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
    {
      code: `
        class Hello extends React.Component {
          onClick() {
            this.setState(this.state, () => console.log(this.state));
          }
        }
      `,
      languageOptions,
      errors: [{ messageId: 'useCallback' }],
    },
  ]),
});
