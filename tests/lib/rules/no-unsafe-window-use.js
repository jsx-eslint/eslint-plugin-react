/**
 * @fileoverview Prevent unsafe window use
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
// Helpers
// ------------------------------------------------------------------------------

function invalid(code, extra) {
  return Object.assign({
    code,
    errors: [{message: 'Unsafe "window" use'}]
  }, extra);
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tests = {
  valid: [
    `
      if (typeof window !== 'undefined') {
        console.log(window)
      }
    `,
    `
      if (typeof window !== 'undefined') {
        if (true) {
          function baz() {
            console.log(window)
          }
        }
      }
    `,
    'typeof window !== "undefined" ? doSomething(window) : null',
    'typeof window !== "undefined" && doSomething(window)',
    `
      class Test {
        doSomething() {
          if (typeof window !== "undefined") {
            window.bar = baz
          }
        }
      }
    `,
    `
      var Test = createReactClass({
        handleClick: function() {
          window.bar = "baz"
        },
        componentDidUpdate: function() {
          window.bar = "baz"
          this.handleClick()
        },
        componentDidMount: function() {
          window.bar = "baz"
          this.handleClick()
        },
        componentWillUnmount: function() {
          window.bar = "baz"
          this.handleClick()
        },
        render: function() {
          return <button onClick={this.handleClick}>Click me!</button>
        }
      });
    `,
    `
      class Test extends React.Component {
        handleClick() {
          window.bar = "baz"
        }
        componentDidUpdate() {
          window.bar = "baz"
          this.handleClick()
        }
        componentDidMount() {
          window.bar = "baz"
          this.handleClick()
        }
        componentWillUnmount() {
          window.bar = "baz"
          this.handleClick()
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      };
    `,
    `
      function Test() {
        function handleClick() {
          window.bar = "baz"
        }
        useEffect(() => {
          window.bar = "baz"
          handleClick()
        })
        useLayoutEffect(() => {
          window.bar = "baz"
          handleClick()
        })
        const callback = useCallback(() => {
          window.bar = "baz"
          handleClick()
        }, [])
        return (
          <div>
            <button onClick={handleClick}>
              Click me!
            </button>
            <button onClick={callback}>
              Click me 2!
            </button>
          </div>
        )
      }
    `,
    `
      var Test = createReactClass({
        handleClick: function() {
          window.bar = "baz"
        },
        otherHandler: function() {
          this.handlerClick()
        },
        render: function() {
          return (
            <div>
              <button onClick={this.handleClick}>Click me!</button>
              <button onClick={this.otherHandler}>Click me 2!</button>
            </div>
          )
        }
      });
    `,
    `
      class Test extends React.Component {
        handleClick() {
          window.bar = "baz"
        }
        otherHandler() {
          this.handlerClick()
        }
        render() {
          return (
            <div>
              <button onClick={this.handleClick}>Click me!</button>
              <button onClick={this.otherHandler}>Click me 2!</button>
            </div>
          )
        }
      };
    `,
    `
      const Test = () => {
        const handleClick = () => {
          window.bar = "baz"
        }
        const otherHandler = () => {
          handlerClick()
        }
        return (
          <div>
            <button onClick={handleClick}>Click me!</button>
            <button onClick={otherHandler}>Click me 2!</button>
          </div>
        )
      };
    `,
    `
      const Test = React.createReactClass({
        handleClick() {
          function some() {
            window.bar = "baz"
          }
          some()
        },
        render() {
          return <button onClick={this.handleClick} />
        }
      });
    `,
    `
      class Test extends React.Component {
        handleClick() {
          function some() {
            window.bar = "baz"
          }
          some()
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      };
    `,
    `
      function Test() {
        const handleClick = () => {
          function some() {
            window.bar = "baz"
          }
          some()
        }
        return <button onClick={handleClick} />
      };
    `,
    `
      const Test = React.createReactClass({
        handleClick() {
          if (typeof window !== 'undefined') {
            window.bar = "baz"
          }
        },
        render() {
          this.handleClick()
          return <button onClick={this.handleClick} />
        }
      });
    `,
    `
      class Test extends React.Component {
        handleClick() {
          if (typeof window !== 'undefined') {
            window.bar = "baz"
          }
        }
        render() {
          this.handleClick()
          return <button onClick={this.handleClick} />
        }
      };
    `,
    `
      const Test = () => {
        function handleClick() {
          if (typeof window !== 'undefined') {
            window.bar = "baz"
          }
        }
        handleClick()
        return (
          <button onClick={handleClick}>
            Click me!
          </button>
        )
      }
    `,
    `
      const Test = React.createReactClass({
        handleClick: function() {
          window.bar = "baz"
        },
        otherHandler: function() {
          if (typeof window !== 'undefined') {
            this.handleClick()
          }
        },
        render() {
          this.otherHandler()
          return <button onClick={this.otherHandler} />
        }
      });
    `,
    `
      class Test extends React.Component {
        handleClick() {
          window.bar = "baz"
        }
        otherHandler() {
          if (typeof window !== 'undefined') {
            this.handleClick()
          }
        }
        render() {
          this.otherHandler()
          return <button onClick={this.otherHandler} />
        }
      };
    `,
    `
      function Test() {
        const handleClick = () => {
          window.bar = "baz"
        }
        const otherHandler = () => {
          if (typeof window !== 'undefined') {
            handleClick()
          }
        }
        otherHandler()
        return <button onClick={otherHandler} />
      };
    `,
    `
      const Test = React.createReactClass({
        render() {
          if (typeof window !== 'undefined') {
            window.bar = "baz"
          }
          return <div />
        }
      })
    `,
    `
      class Test extends React.Component {
        render() {
          if (typeof window !== 'undefined') {
            window.bar = "baz"
          }
          return <div />
        }
      }
    `,
    `
      function Test() {
        if (typeof window !== 'undefined') {
          window.bar = "baz"
        }
        return <div />
      }
    `,
    `
      function Test() {
        useEffect(() => {
          window.bar = "baz"
        })
        useLayoutEffect(() => {
          window.bar = "baz"
        })
      }
    `,
    `
      class Test extends React.Component {
        constructor() {
          super()
          if (typeof window !== 'undefined') {
            window.bar = "baz"
          }
        }
        render() {
          return <div />
        }
      }
    `,
    `
      if (typeof window !== 'undefined') {
        function Test() {
          window.bar = "baz"

          return null;
        }
      }
    `
  ],
  invalid: [
    invalid('console.log(window)'),
    invalid('window.bar = "baz"'),
    invalid(`
      if (typeof window !== 'undefined') {
      } else {
        window.bar = "baz"
      }
    `),
    invalid(`
      function bar() {
        if (true) {
          window.something()
        }
      }
    `),
    invalid(`
      class Test {
        handle() {
          window.bar = "baz"
        }
      }
    `),
    invalid(`
      class Test {
        componentDidMount() {
          window.bar = "baz"
        }
      }
    `),
    invalid('typeof window !== "undefined" ? null : window.thing'),
    invalid('typeof window !== "undefined" || window.bar'),
    invalid(`
      class Test {
        doSomething() {
          window.bar = baz
        }
      }
    `),
    invalid(`
      var Test = createReactClass({
        handleClick: function() {
          window.bar = "baz"
        },
        render: function() {
          this.handleClick()
          return <button onClick={this.handleClick} />
        }
      });
    `),
    invalid(`
      var Test = createReactClass({
        handleClick: function() {
          window.bar = "baz"
        },
        otherHandler: function() {
          this.handleClick()
        },
        render: function() {
          this.otherHandler()
          return <button onClick={this.otherHandler} />
        }
      });
    `),
    {
      code: `
        var Test = createReactClass({
          handleClick: function() {
            window.bar = "baz"
          },
          render: function() {
            this.handleClick()
            return <button onClick={this.handleClick} />
          }
        });
        var Test1 = createReactClass({
          handleClick: function() {
            window.bar = "baz"
          },
          otherHandler: function() {
            this.handleClick()
          },
          render: function() {
            this.otherHandler()
            return <button onClick={this.otherHandler} />
          }
        });
      `,
      errors: [
        {message: 'Unsafe "window" use'},
        {message: 'Unsafe "window" use'}
      ]
    },
    invalid(`
      class Test extends React.Component {
        handleClick() {
          window.bar = "baz"
        }
        render() {
          this.handleClick()
          return <button onClick={this.handleClick} />
        }
      };
    `),
    invalid(`
      class Test extends React.Component {
        handleClick() {
          window.bar = "baz"
        }
        otherHandler() {
          this.handleClick()
        }
        render() {
          this.otherHandler()
          return <button onClick={this.otherHandler} />
        }
      };
    `),
    {
      code: `
        class Test1 extends React.Component {
          handleClick() {
            window.bar = "baz"
          }
          render() {
            this.handleClick()
            return <button onClick={this.handleClick} />
          }
        };
        class Test extends React.Component {
          handleClick() {
            window.bar = "baz"
          }
          otherHandler() {
            this.handleClick()
          }
          render() {
            this.otherHandler()
            return <button onClick={this.otherHandler} />
          }
        };
      `,
      errors: [
        {message: 'Unsafe "window" use'},
        {message: 'Unsafe "window" use'}
      ]
    },
    invalid(`
      function Test() {
        function handleClick() {
          window.bar = "baz"
        }
        handleClick()
        return (
          <button onClick={handleClick}>
            Click me!
          </button>
        )
      }
    `),
    invalid(`
      function Test1() {
        function handleClick() {
          window.bar = "baz"
        }
        function otherHandler() {
          handleClick()
        }
        otherHandler()
        return (
          <button onClick={otherHandler}>
            Click me!
          </button>
        )
      }
    `),
    {
      code: `
        function Test() {
          function handleClick() {
            window.bar = "baz"
          }
          handleClick()
          return (
            <button onClick={handleClick}>
              Click me!
            </button>
          )
        }
        function Test1() {
          function handleClick() {
            window.bar = "baz"
          }
          function otherHandler() {
            handleClick()
          }
          otherHandler()
          return (
            <button onClick={otherHandler}>
              Click me!
            </button>
          )
        }
      `,
      errors: [
        {message: 'Unsafe "window" use'},
        {message: 'Unsafe "window" use'}
      ]
    },
    invalid(`
      function Test() {
        const val = useMemo(() => window.baz, [])
        return val
      }
    `),
    invalid(`
      function Test() {
        const val = useMemo(() => window.baz, [])
        return <div>{val}</div>
      }
    `),
    invalid(`
      class Test extends React.Component {
        constructor() {
          super()
          window.bar = "baz"
        }
        render() {
          return <div />
        }
      };
    `),
    invalid(`
      class Test extends React.Component {
        render() {
          window.bar = "baz";
          return <div />
        }
      };
    `),
    invalid(`
      class Test extends React.Component {
        constructor(props) {
          super(props)
          this.handler()
        }
        handler() {
          window.bar = "baz"
        }
        render() {
          return <div />
        }
      };
    `),
    invalid(`
      const Test = () => window && <div />
    `)
  ]
};

const advanceFeatTests = {
  valid: [
    `
      class Test extends React.Component {
        handleClick = () => {
          window.bar = "baz"
        }
        componentDidUpdate = () => {
          window.bar = "baz"
          this.handleClick()
        }
        componentDidMount = () => {
          window.bar = "baz"
          this.handleClick()
        }
        componentWillUnmount = () => {
          window.bar = "baz"
          this.handleClick()
        }
        render() {
          return <button onClick={this.handleClick} />
        }
      };
    `,
    `
      class Test extends React.Component {
        handleClick = () => {
          window.bar = "baz"
        }
        otherHandler = () => {
          this.handleClick()
        }
        render() {
          return <button onClick={this.otherHandler} />
        }
      };
    `
  ],
  invalid: [
    invalid(`
      class Test extends React.Component {
        handleClick = () => {
          window.bar = "baz"
        }
        otherHandler = () => {
          this.handleClick()
        }
        render() {
          this.otherHandler()
          return <button onClick={this.otherHandler} />
        }
      };
    `)
  ]
};

// Run tests with default parser
new RuleTester({parserOptions}).run('no-unsafe-window-use', rule, tests);

// Run tests with babel parser
let ruleTester = new RuleTester({parserOptions, parser: parsers.BABEL_ESLINT});
ruleTester.run('no-unsafe-window-use', rule, tests);
ruleTester.run('no-unsafe-window-use', rule, advanceFeatTests);

// Run tests with typescript parser
// For some reason ESLint doesn't call the visitor for detecting 'window'
// when the class property initializer syntax is used with the TypeScript parser.
// Advance feature tests skipped.
new RuleTester({parserOptions, parser: parsers.TYPESCRIPT_ESLINT})
  .run('no-unsafe-window-use', rule, tests);

ruleTester = new RuleTester({parserOptions, parser: parsers['@TYPESCRIPT_ESLINT']});
ruleTester.run('no-unsafe-window-use', rule, {
  valid: parsers.TS(tests.valid),
  invalid: parsers.TS(tests.invalid)
});
ruleTester.run('no-unsafe-window-use', rule, {
  valid: parsers.TS(advanceFeatTests.valid),
  invalid: parsers.TS(advanceFeatTests.invalid)
});
