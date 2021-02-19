/**
 * @fileoverview Validate JSX maximum depth
 * @author Chris<wfsr@foxmail.com>
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-max-depth');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  sourceType: 'module',
  ecmaVersion: 2015,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-max-depth', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <foo />',
      '</App>'
    ].join('\n'),
    options: [{max: 1}]
  }, {
    code: [
      '<App>',
      '  <foo>',
      '    <bar />',
      '  </foo>',
      '</App>'
    ].join('\n')
  }, {
    code: [
      '<App>',
      '  <foo>',
      '    <bar />',
      '  </foo>',
      '</App>'
    ].join('\n'),
    options: [{max: 2}]
  }, {
    code: [
      'const x = <div><em>x</em></div>;',
      '<div>{x}</div>'
    ].join('\n'),
    options: [{max: 2}]
  }, {
    code: 'const foo = (x) => <div><em>{x}</em></div>;',
    options: [{max: 2}]
  }, {
    code: [
      '<></>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<>',
      '  <foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 1}]
  }, {
    code: [
      'const x = <><em>x</em></>;',
      '<>{x}</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 2}]
  }, {
    code: `
      const x = (
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
      );
      <tbody>
        {x}
      </tbody>
    `,
    options: [{max: 2}]
  }, {
    code: [
      'const Example = props => {',
      '  for (let i = 0; i < length; i++) {',
      '    return <Text key={i} />;',
      '  }',
      '};'
    ].join('\n'),
    options: [{max: 1}]
  }, {
    code: [
      'export function MyComponent() {',
      '  const A = <React.Fragment>{<div />}</React.Fragment>;',
      '  return <div>{A}</div>;',
      '}'
    ].join('\n')
  }],

  invalid: [{
    code: [
      '<App>',
      '  <foo />',
      '</App>'
    ].join('\n'),
    options: [{max: 0}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 0, but found 1.'}]
  }, {
    code: [
      '<App>',
      '  <foo>{bar}</foo>',
      '</App>'
    ].join('\n'),
    options: [{max: 0}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 0, but found 1.'}]
  }, {
    code: [
      '<App>',
      '  <foo>',
      '    <bar />',
      '  </foo>',
      '</App>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}]
  }, {
    code: [
      'const x = <div><span /></div>;',
      '<div>{x}</div>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}]
  }, {
    code: [
      'const x = <div><span /></div>;',
      'let y = x;',
      '<div>{y}</div>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}]
  }, {
    code: [
      'const x = <div><span /></div>;',
      'let y = x;',
      '<div>{x}-{y}</div>'
    ].join('\n'),
    options: [{max: 1}],
    errors: [
      {message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'},
      {message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}
    ]
  }, {
    code: [
      '<div>',
      '{<div><div><span /></div></div>}',
      '</div>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 2, but found 3.'}]
  }, {
    code: [
      '<>',
      '  <foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 0}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 0, but found 1.'}]
  }, {
    code: [
      '<>',
      '  <>',
      '    <bar />',
      '  </>',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 1}],
    errors: [{message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}]
  }, {
    code: [
      'const x = <><span /></>;',
      'let y = x;',
      '<>{x}-{y}</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT,
    options: [{max: 1}],
    errors: [
      {message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'},
      {message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}
    ]
  }, {
    code: `
      const x = (
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
      );
      <tbody>
        {x}
      </tbody>
    `,
    options: [{max: 1}],
    errors: [
      {message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'},
      {message: 'Expected the depth of nested jsx elements to be <= 1, but found 2.'}
    ]
  }]
});
