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
      parser: 'babel-eslint'
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
      parser: 'babel-eslint'
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>{/* valid */}</div>);
        }
      }
    `,
      parser: 'babel-eslint'
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          const bar = (<div>{/* valid */}</div>);
          return bar;
        }
      }
    `,
      parser: 'babel-eslint'
    }, {
      code: `
      var Hello = createReactClass({
        foo: (<div>{/* valid */}</div>),
        render() {
          return this.foo;
        },
      });
    `,
      parser: 'babel-eslint'
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
      parser: 'babel-eslint'
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
      parser: 'babel-eslint'
    }, {
      code: `
      var foo = require('foo');
    `,
      parser: 'babel-eslint'
    }, {
      code: `
      <Foo bar='test'>
        {/* valid */}
      </Foo>
    `,
      parser: 'babel-eslint'
    },
    {
      code: `
      <strong>
        &nbsp;https://www.example.com/attachment/download/1
      </strong>
    `,
      parser: 'babel-eslint'
    },

    // inside element declarations
    {
      code: `
      <Foo /* valid */ placeholder={'foo'}/>
    `,
      parser: 'babel-eslint'
    },
    {
      code: `
      </* valid */></>
    `,
      parser: 'babel-eslint'
    },
    {
      code: `
      <></* valid *//>
    `,
      parser: 'babel-eslint'
    },
    {
      code: `
      <Foo title={'foo' /* valid */}/>
    `,
      parser: 'babel-eslint'
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>'
    },
    {
      code: '<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>',
      parser: 'babel-eslint'
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>'
    },
    {
      code: '<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>',
      parser: 'babel-eslint'
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
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<>// invalid</>);
        }
      }
    `,
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }, {
      code: `
      class Comp1 extends Component {
        render() {
          return (<div>/* invalid */</div>);
        }
      }
    `,
      parser: 'babel-eslint',
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
      parser: 'babel-eslint',
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
      parser: 'babel-eslint',
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
      parser: 'babel-eslint',
      errors: [{message: 'Comments inside children section of tag should be placed inside braces'}]
    }
  ]
});
