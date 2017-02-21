/**
 * @fileoverview Validate JSX indentation
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-indent');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-indent', rule, {
  valid: [{
    code: [
      '<App></App>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '</App>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo />',
      '</App>'
    ].join('\n'),
    options: [2],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    options: [0],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '\t<Foo />',
      '</App>'
    ].join('\n'),
    options: ['tab'],
    parserOptions: parserOptions
  }, {
    code: [
      'function App() {',
      '  return <App>',
      '    <Foo />',
      '  </App>;',
      '}'
    ].join('\n'),
    options: [2],
    parserOptions: parserOptions
  }, {
    code: [
      'function App() {',
      '  return (<App>',
      '    <Foo />',
      '  </App>);',
      '}'
    ].join('\n'),
    options: [2],
    parserOptions: parserOptions
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
    options: [2],
    parserOptions: parserOptions
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
    options: [2]
  }, {
    code: [
      '(',
      '  <div>',
      '    <span />',
      '  </div>',
      ')'
    ].join('\n'),
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
    options: [2]
  }, {
    code: [
      '[',
      '  <div />,',
      '  <div />',
      ']'
    ].join('\n'),
    parserOptions: parserOptions,
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
    ].join('\n'),
    parserOptions: parserOptions
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
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon at the end of the first expression)
    code: [
      'foo ?',
      '    <Foo /> :',
      '    <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon at the start of the second expression)
    code: [
      'foo ?',
      '    <Foo />',
      '    : <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon on its own line)
    code: [
      'foo ?',
      '    <Foo />',
      ':',
      '    <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
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
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression)
    code: [
      'foo ? <Foo /> :',
      '<Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression)
    code: [
      'foo ? <Foo />',
      ': <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line)
    code: [
      'foo ? <Foo />',
      ':',
      '<Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ') :',
      '    <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon at the start of the second expression, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      '    : <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon on its own line, parenthesized first expression)
    code: [
      'foo ? (',
      '    <Foo />',
      ')',
      ':',
      '    <Bar />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo /> : (',
      '        <Bar />',
      '    )'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon on its own line, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo />',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon indented on its own line, parenthesized second expression)
    code: [
      'foo ?',
      '    <Foo />',
      '    : (',
      '        <Bar />',
      '    )'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (colon at the end of the first expression, both expression parenthesized)
    code: [
      'foo ? (',
      '    <Foo />',
      ') : (',
      '    <Bar />',
      ')'
    ].join('\n'),
    parserOptions: parserOptions
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
    ].join('\n'),
    parserOptions: parserOptions
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
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
    code: [
      'foo ? <Foo /> : (',
      '    <Bar />',
      ')'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (first expression on test line, colon at the start of the second expression, parenthesized second expression)
    code: [
      'foo ? <Foo />',
      ': (<Bar />)'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // Multiline ternary
    // (first expression on test line, colon on its own line, parenthesized second expression)
    code: [
      'foo ? <Foo />',
      ': (',
      '    <Bar />',
      ')'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '    {',
      '        condition &&',
      '            <Container>',
      '                <Child></Child>',
      '            </Container>',
      '    }',
      '</App>'
    ].join('\n'),
    options: [4, {indentLogicalExpressions: true}],
    parserOptions: parserOptions
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
    options: [2],
    parserOptions: parserOptions
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
    options: [2],
    parserOptions: parserOptions
  }, {
    code: [
      'function foo() {',
      '  <span>',
      '    {condition ?',
      '      <Thing',
      '        foo={super}',
      '      /> :',
      '      <Thing/>',
      '    }',
      '  </span>',
      '}'
    ].join('\n'),
    options: [2],
    parserOptions: parserOptions
  }, {
    code: [
      'function foo() {',
      '  <span>Text</span>',
      '}'
    ].join('\n'),
    options: [2],
    parserOptions: parserOptions
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
    errors: [{message: 'Expected indentation of 1 tab character but found 0.'}]
  }, {
    code: [
      'function MyComponent(props) {',
      '\treturn (',
      '    <div',
      '\t\t\tclassName="foo-bar"',
      '\t\t\tid="thing"',
      '    >',
      '      Hello world!',
      '    </div>',
      '\t)',
      '}'
    ].join('\n'),
    output: [
      'function MyComponent(props) {',
      '\treturn (',
      '\t\t<div',
      '\t\t\tclassName="foo-bar"',
      '\t\t\tid="thing"',
      '\t\t>',
      '\t\t\tHello world!',
      '\t\t</div>',
      '\t)',
      '}'
    ].join('\n'),
    options: ['tab'],
    parserOptions: parserOptions,
    errors: [
      {message: 'Expected indentation of 2 tab characters but found 0.'},
      {message: 'Expected indentation of 2 tab characters but found 0.'},
      {message: 'Expected indentation of 3 tab characters but found 0.'},
      {message: 'Expected indentation of 2 tab characters but found 0.'}
    ]
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    output: [
      'function App() {',
      '  return (',
      '    <App>',
      '      <Foo />',
      '    </App>',
      '  );',
      '}'
    ].join('\n'),
    options: [2],
    parserOptions: parserOptions,
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'},
      {message: 'Expected indentation of 6 space characters but found 2.'},
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
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
    parserOptions: parserOptions,
    errors: [
      {message: 'Expected indentation of 4 space characters but found 0.'}
    ]
  }]
});
