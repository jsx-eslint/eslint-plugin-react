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

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

var MESSAGE_AFTER_PROPS = [{message: 'The closing bracket must be placed after the last prop'}];
var MESSAGE_AFTER_TAG = [{message: 'The closing bracket must be placed after the opening tag'}];

var MESSAGE_PROPS_ALIGNED = 'The closing bracket must be aligned with the last prop';
var MESSAGE_TAG_ALIGNED = 'The closing bracket must be aligned with the opening tag';
var MESSAGE_LINE_ALIGNED = 'The closing bracket must be aligned with the line containing the opening tag';

var messageWithDetails = function(message, expectedColumn, expectedNextLine) {
  var details = ' (expected column ' + expectedColumn +
    (expectedNextLine ? ' on the next line)' : ')');
  return message + details;
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-closing-bracket-location', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: ['after-props'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: ['props-aligned'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo></App>'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }} />'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}/>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}/>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<Provider store>',
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}],
    parserOptions: parserOptions
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
    parserOptions: parserOptions
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
    parserOptions: parserOptions
  }, {
    code: [
      '<Provider store>',
      '  <App ',
      '    foo',
      '    />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}],
    parserOptions: parserOptions
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
    parserOptions: parserOptions
  }, {
    code: [
      'var x = function() {',
      '  return <App',
      '    foo',
      '         >',
      '      bar',
      '         </App>',
      '}'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      'var x = function() {',
      '  return <App',
      '    foo',
      '         />',
      '}'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      'var x = <App',
      '  foo',
      '        />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      'var x = function() {',
      '  return <App',
      '    foo={function() {',
      '      console.log(\'bar\');',
      '    }}',
      '  />',
      '}'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      'var x = <App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<Provider',
      '  store',
      '>',
      '  <App',
      '    foo={function() {',
      '      console.log(\'bar\');',
      '    }}',
      '  />',
      '</Provider>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<Provider',
      '  store',
      '>',
      '  {baz && <App',
      '    foo={function() {',
      '      console.log(\'bar\');',
      '    }}',
      '  />}',
      '</Provider>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo',
      '    bar',
      '  >',
      '  </Foo>',
      '  <Foo',
      '    bar />',
      '</App>'
    ].join('\n'),
    options: [{
      nonEmpty: false,
      selfClosing: 'after-props'
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App>',
      '  <Foo',
      '    bar>',
      '  </Foo>',
      '  <Foo',
      '    bar',
      '  />',
      '</App>'
    ].join('\n'),
    options: [{
      nonEmpty: 'after-props',
      selfClosing: false
    }],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      '<App ',
      '/>'
    ].join('\n'),
    output: [
      '<App />'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_TAG
  }, {
    code: [
      '<App foo ',
      '/>'
    ].join('\n'),
    output: [
      '<App foo/>'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App foo',
      '></App>'
    ].join('\n'),
    output: [
      '<App foo></App>'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    output: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 3, true),
      line: 2,
      column: 7
    }]
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    output: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 7
    }]
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    output: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, true),
      line: 2,
      column: 7
    }]
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    output: [
      '<App ',
      '  foo/>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    output: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 3, false),
      line: 3,
      column: 1
    }]
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    output: [
      '<App ',
      '  foo/>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    output: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, false),
      line: 3,
      column: 3
    }]
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    output: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, false),
      line: 3,
      column: 3
    }]
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    output: [
      '<App',
      '  foo></App>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    output: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 3, false),
      line: 3,
      column: 1
    }]
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    output: [
      '<App',
      '  foo></App>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    parserOptions: parserOptions,
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    output: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, false),
      line: 3,
      column: 3
    }]
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    output: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, false),
      line: 3,
      column: 3
    }]
  }, {
    code: [
      '<Provider ',
      '  store>', // <--
      '  <App ',
      '    foo',
      '    />',
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider ',
      '  store',
      '>',
      '  <App ',
      '    foo',
      '    />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 8
    }]
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
    output: [
      '<Provider',
      '  store',
      '  >',
      '  <App ',
      '    foo',
      '  />',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'props-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 3, false),
      line: 6,
      column: 5
    }]
  }, {
    code: [
      '<Provider ',
      '  store>', // <--
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider ',
      '  store',
      '>',
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 8
    }]
  }, {
    code: [
      '<Provider ',
      '  store>',
      '  <App ',
      '    foo',
      '    />', // <--
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider ',
      '  store>',
      '  <App ',
      '    foo',
      '  />', // <--
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'after-props'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 3, false),
      line: 5,
      column: 5
    }]
  }, {
    code: [
      'var x = function() {',
      '  return <App',
      '    foo',
      '         />',
      '}'
    ].join('\n'),
    output: [
      'var x = function() {',
      '  return <App',
      '    foo',
      '  />',
      '}'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 3, false),
      line: 4,
      column: 10
    }]
  }, {
    code: [
      'var x = <App',
      '  foo',
      '        />'
    ].join('\n'),
    output: [
      'var x = <App',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, false),
      line: 3,
      column: 9
    }]
  }, {
    code: [
      'var x = (',
      '  <div',
      '    className="MyComponent"',
      '    {...props} />',
      ')'
    ].join('\n'),
    output: [
      'var x = (',
      '  <div',
      '    className="MyComponent"',
      '    {...props}',
      '  />',
      ')'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 3, true),
      line: 4,
      column: 16
    }]
  }, {
    code: [
      'var x = (',
      '  <Something',
      '    content={<Foo />} />',
      ')'
    ].join('\n'),
    output: [
      'var x = (',
      '  <Something',
      '    content={<Foo />}',
      '  />',
      ')'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 3, true),
      line: 3,
      column: 23
    }]
  }, {
    code: [
      'var x = (',
      '  <Something ',
      '    />',
      ')'
    ].join('\n'),
    output: [
      'var x = (',
      '  <Something />',
      ')'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    parserOptions: parserOptions,
    errors: [MESSAGE_AFTER_TAG]
  }]
});
