/**
 * @fileoverview Tests for jsx-no-comment-textnodes
 * @author Ben Vinegar
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-comment-textnodes');
const RuleTester = require('eslint').RuleTester;

const {BABEL_ESLINT} = require('../../helpers/parsers');

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
ruleTester.run('jsx-no-comment-textnodes', rule, {

  valid: [
    {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <div>
              {/* valid */}
            </div>
          );
        }
      }
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <>
              {/* valid */}
            </>
          );
        }
      }
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>{/* valid */}</div>);
        }
      }
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          const bar = (<div>{/* valid */}</div>);
          return bar;
        }
      }
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      var Hello = createReactClass({
        foo: (<div>{/* valid */}</div>),
        render() {
          return this.foo;
        },
      });
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <div>
              {/* valid */}
              {/* valid 2 */}
              {/* valid 3 */}
            </div>
          );
        }
      }
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <div>
            </div>
          );
        }
      }
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      var foo = require('foo');
    `,
      parser: BABEL_ESLINT
    }, {
      code: `
      <Foo bar='test'>
        {/* valid */}
      </Foo>
    `,
      parser: BABEL_ESLINT
    },
    {
      code: `
      <strong>
        &nbsp;https://www.example.com/attachment/download/1
      </strong>
    `,
      parser: BABEL_ESLINT
    },

    // inside element declarations
    {
      code: `
      <Foo /* valid */ placeholder={'foo'}/>
    `,
      parser: BABEL_ESLINT
    },
    {
      code: `
      </* valid */></>
    `,
      parser: BABEL_ESLINT
    },
    {
      code: `
      <></* valid *//>
    `,
      parser: BABEL_ESLINT
    },
    {
      code: `
      <Foo title={'foo' /* valid */}/>
    `,
      parser: BABEL_ESLINT
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>'
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>',
      parser: BABEL_ESLINT
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>'
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>',
      parser: BABEL_ESLINT
    }
  ],

  invalid: [
    {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>// invalid</div>);
        }
      }
    `,
      parser: BABEL_ESLINT,
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<>// invalid</>);
        }
      }
    `,
      parser: BABEL_ESLINT,
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>/* invalid */</div>);
        }
      }
    `,
      parser: BABEL_ESLINT,
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <div>
              // invalid
            </div>
          );
        }
      }
    `,
      parser: BABEL_ESLINT,
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <div>
              asdjfl
              /* invalid */
              foo
            </div>
          );
        }
      }
    `,
      parser: BABEL_ESLINT,
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (
            <div>
              {'asdjfl'}
              // invalid
              {'foo'}
            </div>
          );
        }
      }
    `,
      parser: BABEL_ESLINT,
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }
  ]
});
