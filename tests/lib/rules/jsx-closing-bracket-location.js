/**
 * @fileoverview Validate closing bracket location in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-closing-bracket-location');
var RuleTester = require('eslint').RuleTester;

var MESSAGE_AFTER_PROPS = [{message: 'The closing bracket must be placed after the last prop'}];
var MESSAGE_AFTER_TAG = [{message: 'The closing bracket must be placed after the opening tag'}];
var MESSAGE_PROPS_ALIGNED = [{message: 'The closing bracket must be aligned with the last prop'}];
var MESSAGE_TAG_ALIGNED = [{message: 'The closing bracket must be aligned with the opening tag'}];

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-closing-bracket-location', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n'),
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: ['after-props'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: ['props-aligned'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo></App>'
    ].join('\n'),
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }} />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<Provider store>',
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<Provider ',
      '  store',
      '>',
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<Provider ',
      '  store>',
      '  <App ',
      '    foo',
      '  />',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'after-props'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<Provider store>',
      '  <App ',
      '    foo',
      '    />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<Provider',
      '  store',
      '  >',
      '  <App ',
      '    foo',
      '  />',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'props-aligned'}],
    ecmaFeatures: {jsx: true}
  }],

  invalid: [{
    code: [
      '<App ',
      '/>'
    ].join('\n'),
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_TAG
  }, {
    code: [
      '<App foo ',
      '/>'
    ].join('\n'),
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App foo',
      '></App>'
    ].join('\n'),
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_PROPS_ALIGNED
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_PROPS_ALIGNED
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_PROPS_ALIGNED
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }, {
    code: [
      '<Provider ',
      '  store>', // <--
      '  <App ',
      '    foo',
      '    />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }, {
    code: [
      '<Provider',
      '  store',
      '  >',
      '  <App ',
      '    foo',
      '    />', // <--
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'props-aligned'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }, {
    code: [
      '<Provider ',
      '  store>', // <--
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }, {
    code: [
      '<Provider ',
      '  store>',
      '  <App ',
      '    foo',
      '    />', // <--
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'after-props'}],
    ecmaFeatures: {jsx: true},
    errors: MESSAGE_TAG_ALIGNED
  }]
});
