/**
 * @fileoverview Limit to one expression per line in JSX
 * @author Mark Ivan Allen <Vydia.com>
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-one-expression-per-line');
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
ruleTester.run('jsx-one-expression-per-line', rule, {
  valid: [{
    code: '<App />'
  }, {
    code: '<App></App>'
  }, {
    code: '<App foo="bar" />'
  }, {
    code: [
      '<App>',
      '  <Foo />',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <Foo />',
      '  <Bar />',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <Foo></Foo>',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  foo bar baz  whatever  ',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <Foo>',
      '  </Foo>',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo="bar"',
      '>',
      '<Foo />',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<',
      'App',
      '>',
      '  <',
      '    Foo',
      '  />',
      '</',
      'App',
      '>'
    ].join('\n')
  }, {
    code: '<App>foo</App>',
    options: [{allow: 'literal'}]
  }, {
    code: '<App>123</App>',
    options: [{allow: 'literal'}]
  }, {
    code: '<App>foo</App>',
    options: [{allow: 'single-child'}]
  }, {
    code: '<App>{"foo"}</App>',
    options: [{allow: 'single-child'}]
  }, {
    code: '<App>{foo && <Bar />}</App>',
    options: [{allow: 'single-child'}]
  }, {
    code: '<App><Foo /></App>',
    options: [{allow: 'single-child'}]
  }, {
    code: '<></>',
    parser: 'babel-eslint'
  }, {
    code: [
      '<>',
      '  <Foo />',
      '</>'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      '<>',
      '  <Foo />',
      '  <Bar />',
      '</>'
    ].join('\n'),
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: '<App>{"foo"}</App>',
    output: [
      '<App>',
      '{"foo"}',
      '</App>'
    ].join('\n'),
    errors: [{message: '`{"foo"}` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: '<App>foo</App>',
    output: [
      '<App>',
      'foo',
      '</App>'
    ].join('\n'),
    errors: [{message: '`foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  foo {"bar"}',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  foo ',
      '{\' \'}',
      '{"bar"}',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`{"bar"}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  {"foo"} bar',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  {"foo"}',
      '{\' \'}',
      'bar',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '` bar` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo /><Bar />',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo />',
      '<Bar />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  <span />foo',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  <span />',
      'foo',
      '</div>'
    ].join('\n'),
    errors: [{message: '`foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  <span />{"foo"}',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  <span />',
      '{"foo"}',
      '</div>'
    ].join('\n'),
    errors: [{message: '`{"foo"}` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  {"foo"} { I18n.t(\'baz\') }',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  {"foo"} ',
      '{\' \'}',
      '{ I18n.t(\'baz\') }',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`{ I18n.t(\'baz\') }` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<Text style={styles.foo}>{ bar } <Text/> { I18n.t(\'baz\') }</Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}>',
      '{ bar } ',
      '{\' \'}',
      '<Text/> ',
      '{\' \'}',
      '{ I18n.t(\'baz\') }',
      '</Text>'
    ].join('\n'),
    errors: [
      {message: '`{ bar }` must be placed on a new line'},
      {message: '`Text` must be placed on a new line'},
      {message: '`{ I18n.t(\'baz\') }` must be placed on a new line'}
    ],
    parserOptions: parserOptions

  }, {
    code: [
      '<Text style={styles.foo}> <Bar/> <Baz/></Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}> ',
      '{\' \'}',
      '<Bar/> ',
      '{\' \'}',
      '<Baz/>',
      '</Text>'
    ].join('\n'),
    errors: [
      {message: '`Bar` must be placed on a new line'},
      {message: '`Baz` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<Text style={styles.foo}> <Bar/> <Baz/> <Bunk/> <Bruno/> </Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}> ',
      '{\' \'}',
      '<Bar/> ',
      '{\' \'}',
      '<Baz/> ',
      '{\' \'}',
      '<Bunk/> ',
      '{\' \'}',
      '<Bruno/>',
      '{\' \'}',
      ' </Text>'
    ].join('\n'),
    errors: [
      {message: '`Bar` must be placed on a new line'},
      {message: '`Baz` must be placed on a new line'},
      {message: '`Bunk` must be placed on a new line'},
      {message: '`Bruno` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<Text style={styles.foo}> <Bar /></Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}> ',
      '{\' \'}',
      '<Bar />',
      '</Text>'
    ].join('\n'),
    errors: [
      {message: '`Bar` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<Text style={styles.foo}> <Bar />',
      '</Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}> ',
      '{\' \'}',
      '<Bar />',
      '</Text>'
    ].join('\n'),
    errors: [
      {message: '`Bar` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<Text style={styles.foo}>',
      '  <Bar /> <Baz />',
      '</Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}>',
      '  <Bar /> ',
      '{\' \'}',
      '<Baz />',
      '</Text>'
    ].join('\n'),
    errors: [
      {message: '`Baz` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<Text style={styles.foo}>',
      '  { bar } { I18n.t(\'baz\') }',
      '</Text>'
    ].join('\n'),
    output: [
      '<Text style={styles.foo}>',
      '  { bar } ',
      '{\' \'}',
      '{ I18n.t(\'baz\') }',
      '</Text>'
    ].join('\n'),
    errors: [
      {message: '`{ I18n.t(\'baz\') }` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  foo<input />',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  foo',
      '<input />',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`input` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  {"foo"}<span />',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  {"foo"}',
      '<span />',
      '</div>'
    ].join('\n'),
    errors: [{message: '`span` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  foo <input />',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  foo ',
      '{\' \'}',
      '<input />',
      '</div>'
    ].join('\n'),
    errors: [{message: '`input` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  <input /> foo',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  <input />',
      '{\' \'}',
      'foo',
      '</div>'
    ].join('\n'),
    errors: [{message: '` foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  <span /> <input />',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  <span /> ',
      '{\' \'}',
      '<input />',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`input` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  <span />',
      '{\' \'}<input />',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  <span />',
      '{\' \'}',
      '<input />',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`input` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  {"foo"} <input />',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  {"foo"} ',
      '{\' \'}',
      '<input />',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`input` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  {"foo"} bar',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  {"foo"}',
      '{\' \'}',
      'bar',
      '</div>'
    ].join('\n'),
    errors: [{message: '` bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  foo {"bar"}',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  foo ',
      '{\' \'}',
      '{"bar"}',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`{"bar"}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>',
      '  <input /> {"foo"}',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '  <input /> ',
      '{\' \'}',
      '{"foo"}',
      '</div>'
    ].join('\n'),
    errors: [
      {message: '`{"foo"}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo></Foo><Bar></Bar>',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo></Foo>',
      '<Bar></Bar>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '<Foo></Foo></App>'
    ].join('\n'),
    output: [
      '<App>',
      '<Foo></Foo>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App><Foo />',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '<Foo/></App>'
    ].join('\n'),
    output: [
      '<App>',
      '<Foo/>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App><Foo',
      '/>',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '<Foo',
      '/>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '>',
      '<Foo /></App>'
    ].join('\n'),
    output: [
      '<App',
      '>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '>',
      '<Foo',
      '/></App>'
    ].join('\n'),
    output: [
      '<App',
      '>',
      '<Foo',
      '/>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '><Foo />',
      '</App>'
    ].join('\n'),
    output: [
      '<App',
      '>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo></Foo',
      '></App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo></Foo',
      '>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo></',
      'Foo></App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo></',
      'Foo>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo></',
      'Foo></App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo></',
      'Foo>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo></',
      'Foo><Bar />',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo></',
      'Foo>',
      '<Bar />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo>',
      '    <Bar /></Foo>',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo>',
      '    <Bar />',
      '</Foo>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Bar` must be placed on a new line'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo>',
      '    <Bar> baz </Bar>',
      '  </Foo>',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo>',
      '    <Bar>',
      '{\' \'}',
      'baz',
      '{\' \'}',
      '</Bar>',
      '  </Foo>',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '` baz ` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    // Would be nice to handle in one pass, but multipass works fine.
    code: [
      '<App>',
      '  foo {"bar"} baz',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  foo ',
      '{\' \'}',
      '{"bar"} baz',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '`{"bar"}` must be placed on a new line'},
      {message: '` baz` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    // Would be nice to handle in one pass, but multipass works fine.
    code: [
      '<App>',
      '  foo {"bar"}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  foo ',
      '{\' \'}',
      '{"bar"}',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '`{"bar"}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    // Would be nice to handle in one pass, but multipass works fine.
    code: [
      '<App>',
      '  foo ',
      '{\' \'}',
      '{"bar"} baz',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  foo ',
      '{\' \'}',
      '{"bar"}',
      '{\' \'}',
      'baz',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '` baz` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    // Would be nice to handle in one pass, but multipass works fine.
    code: [
      '<App>',
      '',
      '  foo {"bar"} baz',
      '',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '',
      '  foo ',
      '{\' \'}',
      '{"bar"} baz',
      '',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '`{"bar"}` must be placed on a new line'},
      {message: '` baz` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    // Would be nice to handle in one pass, but multipass works fine.
    code: [
      '<App>',
      '',
      '  foo ',
      '{\' \'}',
      '{"bar"} baz',
      '',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '',
      '  foo ',
      '{\' \'}',
      '{"bar"}',
      '{\' \'}',
      'baz',
      '',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '` baz` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>{',
      '  foo',
      '}</App>'
    ].join('\n'),
    output: [
      '<App>',
      '{',
      '  foo',
      '}',
      '</App>'
    ].join('\n'),
    errors: [
      {message: '`{  foo}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<App> {',
      '  foo',
      '} </App>'
    ].join('\n'),
    output: [
      '<App> ',
      '{\' \'}',
      '{',
      '  foo',
      '}',
      '{\' \'}',
      ' </App>'
    ].join('\n'),
    errors: [
      {message: '`{  foo}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: [
      '<App> ',
      '{\' \'}',
      '{',
      '  foo',
      '} </App>'
    ].join('\n'),
    output: [
      '<App> ',
      '{\' \'}',
      '{',
      '  foo',
      '}',
      '{\' \'}',
      ' </App>'
    ].join('\n'),
    errors: [
      {message: '`{  foo}` must be placed on a new line'}
    ],
    parserOptions: parserOptions
  }, {
    code: '<App><Foo /></App>',
    options: [{allow: 'none'}],
    output: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}]
  }, {
    code: '<App>foo</App>',
    options: [{allow: 'none'}],
    output: [
      '<App>',
      'foo',
      '</App>'
    ].join('\n'),
    errors: [{message: '`foo` must be placed on a new line'}]
  }, {
    code: '<App>{"foo"}</App>',
    options: [{allow: 'none'}],
    output: [
      '<App>',
      '{"foo"}',
      '</App>'
    ].join('\n'),
    errors: [{message: '`{"foo"}` must be placed on a new line'}]
  }, {
    code: [
      '<App>foo',
      '</App>'
    ].join('\n'),
    options: [{allow: 'literal'}],
    output: [
      '<App>',
      'foo',
      '</App>'
    ].join('\n'),
    errors: [{message: '`foo` must be placed on a new line'}]
  }, {
    code: '<App><Foo /></App>',
    options: [{allow: 'literal'}],
    output: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}]
  }, {
    code: [
      '<App',
      '  foo="1"',
      '  bar="2"',
      '>baz</App>'
    ].join('\n'),
    options: [{allow: 'literal'}],
    output: [
      '<App',
      '  foo="1"',
      '  bar="2"',
      '>',
      'baz',
      '</App>'
    ].join('\n'),
    errors: [{message: '`baz` must be placed on a new line'}]
  }, {
    code: [
      '<App>foo',
      'bar',
      '</App>'
    ].join('\n'),
    options: [{allow: 'literal'}],
    output: [
      '<App>',
      'foo',
      'bar',
      '</App>'
    ].join('\n'),
    errors: [{message: '`foobar` must be placed on a new line'}]
  }, {
    code: '<>{"foo"}</>',
    output: [
      '<>',
      '{"foo"}',
      '</>'
    ].join('\n'),
    errors: [{message: '`{"foo"}` must be placed on a new line'}],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo /><></>',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '  <Foo />',
      '<></>',
      '</App>'
    ].join('\n'),
    errors: [{message: '`<></>` must be placed on a new line'}],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      '<',
      '><Foo />',
      '</>'
    ].join('\n'),
    output: [
      '<',
      '>',
      '<Foo />',
      '</>'
    ].join('\n'),
    errors: [{message: '`Foo` must be placed on a new line'}],
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }]
});
