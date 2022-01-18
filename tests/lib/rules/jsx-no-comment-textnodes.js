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
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-no-comment-textnodes', rule, {
  valid: parsers.all([
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
    },
    {
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
      features: ['fragment'],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>{/* valid */}</div>);
          }
        }
      `,
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{/* valid */}</div>);
            return bar;
          }
        }
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          foo: (<div>{/* valid */}</div>),
          render() {
            return this.foo;
          },
        });
      `,
    },
    {
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
    },
    {
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
    },
    {
      code: `
        var foo = require('foo');
      `,
    },
    {
      code: `
        <Foo bar='test'>
          {/* valid */}
        </Foo>
      `,
    },
    {
      code: `
        <strong>
          &nbsp;https://www.example.com/attachment/download/1
        </strong>
      `,
    },

    // inside element declarations
    {
      code: `
        <Foo /* valid */ placeholder={'foo'}/>
      `,
    },
    {
      code: `
        </* valid */></>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <></* valid *//>
      `,
      features: ['fragment', 'no-ts'], // TODO: FIXME: figure out why both TS parsers fail on this
    },
    {
      code: `
        <Foo title={'foo' /* valid */}/>
      `,
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>',
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>',
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>// invalid</div>);
          }
        }
      `,
      features: ['no-ts-old'], // TODO: FIXME: remove this and figure out why the old TS parser hangs here
      errors: [{ messageId: 'putCommentInBraces' }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<>// invalid</>);
          }
        }
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove this and figure out why the old TS parser hangs here
      errors: [{ messageId: 'putCommentInBraces' }],
    },
    {
      code: `
        class Comp1 extends Component {
          render() {
            return (<div>/* invalid */</div>);
          }
        }
      `,
      features: ['no-ts-old'], // TODO: FIXME: remove this and figure out why the old TS parser hangs here
      errors: [{ messageId: 'putCommentInBraces' }],
    },
    {
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
      errors: [{ messageId: 'putCommentInBraces' }],
    },
    {
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
      errors: [{ messageId: 'putCommentInBraces' }],
    },
    {
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
      errors: [{ messageId: 'putCommentInBraces' }],
    },
    {
      code: `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `,
      features: ['no-ts-old'], // TODO: FIXME: remove this and figure out why the old TS parser hangs here
      errors: [{ messageId: 'putCommentInBraces' }],
    },
  ]),
});
