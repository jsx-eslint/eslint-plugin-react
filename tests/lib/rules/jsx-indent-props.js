/**
 * @fileoverview Validate props indentation in JSX
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-indent-props');

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
ruleTester.run('jsx-indent-props', rule, {
  valid: parsers.all([
    {
      code: `
        <App foo
        />
      `,
    },
    {
      code: `
        <App
          foo
        />
      `,
      options: [2],
    },
    {
      code: `
        const Test = () => ([
          (x
            ? <div key="1" />
            : <div key="2" />),
          <div
            key="3"
            align="left"
          />,
          <div
            key="4"
            align="left"
          />,
        ]);
      `,
      options: [2],
    },
    {
      code: `
        <App
        foo
        />
      `,
      options: [0],
    },
    {
      code: `
          <App
        foo
          />
      `,
      options: [-2],
    },
    {
      code: `
\t\t\t\t<App
\t\t\t\t\tfoo
\t\t\t\t/>
\t\t\t`,
      options: ['tab'],
    },
    {
      code: `
        <App/>
      `,
      options: ['first'],
    },
    {
      code: `
        <App aaa
             b
             cc
        />
      `,
      options: ['first'],
    },
    {
      code: `
        <App   aaa
               b
               cc
        />
      `,
      options: ['first'],
    },
    {
      code: `
        const test = <App aaa
                          b
                          cc
                     />
      `,
      options: ['first'],
    },
    {
      code: `
        <App aaa x
             b y
             cc
        />
      `,
      options: ['first'],
    },
    {
      code: `
        const test = <App aaa x
                          b y
                          cc
                     />
      `,
      options: ['first'],
    },
    {
      code: `
        <App aaa
             b
        >
            <Child c
                   d/>
        </App>
      `,
      options: ['first'],
    },
    {
      code: `
        <Fragment>
          <App aaa
               b
               cc
          />
          <OtherApp a
                    bbb
                    c
          />
        </Fragment>
      `,
      options: ['first'],
    },
    {
      code: `
        <App
          a
          b
        />
      `,
      options: ['first'],
    },
    {
      code: `
        {this.props.ignoreTernaryOperatorFalse
          ? <span
              className="value"
              some={{aaa}}
            />
          : null}
      `,
      output: `
        {this.props.ignoreTernaryOperatorFalse
          ? <span
            className="value"
            some={{aaa}}
          />
          : null}
      `,
      options: [
        {
          indentMode: 2,
          ignoreTernaryOperator: false,
        },
      ],
    },
    {
      code: `
        const F = () => {
          const foo = true
            ? <div id="id">test</div>
            : false;

          return <div
            id="id"
          >
            test
          </div>
        }
      `,
      options: [
        {
          indentMode: 2,
          ignoreTernaryOperator: false,
        },
      ],
    },
    {
      code: `
        const F = () => {
          const foo = true
            ? <div id="id">test</div>
            : false;

          return <div
            id="id"
          >
            test
          </div>
        }
      `,
      options: [
        {
          indentMode: 2,
          ignoreTernaryOperator: true,
        },
      ],
    },
    {
      code: `
\t\t\t\tconst F = () => {
\t\t\t\t\tconst foo = true
\t\t\t\t\t\t? <div id="id">test</div>
\t\t\t\t\t\t: false;

\t\t\t\t\treturn <div
\t\t\t\t\t\tid="id"
\t\t\t\t\t>
\t\t\t\t\t\ttest
\t\t\t\t\t</div>
\t\t\t\t}
`,
      options: [
        {
          indentMode: 'tab',
          ignoreTernaryOperator: false,
        },
      ],
    },
    {
      code: `
\t\t\t\tconst F = () => {
\t\t\t\t\tconst foo = true
\t\t\t\t\t\t? <div id="id">test</div>
\t\t\t\t\t\t: false;

\t\t\t\t\treturn <div
\t\t\t\t\t\tid="id"
\t\t\t\t\t>
\t\t\t\t\t\ttest
\t\t\t\t\t</div>
\t\t\t\t}
`,
      options: [
        {
          indentMode: 'tab',
          ignoreTernaryOperator: true,
        },
      ],
    },
    {
      code: `
        {this.props.ignoreTernaryOperatorTrue
          ? <span
            className="value"
            some={{aaa}}
            />
          : null}
      `,
      output: `
        {this.props.ignoreTernaryOperatorTrue
          ? <span
            className="value"
            some={{aaa}}
          />
          : null}
      `,
      options: [
        {
          indentMode: 2,
          ignoreTernaryOperator: true,
        },
      ],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        <App
          foo
        />
      `,
      output: `
        <App
            foo
        />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 10,
          },
        },
      ],
    },
    {
      code: `
        <App
            foo
        />
      `,
      output: `
        <App
          foo
        />
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 10,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        const test = true
          ? <span
            attr="value"
            />
          : <span
            attr="otherValue"
            />
      `,
      output: `
        const test = true
          ? <span
              attr="value"
            />
          : <span
              attr="otherValue"
            />
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        const test = true
          ? <span attr="value" />
          : (
            <span
                attr="otherValue"
            />
          )
      `,
      output: `
        const test = true
          ? <span attr="value" />
          : (
            <span
              attr="otherValue"
            />
          )
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 16,
          },
        },
      ],
    },
    {
      code: `
        {test.isLoading
          ? <Value/>
          : <OtherValue
            some={aaa}/>
        }
      `,
      output: `
        {test.isLoading
          ? <Value/>
          : <OtherValue
              some={aaa}/>
        }
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        {test.isLoading
          ? <Value/>
          : <OtherValue
            some={aaa}
            other={bbb}/>
        }
      `,
      output: `
        {test.isLoading
          ? <Value/>
          : <OtherValue
              some={aaa}
              other={bbb}/>
        }
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        {this.props.test
          ? <span
            className="value"
            some={{aaa}}
            />
          : null}
      `,
      output: `
        {this.props.test
          ? <span
              className="value"
              some={{aaa}}
            />
          : null}
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        <App1
            foo
        />
      `,
      output: `
        <App1
\tfoo
        />
      `,
      options: ['tab'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 1,
            type: 'tab',
            characters: 'character',
            gotten: 0,
          },
        },
      ],
    },
    {
      code: `
\t\t\t\t<App
\t\t\t\t\t\t\tfoo
\t\t\t\t/>
\t\t\t`,
      output: `
\t\t\t\t<App
\t\t\t\t\tfoo
\t\t\t\t/>
\t\t\t`,
      options: ['tab'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 5,
            type: 'tab',
            characters: 'characters',
            gotten: 7,
          },
        },
      ],
    },
    {
      code: `
        <App a
          b
        />
      `,
      output: `
        <App a
             b
        />
      `,
      options: ['first'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 13,
            type: 'space',
            characters: 'characters',
            gotten: 10,
          },
        },
      ],
    },
    {
      code: `
        <App  a
           b
        />
      `,
      output: `
        <App  a
              b
        />
      `,
      options: ['first'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
      ],
    },
    {
      code: `
        <App
              a
           b
        />
      `,
      output: `
        <App
              a
              b
        />
      `,
      options: ['first'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 14,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
      ],
    },
    {
      code: `
        <App
          a
         b
           c
        />
      `,
      output: `
        <App
          a
          b
          c
        />
      `,
      options: ['first'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 10,
            type: 'space',
            characters: 'characters',
            gotten: 9,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 10,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
      ],
    },
    {
      code: `
        const F = () => {
          const foo = true
            ? <div id="id">test</div>
            : false;

          return <div
              id="id"
          >
            test
          </div>
        }
      `,
      output: `
        const F = () => {
          const foo = true
            ? <div id="id">test</div>
            : false;

          return <div
            id="id"
          >
            test
          </div>
        }
      `,
      options: [
        {
          indentMode: 2,
          ignoreTernaryOperator: false,
        },
      ],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 14,
          },
        },
      ],
    },
    {
      code: `
        const F = () => {
          const foo = true
            ? <div id="id">test</div>
            : false;

          return <div
              id="id"
          >
            test
          </div>
        }
      `,
      output: `
        const F = () => {
          const foo = true
            ? <div id="id">test</div>
            : false;

          return <div
            id="id"
          >
            test
          </div>
        }
      `,
      options: [
        {
          indentMode: 2,
          ignoreTernaryOperator: true,
        },
      ],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 14,
          },
        },
      ],
    },
    {
      code: `
\t\t\t\tconst F = () => {
\t\t\t\t\tconst foo = true
\t\t\t\t\t\t? <div id="id">test</div>
\t\t\t\t\t\t: false;

\t\t\t\t\treturn <div
\t\t\t\t\t\t\tid="id"
\t\t\t\t\t>
\t\t\t\t\t\ttest
\t\t\t\t\t</div>
\t\t\t\t}
`,
      output: `
\t\t\t\tconst F = () => {
\t\t\t\t\tconst foo = true
\t\t\t\t\t\t? <div id="id">test</div>
\t\t\t\t\t\t: false;

\t\t\t\t\treturn <div
\t\t\t\t\t\tid="id"
\t\t\t\t\t>
\t\t\t\t\t\ttest
\t\t\t\t\t</div>
\t\t\t\t}
`,
      options: [
        {
          indentMode: 'tab',
          ignoreTernaryOperator: false,
        },
      ],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 6,
            type: 'tab',
            characters: 'characters',
            gotten: 7,
          },
        },
      ],
    },
    {
      code: `
\t\t\t\tconst F = () => {
\t\t\t\t\tconst foo = true
\t\t\t\t\t\t? <div id="id">test</div>
\t\t\t\t\t\t: false;

\t\t\t\t\treturn <div
\t\t\t\t\t\t\tid="id"
\t\t\t\t\t>
\t\t\t\t\t\ttest
\t\t\t\t\t</div>
\t\t\t\t}
`,
      output: `
\t\t\t\tconst F = () => {
\t\t\t\t\tconst foo = true
\t\t\t\t\t\t? <div id="id">test</div>
\t\t\t\t\t\t: false;

\t\t\t\t\treturn <div
\t\t\t\t\t\tid="id"
\t\t\t\t\t>
\t\t\t\t\t\ttest
\t\t\t\t\t</div>
\t\t\t\t}
`,
      options: [
        {
          indentMode: 'tab',
          ignoreTernaryOperator: true,
        },
      ],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 6,
            type: 'tab',
            characters: 'characters',
            gotten: 7,
          },
        },
      ],
    },
  ]),
});
