/**
 * @fileoverview Validate JSX indentation
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-indent');
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
ruleTester.run('jsx-indent', rule, {
  valid: [{
    code: [
      '<App></App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '</App>'
    ].join('\n')
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
      '  return (<App>',
      '    <Foo />',
      '  </App>);',
      '}'
    ].join('\n'),
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
    // Literals indentation is not touched
    code: [
      '<div>',
      'bar <div>',
      '   bar',
      '   bar {foo}',
      'bar </div>',
      '</div>'
    ].join('\n')
  }, {
    // Multiline ternary
    // (colon at the end of the first expression)
    code: [
      'foo ?',
      '    <Foo /> :',
      '    <Bar />'
    ].join('\n')
  }, {
    // Multiline ternary
    // (colon at the start of the second expression)
    code: [
      'foo ?',
      '    <Foo />',
      '    : <Bar />'
    ].join('\n')
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
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression)
    code: [
      'foo ? <Foo />',
      ': <Bar />'
    ].join('\n')
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line)
    code: [
      'foo ? <Foo />',
      ':',
      '<Bar />'
    ].join('\n')
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
    // Multiline ternary
    // (colon at the start of the second expression, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      '    : <Bar />'
    ].join('\n')
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
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo /> : (',
      '        <Bar />',
      '    )'
    ].join('\n')
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
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ? <Foo /> : (',
      '    <Bar />',
      ')'
    ].join('\n')
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression, parenthesized second expression)
    code: [
      'foo ? <Foo />',
      ': (<Bar />)'
    ].join('\n')
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
  }],

  invalid: [{
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
    /* output: [
      'function App() {',
      '  return (',
      '    <App>',
      '      <Foo />',
      '    </App>',
      '  );',
      '}'
    ].join('\n'), */
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
      '<p>',
      '    <div>',
      '        <SelfClosingTag />Text',
      '  </div>',
      '</p>'
    ].join('\n'),
    errors: [
      {message: 'Expected indentation of 4 space characters but found 2.'}
    ]
  }]
});
