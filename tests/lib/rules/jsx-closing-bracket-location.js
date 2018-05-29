/**
 * @fileoverview Validate closing bracket location in JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-closing-bracket-location');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};
const MESSAGE_AFTER_PROPS = [{message: 'The closing bracket must be placed after the last prop'}];
const MESSAGE_AFTER_TAG = [{message: 'The closing bracket must be placed after the opening tag'}];

const MESSAGE_PROPS_ALIGNED = 'The closing bracket must be aligned with the last prop';
const MESSAGE_TAG_ALIGNED = 'The closing bracket must be aligned with the opening tag';
const MESSAGE_LINE_ALIGNED = 'The closing bracket must be aligned with the line containing the opening tag';

const messageWithDetails = function(message, expectedColumn, expectedNextLine) {
  const details = ` (expected column ${expectedColumn}${expectedNextLine ? ' on the next line)' : ')'}`;
  return message + details;
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-closing-bracket-location', rule, {
  valid: [{
    code: [
      '<App />'
    ].join('\n')
  }, {
    code: [
      '<App foo />'
    ].join('\n')
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n')
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App foo />'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: ['after-props']
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: ['props-aligned']
  }, {
    code: [
      '<App ',
      '  foo />'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App ',
      '  foo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App ',
      '  foo',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App foo></App>'
    ].join('\n')
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App',
      '  foo',
      '></App>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App',
      '  foo',
      '  ></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }} />'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '  />'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}/>'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App foo={function() {',
      '       console.log(\'bar\');',
      '     }}',
      '     />'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App foo={function() {',
      '  console.log(\'bar\');',
      '}}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<Provider store>',
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}]
  }, {
    code: [
      '<Provider ',
      '  store',
      '>',
      '  <App',
      '    foo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}]
  }, {
    code: [
      '<Provider ',
      '  store>',
      '  <App ',
      '    foo',
      '  />',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'after-props'}]
  }, {
    code: [
      '<Provider store>',
      '  <App ',
      '    foo',
      '    />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}]
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
    options: [{nonEmpty: 'props-aligned'}]
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
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      'var x = function() {',
      '  return <App',
      '    foo',
      '         />',
      '}'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      'var x = <App',
      '  foo',
      '        />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
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
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      'var x = <App',
      '  foo={function() {',
      '    console.log(\'bar\');',
      '  }}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
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
    options: [{location: 'line-aligned'}]
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
    options: [{location: 'line-aligned'}]
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
    }]
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
    }]
  }, {
    code: [
      '<div className={[',
      '  "some",',
      '  "stuff",',
      '  2 ]}',
      '>',
      '  Some text',
      '</div>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n')
  }, {
    code: [
      '<App ',
      '\tfoo />'
    ].join('\n'),
    options: ['after-props']
  }, {
    code: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    options: ['props-aligned']
  }, {
    code: [
      '<App ',
      '\tfoo />'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App',
      '\tfoo',
      '></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App',
      '\tfoo',
      '></App>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App',
      '\tfoo',
      '\t></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App',
      '\tfoo={function() {',
      '\t\tconsole.log(\'bar\');',
      '\t}} />'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App',
      '\tfoo={function() {',
      '\t\tconsole.log(\'bar\');',
      '\t}}',
      '\t/>'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App',
      '\tfoo={function() {',
      '\t\tconsole.log(\'bar\');',
      '\t}}',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App',
      '\tfoo={function() {',
      '\t\tconsole.log(\'bar\');',
      '\t}}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App foo={function() {',
      '\tconsole.log(\'bar\');',
      '}}/>'
    ].join('\n'),
    options: [{location: 'after-props'}]
  }, {
    code: [
      '<App foo={function() {',
      '\t\t\tconsole.log(\'bar\');',
      '\t\t}}',
      '     />'
    ].join('\n'),
    options: [{location: 'props-aligned'}]
  }, {
    code: [
      '<App foo={function() {',
      '\tconsole.log(\'bar\');',
      '}}',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      '<App foo={function() {',
      '\tconsole.log(\'bar\');',
      '}}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<Provider store>',
      '\t<App',
      '\t\tfoo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}]
  }, {
    code: [
      '<Provider ',
      '\tstore',
      '>',
      '\t<App',
      '\t\tfoo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}]
  }, {
    code: [
      '<Provider ',
      '\tstore>',
      '\t<App ',
      '\t\tfoo',
      '\t/>',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'after-props'}]
  }, {
    code: [
      '<Provider store>',
      '\t<App ',
      '\t\tfoo',
      '\t\t/>',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}]
  }, {
    code: [
      '<Provider',
      '\tstore',
      '\t>',
      '\t<App ',
      '\t\tfoo',
      '\t/>',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'props-aligned'}]
  }, {
    code: [
      'var x = function() {',
      '\treturn <App',
      '\t\tfoo',
      '\t       >',
      '\t\t\tbar',
      '\t       </App>',
      '}'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      'var x = function() {',
      '\treturn <App',
      '\t\tfoo',
      '\t       />',
      '}'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      'var x = <App',
      '\tfoo',
      '        />'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }, {
    code: [
      'var x = function() {',
      '\treturn <App',
      '\t\tfoo={function() {',
      '\t\t\tconsole.log(\'bar\');',
      '\t\t}}',
      '\t/>',
      '}'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      'var x = <App',
      '\tfoo={function() {',
      '\t\tconsole.log(\'bar\');',
      '\t}}',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<Provider',
      '\tstore',
      '>',
      '\t<App',
      '\t\tfoo={function() {',
      '\t\t\tconsole.log(\'bar\');',
      '\t\t}}',
      '\t/>',
      '</Provider>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<Provider',
      '\tstore',
      '>',
      '\t{baz && <App',
      '\t\tfoo={function() {',
      '\t\t\tconsole.log(\'bar\');',
      '\t\t}}',
      '\t/>}',
      '</Provider>'
    ].join('\n'),
    options: [{location: 'line-aligned'}]
  }, {
    code: [
      '<App>',
      '\t<Foo',
      '\t\tbar',
      '\t>',
      '\t</Foo>',
      '\t<Foo',
      '\t\tbar />',
      '</App>'
    ].join('\n'),
    options: [{
      nonEmpty: false,
      selfClosing: 'after-props'
    }]
  }, {
    code: [
      '<App>',
      '\t<Foo',
      '\t\tbar>',
      '\t</Foo>',
      '\t<Foo',
      '\t\tbar',
      '\t/>',
      '</App>'
    ].join('\n'),
    options: [{
      nonEmpty: 'after-props',
      selfClosing: false
    }]
  }, {
    code: [
      '<div className={[',
      '\t"some",',
      '\t"stuff",',
      '\t2 ]}',
      '>',
      '\tSome text',
      '</div>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}]
  }],

  invalid: [{
    code: [
      '<App ',
      '/>'
    ].join('\n'),
    output: [
      '<App />'
    ].join('\n'),
    errors: MESSAGE_AFTER_TAG
  }, {
    code: [
      '<App foo ',
      '/>'
    ].join('\n'),
    output: [
      '<App foo/>'
    ].join('\n'),
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App foo',
      '></App>'
    ].join('\n'),
    output: [
      '<App foo></App>'
    ].join('\n'),
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
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 8
    }]
  }, {
    code: [
      'const Button = function(props) {',
      '  return (',
      '    <Button',
      '      size={size}',
      '      onClick={onClick}',
      '                                    >',
      '      Button Text',
      '    </Button>',
      '  );',
      '};'
    ].join('\n'),
    output: [
      'const Button = function(props) {',
      '  return (',
      '    <Button',
      '      size={size}',
      '      onClick={onClick}',
      '      >',
      '      Button Text',
      '    </Button>',
      '  );',
      '};'
    ].join('\n'),
    options: ['props-aligned'],
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 7, false),
      line: 6,
      column: 37
    }]
  }, {
    code: [
      'const Button = function(props) {',
      '  return (',
      '    <Button',
      '      size={size}',
      '      onClick={onClick}',
      '                                    >',
      '      Button Text',
      '    </Button>',
      '  );',
      '};'
    ].join('\n'),
    output: [
      'const Button = function(props) {',
      '  return (',
      '    <Button',
      '      size={size}',
      '      onClick={onClick}',
      '    >',
      '      Button Text',
      '    </Button>',
      '  );',
      '};'
    ].join('\n'),
    options: ['tag-aligned'],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 5, false),
      line: 6,
      column: 37
    }]
  }, {
    code: [
      'const Button = function(props) {',
      '  return (',
      '    <Button',
      '      size={size}',
      '      onClick={onClick}',
      '                                    >',
      '      Button Text',
      '    </Button>',
      '  );',
      '};'
    ].join('\n'),
    output: [
      'const Button = function(props) {',
      '  return (',
      '    <Button',
      '      size={size}',
      '      onClick={onClick}',
      '    >',
      '      Button Text',
      '    </Button>',
      '  );',
      '};'
    ].join('\n'),
    options: ['line-aligned'],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 5, false),
      line: 6,
      column: 37
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
    errors: [MESSAGE_AFTER_TAG]
  }, {
    code: [
      '<div className={[',
      '  "some",',
      '  "stuff",',
      '  2 ]}>',
      '  Some text',
      '</div>'
    ].join('\n'),
    output: [
      '<div className={[',
      '  "some",',
      '  "stuff",',
      '  2 ]}',
      '>',
      '  Some text',
      '</div>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 4,
      column: 7
    }]
  }, {
    code: [
      '<App ',
      '\tfoo />'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 2, true),
      line: 2,
      column: 6
    }]
  }, {
    code: [
      '<App ',
      '\tfoo />'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 6
    }]
  }, {
    code: [
      '<App ',
      '\tfoo />'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, true),
      line: 2,
      column: 6
    }]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo/>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 2, false),
      line: 3,
      column: 1
    }]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo/>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, false),
      line: 3,
      column: 2
    }]
  }, {
    code: [
      '<App ',
      '\tfoo',
      '\t/>'
    ].join('\n'),
    output: [
      '<App ',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, false),
      line: 3,
      column: 2
    }]
  }, {
    code: [
      '<App',
      '\tfoo',
      '></App>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo></App>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App',
      '\tfoo',
      '></App>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '\t></App>'
    ].join('\n'),
    options: [{location: 'props-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 2, false),
      line: 3,
      column: 1
    }]
  }, {
    code: [
      '<App',
      '\tfoo',
      '\t></App>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo></App>'
    ].join('\n'),
    options: [{location: 'after-props'}],
    errors: MESSAGE_AFTER_PROPS
  }, {
    code: [
      '<App',
      '\tfoo',
      '\t></App>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '></App>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, false),
      line: 3,
      column: 2
    }]
  }, {
    code: [
      '<App',
      '\tfoo',
      '\t></App>'
    ].join('\n'),
    output: [
      '<App',
      '\tfoo',
      '></App>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, false),
      line: 3,
      column: 2
    }]
  }, {
    code: [
      '<Provider ',
      '\tstore>', // <--
      '\t<App ',
      '\t\tfoo',
      '\t\t/>',
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider ',
      '\tstore',
      '>',
      '\t<App ',
      '\t\tfoo',
      '\t\t/>',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'props-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 7
    }]
  }, {
    code: [
      'const Button = function(props) {',
      '\treturn (',
      '\t\t<Button',
      '\t\t\tsize={size}',
      '\t\t\tonClick={onClick}',
      '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>',
      '\t\t\tButton Text',
      '\t\t</Button>',
      '\t);',
      '};'
    ].join('\n'),
    output: [
      'const Button = function(props) {',
      '\treturn (',
      '\t\t<Button',
      '\t\t\tsize={size}',
      '\t\t\tonClick={onClick}',
      '\t\t\t>',
      '\t\t\tButton Text',
      '\t\t</Button>',
      '\t);',
      '};'
    ].join('\n'),
    options: ['props-aligned'],
    errors: [{
      message: messageWithDetails(MESSAGE_PROPS_ALIGNED, 4, false),
      line: 6,
      column: 19
    }]
  }, {
    code: [
      'const Button = function(props) {',
      '\treturn (',
      '\t\t<Button',
      '\t\t\tsize={size}',
      '\t\t\tonClick={onClick}',
      '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>',
      '\t\t\tButton Text',
      '\t\t</Button>',
      '\t);',
      '};'
    ].join('\n'),
    output: [
      'const Button = function(props) {',
      '\treturn (',
      '\t\t<Button',
      '\t\t\tsize={size}',
      '\t\t\tonClick={onClick}',
      '\t\t>',
      '\t\t\tButton Text',
      '\t\t</Button>',
      '\t);',
      '};'
    ].join('\n'),
    options: ['tag-aligned'],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 3, false),
      line: 6,
      column: 19
    }]
  }, {
    code: [
      'const Button = function(props) {',
      '\treturn (',
      '\t\t<Button',
      '\t\t\tsize={size}',
      '\t\t\tonClick={onClick}',
      '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>',
      '\t\t\tButton Text',
      '\t\t</Button>',
      '\t);',
      '};'
    ].join('\n'),
    output: [
      'const Button = function(props) {',
      '\treturn (',
      '\t\t<Button',
      '\t\t\tsize={size}',
      '\t\t\tonClick={onClick}',
      '\t\t>',
      '\t\t\tButton Text',
      '\t\t</Button>',
      '\t);',
      '};'
    ].join('\n'),
    options: ['line-aligned'],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 3, false),
      line: 6,
      column: 19
    }]
  }, {
    code: [
      '<Provider',
      '\tstore',
      '\t>',
      '\t<App ',
      '\t\tfoo',
      '\t\t/>', // <--
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider',
      '\tstore',
      '\t>',
      '\t<App ',
      '\t\tfoo',
      '\t/>',
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'props-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 2, false),
      line: 6,
      column: 3
    }]
  }, {
    code: [
      '<Provider ',
      '\tstore>', // <--
      '\t<App',
      '\t\tfoo />',
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider ',
      '\tstore',
      '>',
      '\t<App',
      '\t\tfoo />',
      '</Provider>'
    ].join('\n'),
    options: [{selfClosing: 'after-props'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 2,
      column: 7
    }]
  }, {
    code: [
      '<Provider ',
      '\tstore>',
      '\t<App ',
      '\t\tfoo',
      '\t\t/>', // <--
      '</Provider>'
    ].join('\n'),
    output: [
      '<Provider ',
      '\tstore>',
      '\t<App ',
      '\t\tfoo',
      '\t/>', // <--
      '</Provider>'
    ].join('\n'),
    options: [{nonEmpty: 'after-props'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 2, false),
      line: 5,
      column: 3
    }]
  }, {
    code: [
      'var x = function() {',
      '\treturn <App',
      '\t\tfoo',
      '\t\t\t\t />',
      '}'
    ].join('\n'),
    output: [
      'var x = function() {',
      '\treturn <App',
      '\t\tfoo',
      '\t/>',
      '}'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 2, false),
      line: 4,
      column: 6
    }]
  }, {
    code: [
      'var x = <App',
      '\tfoo',
      '        />'
    ].join('\n'),
    output: [
      'var x = <App',
      '\tfoo',
      '/>'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 1, false),
      line: 3,
      column: 9
    }]
  }, {
    code: [
      'var x = (',
      '\t<div',
      '\t\tclassName="MyComponent"',
      '\t\t{...props} />',
      ')'
    ].join('\n'),
    output: [
      'var x = (',
      '\t<div',
      '\t\tclassName="MyComponent"',
      '\t\t{...props}',
      '\t/>',
      ')'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 2, true),
      line: 4,
      column: 14
    }]
  }, {
    code: [
      'var x = (',
      '\t<Something',
      '\t\tcontent={<Foo />} />',
      ')'
    ].join('\n'),
    output: [
      'var x = (',
      '\t<Something',
      '\t\tcontent={<Foo />}',
      '\t/>',
      ')'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_LINE_ALIGNED, 2, true),
      line: 3,
      column: 21
    }]
  }, {
    code: [
      'var x = (',
      '\t<Something ',
      '\t\t/>',
      ')'
    ].join('\n'),
    output: [
      'var x = (',
      '\t<Something />',
      ')'
    ].join('\n'),
    options: [{location: 'line-aligned'}],
    errors: [MESSAGE_AFTER_TAG]
  }, {
    code: [
      '<div className={[',
      '\t"some",',
      '\t"stuff",',
      '\t2 ]}>',
      '\tSome text',
      '</div>'
    ].join('\n'),
    output: [
      '<div className={[',
      '\t"some",',
      '\t"stuff",',
      '\t2 ]}',
      '>',
      '\tSome text',
      '</div>'
    ].join('\n'),
    options: [{location: 'tag-aligned'}],
    errors: [{
      message: messageWithDetails(MESSAGE_TAG_ALIGNED, 1, true),
      line: 4,
      column: 6
    }]
  }]
});
