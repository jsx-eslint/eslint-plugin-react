/**
 * @fileoverview Validate JSX indentation
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-indent');

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
ruleTester.run('jsx-indent', rule, {
  valid: [
    {
      code: `
        <App></App>
      `,
    },
    {
      code: `
        <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <App>
        </App>
      `,
    },
    {
      code: `
        <>
        </>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <App>
          <Foo />
        </App>
      `,
      options: [2],
    },
    {
      code: `
        <App>
          <></>
        </App>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        <>
          <Foo />
        </>
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        <App>
        <Foo />
        </App>
      `,
      options: [0],
    },
    {
      code: `
          <App>
        <Foo />
          </App>
      `,
      options: [-2],
    },
    {
      code: [
        '<App>',
        '\t<Foo />',
        '</App>',
      ].join('\n'),
      options: ['tab'],
    },
    {
      code: `
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return <App>
            <></>
          </App>;
        }
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        function App() {
          return (<App>
            <Foo />
          </App>);
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return (<App>
            <></>
          </App>);
        }
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        function App() {
          return (
            <App>
              <Foo />
            </App>
          );
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return (
            <App>
              <></>
            </App>
          );
        }
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        it(
          (
            <div>
              <span />
            </div>
          )
        )
      `,
      options: [2],
    },
    {
      code: `
        it(
          (
            <div>
              <></>
            </div>
          )
        )
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        it(
          (<div>
            <span />
            <span />
            <span />
          </div>)
        )
      `,
      options: [2],
    },
    {
      code: `
        (
          <div>
            <span />
          </div>
        )
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title &&
          <h1>
            {head.title}
          </h1>
        }
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title &&
          <>
            {head.title}
          </>
        }
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        {
          head.title &&
            <h1>
              {head.title}
            </h1>
        }
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title && (
          <h1>
            {head.title}
          </h1>)
        }
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title && (
            <h1>
              {head.title}
            </h1>
          )
        }
      `,
      options: [2],
    },
    {
      code: `
        [
          <div />,
          <div />
        ]
      `,
      options: [2],
    },
    {
      code: `
        [
          <></>,
          <></>
        ]
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        <div>
            {
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
    },
    {
      code: `
        <div>
            {foo &&
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
    },
    {
      code: `
        <div>
            {foo &&
                [
                    <></>,
                    <></>
                ]
            }
        </div>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <div>
            bar <div>
                bar
                bar {foo}
                bar </div>
        </div>
      `,
    },
    {
      code: `
        <>
            bar <>
                bar
                bar {foo}
                bar </>
        </>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression)
      code: `
        foo ?
            <Foo /> :
            <Bar />
      `,
    },
    {
      code: `
        foo ?
            <></> :
            <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon at the start of the second expression)
      code: `
        foo ?
            <Foo />
            : <Bar />
      `,
    },
    {
      code: `
        foo ?
            <></>
            : <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon on its own line)
      code: `
        foo ?
            <Foo />
        :
            <Bar />
      `,
    },
    {
      code: `
        foo ?
            <></>
        :
            <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (multiline JSX, colon on its own line)
      code: `
        {!foo ?
            <Foo
                onClick={this.onClick}
            />
        :
            <Bar
                onClick={this.onClick}
            />
        }
      `,
    },
    {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression)
      code: `
        foo ? <Foo /> :
        <Bar />
      `,
    },
    {
      code: `
        foo ? <></> :
        <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression)
      code: `
        foo ? <Foo />
        : <Bar />
      `,
    },
    {
      code: `
        foo ? <></>
        : <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (first expression on test line, colon on its own line)
      code: `
        foo ? <Foo />
        :
        <Bar />
      `,
    },
    {
      code: `
        foo ? <></>
        :
        <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        ) :
            <Bar />
      `,
    },
    {
      code: `
        foo ? (
            <></>
        ) :
            <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon at the start of the second expression, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        )
            : <Bar />
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
            : <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon on its own line, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        )
        :
            <Bar />
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
        :
            <></>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ?
            <Foo /> : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ?
            <></> : (
                <></>
            )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
        : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ?
            <></>
        : (
            <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon indented on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
            : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ?
            <></>
            : (
                <></>
            )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression, both expression parenthesized)
      code: `
        foo ? (
            <Foo />
        ) : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? (
            <></>
        ) : (
            <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
            <Foo />
        )
        : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
        : (
            <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
            <Foo />
        )
        :
        (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
        :
        (
            <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ? <Foo /> : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? <></> : (
            <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression, parenthesized second expression)
      code: `
        foo ? <Foo />
        : (<Bar />)
      `,
    },
    {
      code: `
        foo ? <></>
        : (<></>)
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
    // Multiline ternary
    // (first expression on test line, colon on its own line, parenthesized second expression)
      code: `
        foo ? <Foo />
        : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? <></>
        : (
            <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
          {condition ?
            <Thing
              foo={\`bar\`}
            /> :
            <Thing/>
          }
        </span>
      `,
      options: [2],
    },
    {
      code: `
        <span>
          {condition ?
            <Thing
              foo={"bar"}
            /> :
            <Thing/>
          }
        </span>
      `,
      options: [2],
    },
    {
      code: `
        function foo() {
          <span>
            {condition ?
              <Thing
                foo={superFoo}
              /> :
              <Thing/>
            }
          </span>
        }
      `,
      options: [2],
    },
    {
      code: `
        function foo() {
          <span>
            {condition ?
              <Thing
                foo={superFoo}
              /> :
              <></>
            }
          </span>
        }
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        <span>
            {do {
                const num = rollDice();
                <Thing num={num} />;
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {(do {
                const num = rollDice();
                <Thing num={num} />;
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {do {
                const purposeOfLife = getPurposeOfLife();
                if (purposeOfLife == 42) {
                    <Thing />;
                } else {
                    <AnotherThing />;
                }
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {(do {
                const purposeOfLife = getPurposeOfLife();
                if (purposeOfLife == 42) {
                    <Thing />;
                } else {
                    <AnotherThing />;
                }
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {do {
                <Thing num={rollDice()} />;
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {(do {
                <Thing num={rollDice()} />;
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {do {
                <Thing num={rollDice()} />;
                <Thing num={rollDice()} />;
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {(do {
                <Thing num={rollDice()} />;
                <Thing num={rollDice()} />;
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {do {
                const purposeOfLife = 42;
                <Thing num={purposeOfLife} />;
                <Thing num={purposeOfLife} />;
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        <span>
            {(do {
                const purposeOfLife = 42;
                <Thing num={purposeOfLife} />;
                <Thing num={purposeOfLife} />;
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Test extends React.Component {
          render() {
            return (
              <div>
                <div />
                <div />
              </div>
            );
          }
        }
      `,
      options: [2],
    },
    {
      code: `
        class Test extends React.Component {
          render() {
            return (
              <>
                <></>
                <></>
              </>
            );
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      options: [2],
    },
    {
      code: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
        )}
          />
        );
      `,
      output: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
            )}
          />
        );
      `,
      options: [2],
    },
    {
      code: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
)}
\t/>
);
    `,
      output: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
\t\t)}
\t/>
);
    `,
      options: ['tab'],
    },
    {
      code: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
        )}
          />
        );
      `,
      output: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
            )}
          />
        );
      `,
      options: [2, { checkAttributes: false }],
    },
    {
      code: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
)}
\t/>
);
    `,
      output: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
\t\t)}
\t/>
);
    `,
      options: ['tab', { checkAttributes: false }],
    },
    {
      code: `
        function Foo() {
          return (
            <input
              type="radio"
              defaultChecked
            />
          );
        }
      `,
      options: [2, { checkAttributes: true }],
    },
    {
      code: `
        function Foo() {
          return (
            <div>
              {condition && (
                <p>Bar</p>
              )}
            </div>
          );
        }
      `,
      options: [2, { indentLogicalExpressions: true }],
    },
    {
      code: `
        <App>
            text
        </App>
      `,
    },
    {
      code: `
        <App>
            text
            text
            text
        </App>
      `,
    },
    {
      code: [
        '<App>',
        '\ttext',
        '</App>',
      ].join('\n'),
      options: ['tab'],
    },
    {
      code: [
        '<App>',
        '\t{undefined}',
        '\t{null}',
        '\t{true}',
        '\t{false}',
        '\t{42}',
        '\t{NaN}',
        '\t{"foo"}',
        '</App>',
      ].join('\n'),
      options: ['tab'],
    },
    {
    // don't check literals not within JSX. See #2563
      code: `
        function foo() {
        const a = \`aa\`;
        const b = \`b\nb\`;
        }
      `,
    },
  ],

  invalid: [
    {
      code: `
        <div>
        bar <div>
           bar
           bar {foo}
           bar </div>
        </div>
      `,
      output: `
        <div>
            bar <div>
            bar
            bar {foo}
            bar </div>
        </div>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
      ],
    },
    {
      code: `
        <App>
          <Foo />
        </App>
      `,
      output: `
        <App>
            <Foo />
        </App>
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
        <App>
          <></>
        </App>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        <App>
            <></>
        </App>
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
        <>
          <Foo />
        </>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        <>
            <Foo />
        </>
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
        <App>
            <Foo />
        </App>
      `,
      output: `
        <App>
          <Foo />
        </App>
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
      code: [
        '<App>',
        '    <Foo />',
        '</App>',
      ].join('\n'),
      output: [
        '<App>',
        '\t<Foo />',
        '</App>',
      ].join('\n'),
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
        function App() {
          return <App>
            <Foo />
                 </App>;
        }
      `,
      output: `
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 10,
            type: 'space',
            characters: 'characters',
            gotten: 17,
          },
        },
      ],
    },
    {
      code: `
        function App() {
          return (<App>
            <Foo />
            </App>);
        }
      `,
      output: `
        function App() {
          return (<App>
            <Foo />
          </App>);
        }
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
        function App() {
          return (
        <App>
          <Foo />
        </App>
          );
        }
      `,
      // The detection logic only thinks <App> is indented wrong, not the other
      // two lines following. I *think* because it incorrectly uses <App>'s indention
      // as the baseline for the next two, instead of the realizing the entire three
      // lines are wrong together. See #608
      output: `
        function App() {
          return (
            <App>
          <Foo />
        </App>
          );
        }
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        <App>
           {test}
        </App>
      `,
      output: `
        <App>
            {test}
        </App>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 11,
          },
        },
      ],
    },
    {
      code: `
        <App>
            {options.map((option, index) => (
                <option key={index} value={option.key}>
                   {option.name}
                </option>
            ))}
        </App>
      `,
      output: `
        <App>
            {options.map((option, index) => (
                <option key={index} value={option.key}>
                    {option.name}
                </option>
            ))}
        </App>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 20,
            type: 'space',
            characters: 'characters',
            gotten: 19,
          },
        },
      ],
    },
    {
      code: [
        '<App>',
        '{test}',
        '</App>',
      ].join('\n'),
      output: [
        '<App>',
        '\t{test}',
        '</App>',
      ].join('\n'),
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
      code: [
        '<App>',
        '\t{options.map((option, index) => (',
        '\t\t<option key={index} value={option.key}>',
        '\t\t{option.name}',
        '\t\t</option>',
        '\t))}',
        '</App>',
      ].join('\n'),
      output: [
        '<App>',
        '\t{options.map((option, index) => (',
        '\t\t<option key={index} value={option.key}>',
        '\t\t\t{option.name}',
        '\t\t</option>',
        '\t))}',
        '</App>',
      ].join('\n'),
      options: ['tab'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 3,
            type: 'tab',
            characters: 'characters',
            gotten: 2,
          },
        },
      ],
    },
    {
      code: [
        '<App>\n',
        '<Foo />\n',
        '</App>',
      ].join('\n'),
      output: [
        '<App>\n',
        '\t<Foo />\n',
        '</App>',
      ].join('\n'),
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
        [
          <div />,
            <div />
        ]
      `,
      output: `
        [
          <div />,
          <div />
        ]
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
        [
          <div />,
            <></>
        ]
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        [
          <div />,
          <></>
        ]
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
      code: [
        '<App>\n',
        ' <Foo />\n',
        '</App>',
      ].join('\n'),
      output: [
        '<App>\n',
        '\t<Foo />\n',
        '</App>',
      ].join('\n'),
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
      code: [
        '<App>\n',
        '\t<Foo />\n',
        '</App>',
      ].join('\n'),
      output: [
        '<App>\n',
        '  <Foo />\n',
        '</App>',
      ].join('\n'),
      options: [2],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 2,
            type: 'space',
            characters: 'characters',
            gotten: 0,
          },
        },
      ],
    },
    {
      code: `
        <div>
            {
                [
                    <Foo />,
                <Bar />
                ]
            }
        </div>
      `,
      output: `
        <div>
            {
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 20,
            type: 'space',
            characters: 'characters',
            gotten: 16,
          },
        },
      ],
    },
    {
      code: `
        <div>
            {foo &&
                [
                    <Foo />,
                <Bar />
                ]
            }
        </div>
      `,
      output: `
        <div>
            {foo &&
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 20,
            type: 'space',
            characters: 'characters',
            gotten: 16,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression)
      code: `
        foo ?
            <Foo /> :
        <Bar />
      `,
      output: `
        foo ?
            <Foo /> :
            <Bar />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        foo ?
            <Foo /> :
        <></>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ?
            <Foo /> :
            <></>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon on its own line)
      code: `
        foo ?
            <Foo />
        :
        <Bar />
      `,
      output: `
        foo ?
            <Foo />
        :
            <Bar />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression)
      code: `
        foo ? <Foo /> :
            <Bar />
      `,
      output: `
        foo ? <Foo /> :
        <Bar />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 8,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        foo ?
            <Foo />
        :
        <></>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ?
            <Foo />
        :
            <></>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (first expression on test line, colon on its own line)
      code: `
        foo ? <Foo />
        :
              <Bar />
      `,
      output: `
        foo ? <Foo />
        :
        <Bar />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 8,
            type: 'space',
            characters: 'characters',
            gotten: 14,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        ) :
        <Bar />
      `,
      output: `
        foo ? (
            <Foo />
        ) :
            <Bar />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        foo ? (
            <Foo />
        ) :
        <></>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ? (
            <Foo />
        ) :
            <></>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon on its own line, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        )
        :
        <Bar />
      `,
      output: `
        foo ? (
            <Foo />
        )
        :
            <Bar />
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ?
            <Foo /> : (
            <Bar />
            )
      `,
      output: `
        foo ?
            <Foo /> : (
                <Bar />
            )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        foo ?
            <Foo /> : (
            <></>
            )
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ?
            <Foo /> : (
                <></>
            )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
        : (
        <Bar />
        )
      `,
      output: `
        foo ?
            <Foo />
        : (
            <Bar />
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon indented on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
            : (
            <Bar />
            )
      `,
      output: `
        foo ?
            <Foo />
            : (
                <Bar />
            )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        foo ?
            <Foo />
            : (
            <></>
            )
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ?
            <Foo />
            : (
                <></>
            )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon at the end of the first expression, both expression parenthesized)
      code: `
        foo ? (
        <Foo />
        ) : (
        <Bar />
        )
      `,
      output: `
        foo ? (
            <Foo />
        ) : (
            <Bar />
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        foo ? (
        <></>
        ) : (
        <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ? (
            <></>
        ) : (
            <></>
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
        <Foo />
        )
        : (
        <Bar />
        )
      `,
      output: `
        foo ? (
            <Foo />
        )
        : (
            <Bar />
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
        <Foo />
        )
        :
        (
        <Bar />
        )
      `,
      output: `
        foo ? (
            <Foo />
        )
        :
        (
            <Bar />
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        foo ? (
        <></>
        )
        :
        (
        <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ? (
            <></>
        )
        :
        (
            <></>
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ? <Foo /> : (
        <Bar />
        )
      `,
      output: `
        foo ? <Foo /> : (
            <Bar />
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        foo ? <Foo /> : (
        <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ? <Foo /> : (
            <></>
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      // Multiline ternary
      // (first expression on test line, colon on its own line, parenthesized second expression)
      code: `
        foo ? <Foo />
        : (
        <Bar />
        )
      `,
      output: `
        foo ? <Foo />
        : (
            <Bar />
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        foo ? <Foo />
        : (
        <></>
        )
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        foo ? <Foo />
        : (
            <></>
        )
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        <p>
            <div>
                <SelfClosingTag />Text
          </div>
        </p>
      `,
      output: `
        <p>
            <div>
                <SelfClosingTag />Text
            </div>
        </p>
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
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
        )}
          />
        );
      `,
      output: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
            )}
          />
        );
      `,
      options: [2, { checkAttributes: true }],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
)}
\t/>
);
    `,
      output: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
\t\t)}
\t/>
);
    `,
      options: ['tab', { checkAttributes: true }],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 2,
            type: 'tab',
            characters: 'characters',
            gotten: 0,
          },
        },
      ],
    },
    {
      code: `
        function Foo() {
          return (
            <div>
              {condition && (
              <p>Bar</p>
              )}
            </div>
          );
        }
      `,
      output: `
        function Foo() {
          return (
            <div>
              {condition && (
                <p>Bar</p>
              )}
            </div>
          );
        }
      `,
      options: [2, { indentLogicalExpressions: true }],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 14,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {do {
                const num = rollDice();
                    <Thing num={num} />;
            }}
        </span>
      `,
      output: `
        <span>
            {do {
                const num = rollDice();
                <Thing num={num} />;
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 20,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {(do {
                const num = rollDice();
                    <Thing num={num} />;
            })}
        </span>
      `,
      output: `
        <span>
            {(do {
                const num = rollDice();
                <Thing num={num} />;
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 20,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {do {
            <Thing num={getPurposeOfLife()} />;
            }}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        <span>
            {do {
                <Thing num={getPurposeOfLife()} />;
            }}
        </span>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {(do {
            <Thing num={getPurposeOfLife()} />;
            })}
        </span>
      `,
      output: `
        <span>
            {(do {
                <Thing num={getPurposeOfLife()} />;
            })}
        </span>
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 16,
            type: 'space',
            characters: 'characters',
            gotten: 12,
          },
        },
      ],
    },
    {
      code: `
        <div>
        text
        </div>
      `,
      output: `
        <div>
            text
        </div>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: `
        <div>
          text
        text
        </div>
      `,
      output: `
        <div>
            text
            text
        </div>
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
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
    {
      code: [
        '<div>',
        '\t  text',
        '  \t  text',
        '</div>',
      ].join('\n'),
      output: [
        '<div>',
        '    text',
        '    text',
        '</div>',
      ].join('\n'),
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 4,
            type: 'space',
            characters: 'characters',
            gotten: 0,
          },
        },
        {
          messageId: 'wrongIndent',
          data: {
            needed: 4,
            type: 'space',
            characters: 'characters',
            gotten: 2,
          },
        },
      ],
    },
    {
      code: [
        '<div>',
        '\t\ttext',
        '</div>',
      ].join('\n'),
      parser: parsers.BABEL_ESLINT,
      options: ['tab'],
      output: [
        '<div>',
        '\ttext',
        '</div>',
      ].join('\n'),
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 1,
            type: 'tab',
            characters: 'character',
            gotten: 2,
          },
        },
      ],
    },
    {
      code: `
        <>
        aaa
        </>
      `,
      parser: parsers.BABEL_ESLINT,
      output: `
        <>
            aaa
        </>
      `,
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 12,
            type: 'space',
            characters: 'characters',
            gotten: 8,
          },
        },
      ],
    },
  ],
});
