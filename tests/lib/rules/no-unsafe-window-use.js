/**
 * @fileoverview Rule to avoid unsafe global window use
 * @author Johnny Zabala
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unsafe-window-use');
const parsers = require('../../helpers/parsers');

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

function invalid(code, extra = {}) {
  return Object.assign({
    code,
    errors: [{message: 'Unsafe "window" use'}]
  }, extra);
}

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unsafe-window-use', rule, {
  valid: [
    `if (typeof window !== 'undefined') {
      console.log(window)
    }`,
    'typeof window !== "undefined" ? doSomething(window) : null',
    'typeof window !== "undefined" && window',
    `
      var Test = createReactClass({
        componentDidUpdate: function() {
          window
        },
        componentDidMount: function() {
          window
        },
        componentWillUnmount: function() {
          window
        },
      });
    `,
    `
      class Test extends React.Component {
        componentDidUpdate() {
          window
        }
        componentDidMount() {
          window
        }
        componentWillUnmount() {
          window
        }
      };
    `,
    {
      code: `
        class Test extends React.Component {
          componentDidUpdate = () => {
            window
          }
          componentDidMount = () => {
            window
          }
          componentWillUnmount = () => {
            window
          }
        };
      `,
      parser: parsers.BABEL_ESLINT
    },
    `
      function Render() {
        useEffect(() => {
          window
        })
        return null;
      }
    `,
    `
      function Render() {
        useLayoutEffect(() => {
          window
        })
        return null;
      }
    `,
    `
      var Test = createReactClass({
        handleClick: function() {
          window
        },
        otherHandler: function() {
          this.handleClick
        },
        render: function() {
          return <button onClick={this.handleClick} />
        }
      });
    `,
    `
      class Test extends React.Component {
        handleClick() {
          window
        }
        componentDidMount() {
          this.handleClick()
        }
        otherHandler() {
          this.handleClick
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      };
    `
  ],
  invalid: [
    invalid('if (window === blue) {}'),
    invalid(`
      if (typeof window !== 'undefined') {
      } else {
        window
      }
    `),
    invalid('typeof window !== "undefined" ? null : window'),
    invalid('typeof window !== "undefined" || window'),
    invalid('window'),
    invalid(`
      var Test = createReactClass({
        handleClick: function() {
          window
        },
        otherHandler: function() {
          this.handleClick()
        },
        render: function() {
          return <button onClick={this.handleClick} />
        }
      });
    `),
    invalid(`
      class Test extends React.Component {
        handleClick() {
          window
        }
        otherHandler() {
          this.handleClick()
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      }
    `),
    {
      code: `
        class Test extends React.Component {
          handleClick() {
            window
          }
          otherHandler() {
            this.handleClick()
          }
          render() {
            return <button onClick={this.handleClick} />
          }
        };
        class Test1 extends React.Component {
          handleClick() {
            window
          }
          otherHandler() {
            this.handleClick()
          }
          render() {
            return <button onClick={this.handleClick} />
          }
        };
      `,
      errors: [
        {message: 'Unsafe "window" use'},
        {message: 'Unsafe "window" use'}
      ]
    },
    invalid(`
      class Test extends React.Component {
        handleClick() {
          window
        }
        otherHandler() {
          this.handleClick
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      };
      class Test1 extends React.Component {
        handleClick() {
          window
        }
        otherHandler() {
          this.handleClick()
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      };
    `)
  ]
});
