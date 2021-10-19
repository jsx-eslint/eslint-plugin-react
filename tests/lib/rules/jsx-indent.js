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
  valid: parsers.all([
    {
      code: `
        <App></App>
      `,
    },
    {
      code: `
        <></>
      `,
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        <>
          <Foo />
        </>
      `,
      features: ['fragment'],
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
      code: `
\t\t\t\t<App>
\t\t\t\t\t<Foo />
\t\t\t\t</App>
\t\t\t`,
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['fragment'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {do {
                <Thing num={rollDice()} />;
            }}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {(do {
                <Thing num={rollDice()} />;
            })}
        </span>
      `,
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['fragment'],
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
      code: `
\t\t\t\t<App>
\t\t\t\t\ttext
\t\t\t\t</App>
\t\t\t`,
      options: ['tab'],
    },
    {
      code: `
\t\t\t\t<App>
\t\t\t\t\t{undefined}
\t\t\t\t\t{null}
\t\t\t\t\t{true}
\t\t\t\t\t{false}
\t\t\t\t\t{42}
\t\t\t\t\t{NaN}
\t\t\t\t\t{"foo"}
\t\t\t\t</App>
\t\t\t`,
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
  ]),

  invalid: parsers.all([
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment'],
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
      code: `
        <App>
            <Foo />
        </App>
      `,
      output: `
        <App>
\t<Foo />
        </App>
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
      code: `
        <App>
        {test}
        </App>
      `,
      output: `
        <App>
\t{test}
        </App>
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
\t\t\t\t<App>
\t\t\t\t\t{options.map((option, index) => (
\t\t\t\t\t\t<option key={index} value={option.key}>
\t\t\t\t\t\t{option.name}
\t\t\t\t\t\t</option>
\t\t\t\t\t))}
\t\t\t\t</App>
\t\t\t`,
      output: `
\t\t\t\t<App>
\t\t\t\t\t{options.map((option, index) => (
\t\t\t\t\t\t<option key={index} value={option.key}>
\t\t\t\t\t\t\t{option.name}
\t\t\t\t\t\t</option>
\t\t\t\t\t))}
\t\t\t\t</App>
\t\t\t`,
      options: ['tab'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 7,
            type: 'tab',
            characters: 'characters',
            gotten: 6,
          },
        },
      ],
    },
    {
      code: `
\t\t\t\t<App>\n
\t\t\t\t<Foo />\n
\t\t\t\t</App>
\t\t\t`,
      output: `
\t\t\t\t<App>\n
\t\t\t\t\t<Foo />\n
\t\t\t\t</App>
\t\t\t`,
      options: ['tab'],
      errors: [
        {
          messageId: 'wrongIndent',
          data: {
            needed: 5,
            type: 'tab',
            characters: 'characters',
            gotten: 4,
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      code: `
        <App>

         <Foo />

        </App>
      `,
      output: `
        <App>

\t<Foo />

        </App>
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
        <App>

        \t<Foo />

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
            gotten: 8,
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      features: ['do expressions'],
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
      code: `
        <div>
        \t  text
          \t  text
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
            gotten: 8,
          },
        },
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
        <div>
        \t\ttext
        </div>
      `,
      options: ['tab'],
      output: `
        <div>
\ttext
        </div>
      `,
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
        <>
        aaa
        </>
      `,
      features: ['fragment'],
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
  ]),
});
