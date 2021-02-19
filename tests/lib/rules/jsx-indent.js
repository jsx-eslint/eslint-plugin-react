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
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-indent', rule, {
  valid: [{
    code: [
      '<App></App>'
    ].join('\n')
  }, {
    code: [
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<App>',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<>',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<App>',
      '  <Foo />',
      '</App>'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '<App>',
      '  <></>',
      '</App>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      '<>',
      '  <Foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    options: [0]
  }, {
    code: [
      '  <App>',
      '<Foo />',
      '  </App>'
    ].join('\n'),
    options: [-2]
  }, {
    code: [
      '<App>',
      '\t<Foo />',
      '</App>'
    ].join('\n'),
    options: ['tab']
  }, {
    code: [
      'function App() {',
      '  return <App>',
      '    <Foo />',
      '  </App>;',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      'function App() {',
      '  return <App>',
      '    <></>',
      '  </App>;',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      'function App() {',
      '  return (<App>',
      '    <Foo />',
      '  </App>);',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      'function App() {',
      '  return (<App>',
      '    <></>',
      '  </App>);',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      'function App() {',
      '  return (',
      '    <App>',
      '      <Foo />',
      '    </App>',
      '  );',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      'function App() {',
      '  return (',
      '    <App>',
      '      <></>',
      '    </App>',
      '  );',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      'it(',
      '  (',
      '    <div>',
      '      <span />',
      '    </div>',
      '  )',
      ')'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      'it(',
      '  (',
      '    <div>',
      '      <></>',
      '    </div>',
      '  )',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      'it(',
      '  (<div>',
      '    <span />',
      '    <span />',
      '    <span />',
      '  </div>)',
      ')'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '(',
      '  <div>',
      '    <span />',
      '  </div>',
      ')'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '{',
      '  head.title &&',
      '  <h1>',
      '    {head.title}',
      '  </h1>',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '{',
      '  head.title &&',
      '  <>',
      '    {head.title}',
      '  </>',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      '{',
      '  head.title &&',
      '    <h1>',
      '      {head.title}',
      '    </h1>',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '{',
      '  head.title && (',
      '  <h1>',
      '    {head.title}',
      '  </h1>)',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '{',
      '  head.title && (',
      '    <h1>',
      '      {head.title}',
      '    </h1>',
      '  )',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '[',
      '  <div />,',
      '  <div />',
      ']'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '[',
      '  <></>,',
      '  <></>',
      ']'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      '<div>',
      '    {',
      '        [',
      '            <Foo />,',
      '            <Bar />',
      '        ]',
      '    }',
      '</div>'
    ].join('\n')
  }, {
    code: [
      '<div>',
      '    {foo &&',
      '        [',
      '            <Foo />,',
      '            <Bar />',
      '        ]',
      '    }',
      '</div>'
    ].join('\n')
  }, {
    code: [
      '<div>',
      '    {foo &&',
      '        [',
      '            <></>,',
      '            <></>',
      '        ]',
      '    }',
      '</div>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<div>',
      '    bar <div>',
      '        bar',
      '        bar {foo}',
      '        bar </div>',
      '</div>'
    ].join('\n')
  }, {
    code: [
      '<>',
      '    bar <>',
      '        bar',
      '        bar {foo}',
      '        bar </>',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon at the end of the first expression)
    code: [
      'foo ?',
      '    <Foo /> :',
      '    <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ?',
      '    <></> :',
      '    <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon at the start of the second expression)
    code: [
      'foo ?',
      '    <Foo />',
      '    : <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ?',
      '    <></>',
      '    : <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon on its own line)
    code: [
      'foo ?',
      '    <Foo />',
      ':',
      '    <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ?',
      '    <></>',
      ':',
      '    <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (multiline JSX, colon on its own line)
    code: [
      '{!foo ?',
      '    <Foo',
      '        onClick={this.onClick}',
      '    />',
      ':',
      '    <Bar',
      '        onClick={this.onClick}',
      '    />',
      '}'
    ].join('\n')
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression)
    code: [
      'foo ? <Foo /> :',
      '<Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ? <></> :',
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression)
    code: [
      'foo ? <Foo />',
      ': <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ? <></>',
      ': <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line)
    code: [
      'foo ? <Foo />',
      ':',
      '<Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ? <></>',
      ':',
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ') :',
      '    <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ? (',
      '    <></>',
      ') :',
      '    <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon at the start of the second expression, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      '    : <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ? (',
      '    <></>',
      ')',
      '    : <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon on its own line, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      ':',
      '    <Bar />'
    ].join('\n')
  }, {
    code: [
      'foo ? (',
      '    <></>',
      ')',
      ':',
      '    <></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo /> : (',
      '        <Bar />',
      '    )'
    ].join('\n')
  }, {
    code: [
      'foo ?',
      '    <></> : (',
      '        <></>',
      '    )'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon on its own line, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo />',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    code: [
      'foo ?',
      '    <></>',
      ': (',
      '    <></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon indented on its own line, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo />',
      '    : (',
      '        <Bar />',
      '    )'
    ].join('\n')
  }, {
    code: [
      'foo ?',
      '    <></>',
      '    : (',
      '        <></>',
      '    )'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, both expression parenthesized)
    code: [
      'foo ? (',
      '    <Foo />',
      ') : (',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    code: [
      'foo ? (',
      '    <></>',
      ') : (',
      '    <></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    code: [
      'foo ? (',
      '    <></>',
      ')',
      ': (',
      '    <></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      ':',
      '(',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    code: [
      'foo ? (',
      '    <></>',
      ')',
      ':',
      '(',
      '    <></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ? <Foo /> : (',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    code: [
      'foo ? <></> : (',
      '    <></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression, parenthesized second expression)
    code: [
      'foo ? <Foo />',
      ': (<Bar />)'
    ].join('\n')
  }, {
    code: [
      'foo ? <></>',
      ': (<></>)'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line, parenthesized second expression)
    code: [
      'foo ? <Foo />',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    code: [
      'foo ? <></>',
      ': (',
      '    <></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '  {condition ?',
      '    <Thing',
      '      foo={`bar`}',
      '    /> :',
      '    <Thing/>',
      '  }',
      '</span>'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '<span>',
      '  {condition ?',
      '    <Thing',
      '      foo={"bar"}',
      '    /> :',
      '    <Thing/>',
      '  }',
      '</span>'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      'function foo() {',
      '  <span>',
      '    {condition ?',
      '      <Thing',
      '        foo={superFoo}',
      '      /> :',
      '      <Thing/>',
      '    }',
      '  </span>',
      '}'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      'function foo() {',
      '  <span>',
      '    {condition ?',
      '      <Thing',
      '        foo={superFoo}',
      '      /> :',
      '      <></>',
      '    }',
      '  </span>',
      '}'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [2]
  }, {
    code: [
      '<span>',
      '    {do {',
      '        const num = rollDice();',
      '        <Thing num={num} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {(do {',
      '        const num = rollDice();',
      '        <Thing num={num} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {do {',
      '        const purposeOfLife = getPurposeOfLife();',
      '        if (purposeOfLife == 42) {',
      '            <Thing />;',
      '        } else {',
      '            <AnotherThing />;',
      '        }',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {(do {',
      '        const purposeOfLife = getPurposeOfLife();',
      '        if (purposeOfLife == 42) {',
      '            <Thing />;',
      '        } else {',
      '            <AnotherThing />;',
      '        }',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {do {',
      '        <Thing num={rollDice()} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {(do {',
      '        <Thing num={rollDice()} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {do {',
      '        <Thing num={rollDice()} />;',
      '        <Thing num={rollDice()} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {(do {',
      '        <Thing num={rollDice()} />;',
      '        <Thing num={rollDice()} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {do {',
      '        const purposeOfLife = 42;',
      '        <Thing num={purposeOfLife} />;',
      '        <Thing num={purposeOfLife} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<span>',
      '    {(do {',
      '        const purposeOfLife = 42;',
      '        <Thing num={purposeOfLife} />;',
      '        <Thing num={purposeOfLife} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
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
    options: [2]
  }, {
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
    options: [2]
  }, {
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
    options: [2]
  }, {
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
    options: ['tab']
  }, {
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
    options: [2, {checkAttributes: false}]
  }, {
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
    options: ['tab', {checkAttributes: false}]
  }, {
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
    options: [2, {checkAttributes: true}]
  }, {
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
    options: [2, {indentLogicalExpressions: true}]
  }, {
    code: [
      '<App>',
      '    text',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '    text',
      '    text',
      '    text',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '\ttext',
      '</App>'
    ].join('\n'),
    options: ['tab']
  }, {
    code: [
      '<App>',
      '\t{undefined}',
      '\t{null}',
      '\t{true}',
      '\t{false}',
      '\t{42}',
      '\t{NaN}',
      '\t{"foo"}',
      '</App>'
    ].join('\n'),
    options: ['tab']
  }, {
    // don't check literals not within JSX. See #2563
    code: [
      'function foo() {',
      'const a = `aa`;',
      'const b = `b\nb`;',
      '}'
    ].join('\n')
  }],

  invalid: [{
    code: [
      '<div>',
      'bar <div>',
      '   bar',
      '   bar {foo}',
      '   bar </div>',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    bar <div>',
      '    bar',
      '    bar {foo}',
      '    bar </div>',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 3.'},
      {message: 'Expected indentation of 4 space characters but found 3.'},
      {message: 'Expected indentation of 4 space characters but found 3.'}
    ]
  }, {
    code: [
      '<App>',
      '  <Foo />',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '    <Foo />',
      '</App>'
    ].join('\n'),
    errors: [{message: 'Expected indentation of 4 space characters but found 2.'}]
  }, {
    code: [
      '<App>',
      '  <></>',
      '</App>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<App>',
      '    <></>',
      '</App>'
    ].join('\n'),
    errors: [{message: 'Expected indentation of 4 space characters but found 2.'}]
  }, {
    code: [
      '<>',
      '  <Foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<>',
      '    <Foo />',
      '</>'
    ].join('\n'),
    errors: [{message: 'Expected indentation of 4 space characters but found 2.'}]
  }, {
    code: [
      '<App>',
      '    <Foo />',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo />',
      '</App>'
    ].join('\n'),
    options: [2],
    errors: [{message: 'Expected indentation of 2 space characters but found 4.'}]
  }, {
    code: [
      '<App>',
      '    <Foo />',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '\t<Foo />',
      '</App>'
    ].join('\n'),
    options: ['tab'],
    errors: [{message: 'Expected indentation of 1 tab character but found 0.'}]
  }, {
    code: [
      'function App() {',
      '  return <App>',
      '    <Foo />',
      '         </App>;',
      '}'
    ].join('\n'),
    output: [
      'function App() {',
      '  return <App>',
      '    <Foo />',
      '  </App>;',
      '}'
    ].join('\n'),
    options: [2],
    errors: [{message: 'Expected indentation of 2 space characters but found 9.'}]
  }, {
    code: [
      'function App() {',
      '  return (<App>',
      '    <Foo />',
      '    </App>);',
      '}'
    ].join('\n'),
    output: [
      'function App() {',
      '  return (<App>',
      '    <Foo />',
      '  </App>);',
      '}'
    ].join('\n'),
    options: [2],
    errors: [{message: 'Expected indentation of 2 space characters but found 4.'}]
  }, {
    code: [
      'function App() {',
      '  return (',
      '<App>',
      '  <Foo />',
      '</App>',
      '  );',
      '}'
    ].join('\n'),
    // The detection logic only thinks <App> is indented wrong, not the other
    // two lines following. I *think* because it incorrectly uses <App>'s indention
    // as the baseline for the next two, instead of the realizing the entire three
    // lines are wrong together. See #608
    output: [
      'function App() {',
      '  return (',
      '    <App>',
      '  <Foo />',
      '</App>',
      '  );',
      '}'
    ].join('\n'),
    options: [2],
    errors: [{message: 'Expected indentation of 4 space characters but found 0.'}]
  }, {
    code: [
      '<App>',
      '   {test}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '    {test}',
      '</App>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 3.'}
    ]
  }, {
    code: [
      '<App>',
      '    {options.map((option, index) => (',
      '        <option key={index} value={option.key}>',
      '           {option.name}',
      '        </option>',
      '    ))}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '    {options.map((option, index) => (',
      '        <option key={index} value={option.key}>',
      '            {option.name}',
      '        </option>',
      '    ))}',
      '</App>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 12 space characters but found 11.'}
    ]
  }, {
    code: [
      '<App>',
      '{test}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '\t{test}',
      '</App>'
    ].join('\n'),
    options: ['tab'],
    errors: [
      {message: 'Expected indentation of 1 tab character but found 0.'}
    ]
  }, {
    code: [
      '<App>',
      '\t{options.map((option, index) => (',
      '\t\t<option key={index} value={option.key}>',
      '\t\t{option.name}',
      '\t\t</option>',
      '\t))}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '\t{options.map((option, index) => (',
      '\t\t<option key={index} value={option.key}>',
      '\t\t\t{option.name}',
      '\t\t</option>',
      '\t))}',
      '</App>'
    ].join('\n'),
    options: ['tab'],
    errors: [
      {message: 'Expected indentation of 3 tab characters but found 2.'}
    ]
  }, {
    code: [
      '<App>\n',
      '<Foo />\n',
      '</App>'
    ].join('\n'),
    output: [
      '<App>\n',
      '\t<Foo />\n',
      '</App>'
    ].join('\n'),
    options: ['tab'],
    errors: [
      {message: 'Expected indentation of 1 tab character but found 0.'}
    ]
  }, {
    code: [
      '[',
      '  <div />,',
      '    <div />',
      ']'
    ].join('\n'),
    output: [
      '[',
      '  <div />,',
      '  <div />',
      ']'
    ].join('\n'),
    options: [2],
    errors: [
      {message: 'Expected indentation of 2 space characters but found 4.'}
    ]
  }, {
    code: [
      '[',
      '  <div />,',
      '    <></>',
      ']'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '[',
      '  <div />,',
      '  <></>',
      ']'
    ].join('\n'),
    options: [2],
    errors: [
      {message: 'Expected indentation of 2 space characters but found 4.'}
    ]
  }, {
    code: [
      '<App>\n',
      ' <Foo />\n',
      '</App>'
    ].join('\n'),
    output: [
      '<App>\n',
      '\t<Foo />\n',
      '</App>'
    ].join('\n'),
    options: ['tab'],
    errors: [
      {message: 'Expected indentation of 1 tab character but found 0.'}
    ]
  }, {
    code: [
      '<App>\n',
      '\t<Foo />\n',
      '</App>'
    ].join('\n'),
    output: [
      '<App>\n',
      '  <Foo />\n',
      '</App>'
    ].join('\n'),
    options: [2],
    errors: [
      {message: 'Expected indentation of 2 space characters but found 0.'}
    ]
  }, {
    code: [
      '<div>',
      '    {',
      '        [',
      '            <Foo />,',
      '        <Bar />',
      '        ]',
      '    }',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    {',
      '        [',
      '            <Foo />,',
      '            <Bar />',
      '        ]',
      '    }',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 12 space characters but found 8.'}
    ]
  }, {
    code: [
      '<div>',
      '    {foo &&',
      '        [',
      '            <Foo />,',
      '        <Bar />',
      '        ]',
      '    }',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    {foo &&',
      '        [',
      '            <Foo />,',
      '            <Bar />',
      '        ]',
      '    }',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 12 space characters but found 8.'}
    ]
  }, {
    // Multiline ternary
    // (colon at the end of the first expression)
    code: [
      'foo ?',
      '    <Foo /> :',
      '<Bar />'
    ].join('\n'),
    output: [
      'foo ?',
      '    <Foo /> :',
      '    <Bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      'foo ?',
      '    <Foo /> :',
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ?',
      '    <Foo /> :',
      '    <></>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (colon on its own line)
    code: [
      'foo ?',
      '    <Foo />',
      ':',
      '<Bar />'
    ].join('\n'),
    output: [
      'foo ?',
      '    <Foo />',
      ':',
      '    <Bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression)
    code: [
      'foo ? <Foo /> :',
      '    <Bar />'
    ].join('\n'),
    output: [
      'foo ? <Foo /> :',
      '<Bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 0 space characters but found 4.'}
    ]
  }, {
    code: [
      'foo ?',
      '    <Foo />',
      ':',
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ?',
      '    <Foo />',
      ':',
      '    <></>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line)
    code: [
      'foo ? <Foo />',
      ':',
      '      <Bar />'
    ].join('\n'),
    output: [
      'foo ? <Foo />',
      ':',
      '<Bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 0 space characters but found 6.'}
    ]
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ') :',
      '<Bar />'
    ].join('\n'),
    output: [
      'foo ? (',
      '    <Foo />',
      ') :',
      '    <Bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      'foo ? (',
      '    <Foo />',
      ') :',
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ? (',
      '    <Foo />',
      ') :',
      '    <></>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (colon on its own line, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      ':',
      '<Bar />'
    ].join('\n'),
    output: [
      'foo ? (',
      '    <Foo />',
      ')',
      ':',
      '    <Bar />'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo /> : (',
      '    <Bar />',
      '    )'
    ].join('\n'),
    output: [
      'foo ?',
      '    <Foo /> : (',
      '        <Bar />',
      '    )'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
    code: [
      'foo ?',
      '    <Foo /> : (',
      '    <></>',
      '    )'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ?',
      '    <Foo /> : (',
      '        <></>',
      '    )'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
    // Multiline ternary
    // (colon on its own line, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo />',
      ': (',
      '<Bar />',
      ')'
    ].join('\n'),
    output: [
      'foo ?',
      '    <Foo />',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (colon indented on its own line, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo />',
      '    : (',
      '    <Bar />',
      '    )'
    ].join('\n'),
    output: [
      'foo ?',
      '    <Foo />',
      '    : (',
      '        <Bar />',
      '    )'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
    code: [
      'foo ?',
      '    <Foo />',
      '    : (',
      '    <></>',
      '    )'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ?',
      '    <Foo />',
      '    : (',
      '        <></>',
      '    )'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, both expression parenthesized)
    code: [
      'foo ? (',
      '<Foo />',
      ') : (',
      '<Bar />',
      ')'
    ].join('\n'),
    output: [
      'foo ? (',
      '    <Foo />',
      ') : (',
      '    <Bar />',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      'foo ? (',
      '<></>',
      ') : (',
      '<></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ? (',
      '    <></>',
      ') : (',
      '    <></>',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
    code: [
      'foo ? (',
      '<Foo />',
      ')',
      ': (',
      '<Bar />',
      ')'
    ].join('\n'),
    output: [
      'foo ? (',
      '    <Foo />',
      ')',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (colon on its own line, both expression parenthesized)
    code: [
      'foo ? (',
      '<Foo />',
      ')',
      ':',
      '(',
      '<Bar />',
      ')'
    ].join('\n'),
    output: [
      'foo ? (',
      '    <Foo />',
      ')',
      ':',
      '(',
      '    <Bar />',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      'foo ? (',
      '<></>',
      ')',
      ':',
      '(',
      '<></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ? (',
      '    <></>',
      ')',
      ':',
      '(',
      '    <></>',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ? <Foo /> : (',
      '<Bar />',
      ')'
    ].join('\n'),
    output: [
      'foo ? <Foo /> : (',
      '    <Bar />',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      'foo ? <Foo /> : (',
      '<></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ? <Foo /> : (',
      '    <></>',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line, parenthesized second expression)
    code: [
      'foo ? <Foo />',
      ': (',
      '<Bar />',
      ')'
    ].join('\n'),
    output: [
      'foo ? <Foo />',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      'foo ? <Foo />',
      ': (',
      '<></>',
      ')'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      'foo ? <Foo />',
      ': (',
      '    <></>',
      ')'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      '<p>',
      '    <div>',
      '        <SelfClosingTag />Text',
      '  </div>',
      '</p>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 2.'}
    ],
    output: [
      '<p>',
      '    <div>',
      '        <SelfClosingTag />Text',
      '    </div>',
      '</p>'
    ].join('\n')
  }, {
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
    options: [2, {checkAttributes: true}],
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
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
    options: ['tab', {checkAttributes: true}],
    errors: [
      {message: 'Expected indentation of 2 tab characters but found 0.'}
    ]
  }, {
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
    options: [2, {indentLogicalExpressions: true}],
    errors: [
      {message: 'Expected indentation of 12 space characters but found 10.'}
    ]
  }, {
    code: [
      '<span>',
      '    {do {',
      '        const num = rollDice();',
      '            <Thing num={num} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<span>',
      '    {do {',
      '        const num = rollDice();',
      '        <Thing num={num} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 12.'}
    ]
  }, {
    code: [
      '<span>',
      '    {(do {',
      '        const num = rollDice();',
      '            <Thing num={num} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<span>',
      '    {(do {',
      '        const num = rollDice();',
      '        <Thing num={num} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 12.'}
    ]
  }, {
    code: [
      '<span>',
      '    {do {',
      '    <Thing num={getPurposeOfLife()} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<span>',
      '    {do {',
      '        <Thing num={getPurposeOfLife()} />;',
      '    }}',
      '</span>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
    code: [
      '<span>',
      '    {(do {',
      '    <Thing num={getPurposeOfLife()} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<span>',
      '    {(do {',
      '        <Thing num={getPurposeOfLife()} />;',
      '    })}',
      '</span>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 8 space characters but found 4.'}
    ]
  }, {
    code: [
      '<div>',
      'text',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    text',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      '<div>',
      '  text',
      'text',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    text',
      '    text',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 2.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }, {
    code: [
      '<div>',
      '\t  text',
      '  \t  text',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    text',
      '    text',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 4 space characters but found 2.'}
    ]
  }, {
    code: [
      '<div>',
      '\t\ttext',
      '</div>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: ['tab'],
    output: [
      '<div>',
      '\ttext',
      '</div>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 1 tab character but found 2.'}
    ]
  }, {
    code: [
      '<>',
      'aaa',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    output: [
      '<>',
      '    aaa',
      '</>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }]
});
