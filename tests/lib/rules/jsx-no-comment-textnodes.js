/**
 * @fileoverview Tests for jsx-no-comment-textnodes
 * @author Ben Vinegar
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-comment-textnodes');

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
      parser: parsers.BABEL_ESLINT
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
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>{/* valid */}</div>);
        }
      }
    `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          const bar = (<div>{/* valid */}</div>);
          return bar;
        }
      }
    `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
      var Hello = createReactClass({
        foo: (<div>{/* valid */}</div>),
        render() {
          return this.foo;
        },
      });
    `,
      parser: parsers.BABEL_ESLINT
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
      parser: parsers.BABEL_ESLINT
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
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
      var foo = require('foo');
    `,
      parser: parsers.BABEL_ESLINT
    }, {
      code: `
      <Foo bar='test'>
        {/* valid */}
      </Foo>
    `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
      <strong>
        &nbsp;https://www.example.com/attachment/download/1
      </strong>
    `,
      parser: parsers.BABEL_ESLINT
    },

    // inside element declarations
    {
      code: `
      <Foo /* valid */ placeholder={'foo'}/>
    `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
      </* valid */></>
    `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
      <></* valid *//>
    `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: `
      <Foo title={'foo' /* valid */}/>
    `,
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>'
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>',
      parser: parsers.BABEL_ESLINT
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>'
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>',
      parser: parsers.BABEL_ESLINT
    }
  ].concat(parsers.TS([
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
      parser: parsers['@TYPESCRIPT_ESLINT']
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
      parser: parsers['@TYPESCRIPT_ESLINT']
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>{/* valid */}</div>);
        }
      }
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          const bar = (<div>{/* valid */}</div>);
          return bar;
        }
      }
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    }, {
      code: `
      var Hello = createReactClass({
        foo: (<div>{/* valid */}</div>),
        render() {
          return this.foo;
        },
      });
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
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
      parser: parsers['@TYPESCRIPT_ESLINT']
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
      parser: parsers['@TYPESCRIPT_ESLINT']
    }, {
      code: `
      var foo = require('foo');
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    }, {
      code: `
      <Foo bar='test'>
        {/* valid */}
      </Foo>
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    },
    {
      code: `
      <strong>
        &nbsp;https://www.example.com/attachment/download/1
      </strong>
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    },

    // inside element declarations
    {
      code: `
      <Foo /* valid */ placeholder={'foo'}/>
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    },
    {
      code: `
      <Foo title={'foo' /* valid */}/>
    `,
      parser: parsers['@TYPESCRIPT_ESLINT']
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>',
      parser: parsers['@TYPESCRIPT_ESLINT']
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>',
      parser: parsers['@TYPESCRIPT_ESLINT']
    }
  ])),

  invalid: [
    {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>// invalid</div>);
        }
      }
    `,
      parser: parsers.BABEL_ESLINT,
      errors: [{messageId: 'putCommentInBraces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<>// invalid</>);
        }
      }
    `,
      parser: parsers.BABEL_ESLINT,
      errors: [{messageId: 'putCommentInBraces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>/* invalid */</div>);
        }
      }
    `,
      parser: parsers.BABEL_ESLINT,
      errors: [{messageId: 'putCommentInBraces'}]
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
      parser: parsers.BABEL_ESLINT,
      errors: [{messageId: 'putCommentInBraces'}]
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
      parser: parsers.BABEL_ESLINT,
      errors: [{messageId: 'putCommentInBraces'}]
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
      parser: parsers.BABEL_ESLINT,
      errors: [{messageId: 'putCommentInBraces'}]
    },
    {
      code: `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `,
      errors: [{messageId: 'putCommentInBraces'}]
    }
  ].concat(parsers.TS([
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>// invalid</div>);
          }
        }
      `,
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [{messageId: 'putCommentInBraces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<>// invalid</>);
        }
      }
    `,
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [{messageId: 'putCommentInBraces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>/* invalid */</div>);
        }
      }
    `,
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [{messageId: 'putCommentInBraces'}]
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
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [{messageId: 'putCommentInBraces'}]
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
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [{messageId: 'putCommentInBraces'}]
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
      parser: parsers['@TYPESCRIPT_ESLINT'],
      errors: [{messageId: 'putCommentInBraces'}]
    }
  ]))
});
