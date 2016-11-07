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
      '  <App>',
      '<Foo />',
      '  </App>'
    ].join('\n'),
    options: [-2],
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
    // Literals indentation is not touched
    code: [
      '<div>',
      'bar <div>',
      '   bar',
      '   bar {foo}',
      'bar </div>',
      '</div>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'this.props.asd.length > 0 ?',
      '    <Button className="bacon-yay">{this.props.asd.length}</Button> :',
      '    <span className="bacon-no-trigger">0</span>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '    {this.props.asd.length > 0 ?',
      '        <Button className="bacon-yay">{this.props.asd.length}</Button> :',
      '        <span className="bacon-no-trigger">0</span>',
      '    }',
      '</div>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '    { this.props.asd.length > 0 ? <Button className="bacon-yay">{this.props.asd.length}</Button> : (',
      '        <span className="bacon-no-trigger">0</span>',
      '    ) }',
      '</div>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '    {',
      '      this.props.asd.length > 0',
      '        ? (',
      '            <Button className="bacon-yay">{this.props.asd.length}</Button>',
      '        )',
      '        : (',
      '            <span className="bacon-no-trigger">0</span>',
      '        )',
      '    }',
      '</div>'
    ].join('\n'),
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
    parserOptions: parserOptions,
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
      'this.props.asd.length > 0 ?',
      '    <Button className="bacon-yay">{this.props.asd.length}</Button> :',
      '        <span className="bacon-no-trigger">0</span>'
    ].join('\n'),
    output: [
      'this.props.asd.length > 0 ?',
      '    <Button className="bacon-yay">{this.props.asd.length}</Button> :',
      '    <span className="bacon-no-trigger">0</span>'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Expected indentation of 4 space characters but found 8.',
      line: 3,
      column: 9
    }]
  }, {
    code: [
      '<div>',
      '    {this.props.asd.length > 0 ?',
      '        <Button className="bacon-yay">{this.props.asd.length}</Button> :',
      '    <span className="bacon-no-trigger">0</span>',
      '    }',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    {this.props.asd.length > 0 ?',
      '        <Button className="bacon-yay">{this.props.asd.length}</Button> :',
      '        <span className="bacon-no-trigger">0</span>',
      '    }',
      '</div>'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Expected indentation of 8 space characters but found 4.',
      line: 4,
      column: 5
    }]
  }, {
    code: [
      '<div>',
      '    {this.props.asd.length > 0 ? <Button className="bacon-yay">{this.props.asd.length}</Button> : (',
      '    <span className="bacon-no-trigger">0</span>',
      '    )}',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    {this.props.asd.length > 0 ? <Button className="bacon-yay">{this.props.asd.length}</Button> : (',
      '        <span className="bacon-no-trigger">0</span>',
      '    )}',
      '</div>'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Expected indentation of 8 space characters but found 4.',
      line: 3,
      column: 5
    }]
  }, {
    code: [
      '<div>',
      '    {',
      '      this.props.asd.length > 0',
      '        ? (',
      '        <Button className="bacon-yay">{this.props.asd.length}</Button>',
      '        )',
      '        : (',
      '              <span className="bacon-no-trigger">0</span>',
      '        )',
      '    }',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '    {',
      '      this.props.asd.length > 0',
      '        ? (',
      '            <Button className="bacon-yay">{this.props.asd.length}</Button>',
      '        )',
      '        : (',
      '            <span className="bacon-no-trigger">0</span>',
      '        )',
      '    }',
      '</div>'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Expected indentation of 12 space characters but found 8.',
      line: 5,
      column: 9
    }, {
      message: 'Expected indentation of 12 space characters but found 14.',
      line: 8,
      column: 15
    }]
  }]
});
