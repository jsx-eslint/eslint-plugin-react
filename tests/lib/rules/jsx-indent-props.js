/**
 * @fileoverview Validate props indentation in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-indent-props');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-indent-props', rule, {
  valid: [{
    code: [
      '<App foo',
      '/>'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    options: [2]
  }, {
    code: [
      '<App',
      'foo',
      '/>'
    ].join('\n'),
    options: [0]
  }, {
    code: [
      '  <App',
      'foo',
      '  />'
    ].join('\n'),
    options: [-2]
  }, {
    code: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab']
  }, {
    code: [
      '<App/>'
    ].join('\n'),
    options: ['aligned']
  }, {
    code: [
      '<App aaa',
      '     b',
      '     cc',
      '/>'
    ].join('\n'),
    options: ['aligned']
  }, {
    code: [
      'const test = <App aaa',
      '                  b',
      '                  cc',
      '             />'
    ].join('\n'),
    options: ['aligned']
  }, {
    code: [
      '<App aaa x',
      '     b y',
      '     cc',
      '/>'
    ].join('\n'),
    options: ['aligned']
  }, {
    code: [
      'const test = <App aaa x',
      '                  b y',
      '                  cc',
      '             />'
    ].join('\n'),
    options: ['aligned']
  }, {
    code: [
      '<App aaa',
      '     b',
      '>',
      '    <Child c',
      '           d/>',
      '</App>'
    ].join('\n'),
    options: ['aligned']
  }, {
    code: [
      '<Fragment>',
      '  <App aaa',
      '       b',
      '       cc',
      '  />',
      '  <OtherApp a',
      '            bbb',
      '            c',
      '  />',
      '</Fragment>'
    ].join('\n'),
    options: ['aligned']
  }],

  invalid: [{
    code: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    errors: [{message: 'Expected indentation of 4 space characters but found 2.'}]
  }, {
    code: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '  foo',
      '/>'
    ].join('\n'),
    options: [2],
    errors: [{message: 'Expected indentation of 2 space characters but found 4.'}]
  }, {
    code: [
      '<App',
      '    foo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab'],
    errors: [{message: 'Expected indentation of 1 tab character but found 0.'}]
  }, {
    code: [
      '<App',
      '\t\t\tfoo',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: ['tab'],
    errors: [{message: 'Expected indentation of 1 tab character but found 3.'}]
  }, {
    code: [
      '<App a',
      '  b',
      '/>'
    ].join('\n'),
    output: [
      '<App a',
      '     b',
      '/>'
    ].join('\n'),
    options: ['aligned'],
    errors: [{message: 'Expected indentation of 5 space characters but found 2.'}]
  }, {
    code: [
      '<App a x',
      '  b y',
      '/>'
    ].join('\n'),
    output: [
      '<App a x',
      '     b y',
      '/>'
    ].join('\n'),
    options: ['aligned'],
    errors: [{message: 'Expected indentation of 5 space characters but found 2.'}]
  }, {
    code: [
      '<App  a',
      '   b',
      '/>'
    ].join('\n'),
    output: [
      '<App  a',
      '      b',
      '/>'
    ].join('\n'),
    options: ['aligned'],
    errors: [
      {message: 'Found too much whitespace between tag name and first attribute.'},
      {message: 'Expected indentation of 6 space characters but found 3.'}
    ]
  }, {
    code: [
      '<App',
      '      a',
      '   b',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '      a',
      '      b',
      '/>'
    ].join('\n'),
    options: ['aligned'],
    errors: [
      {message: 'Found too much whitespace between tag name and first attribute.'},
      {message: 'Expected indentation of 6 space characters but found 3.'}
    ]
  }, {
    code: [
      '<App',
      '  a',
      '  b',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '     a',
      '     b',
      '/>'
    ].join('\n'),
    options: ['aligned'],
    errors: [
      {message: 'Expected indentation of 5 space characters but found 2.'},
      {message: 'Expected indentation of 5 space characters but found 2.'}
    ]
  }]
});
