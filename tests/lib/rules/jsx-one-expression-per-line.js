/**
 * @fileoverview Limit to one expression per line in JSX
 * @author Mark Ivan Allen <Vydia.com>
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-one-expression-per-line');

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
ruleTester.run('jsx-one-expression-per-line', rule, {
  valid: [{
    code: '<App />'
  }, {
    code: `
\t\t<AllTabs>
\t\t\tFail
\t\t</AllTabs>
    `
  }, {
    code: `
\t\t<TagsWithTabs>
      Fail
\t\t</TagsWithTabs>
    `
  }, {
    code: `
    <ClosedTagWithTabs>
      Fail
\t\t</ClosedTagWithTabs>
    `
  }, {
    code: `
\t\t<OpenTagWithTabs>
      OK
    </OpenTagWithTabs>
    `
  }, {
    code: `
    <TextWithTabs>
\t\t\tOK
    </TextWithTabs>
    `
  }, {
    code: `
    <AllSpaces>
      OK
    </AllSpaces>
    `
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
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<>',
      '  <Foo />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      '<>',
      '  <Foo />',
      '  <Bar />',
      '</>'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }],

  invalid: [{
    code: '<App>{"foo"}</App>',
    output: [
      '<App>',
      '{"foo"}',
      '</App>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: '{"foo"}'}
    }],
    parserOptions
  }, {
    code: '<App>foo</App>',
    output: [
      '<App>',
      'foo',
      '</App>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'foo'}
    }],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{"bar"}'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: ' bar'}
      }
    ],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Bar'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: '{"foo"}'}
    }],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{ I18n.t(\'baz\') }'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{ bar }'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Text'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{ I18n.t(\'baz\') }'}
      }
    ],
    parserOptions

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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Bar'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Baz'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Bar'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Baz'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Bunk'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Bruno'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Bar'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Bar'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'Baz'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{ I18n.t(\'baz\') }'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'input'}
      }
    ],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'span'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'input'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: ' foo'}
    }],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'input'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'input'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'input'}
      }
    ],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: ' bar'}
    }],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{"foo"}'}
      }
    ],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Bar'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parserOptions,
    parser: parsers.BABEL_ESLINT
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Bar'}
    }],
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Bar'}
    }],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: ' baz '}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{"bar"}'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: ' baz'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{"bar"}'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: ' baz'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{"bar"}'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: ' baz'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: ' baz'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{  foo}'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{  foo}'}
      }
    ],
    parserOptions
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
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{  foo}'}
      }
    ],
    parserOptions
  }, {
    code: '<App><Foo /></App>',
    options: [{allow: 'none'}],
    output: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }]
  }, {
    code: '<App>foo</App>',
    options: [{allow: 'none'}],
    output: [
      '<App>',
      'foo',
      '</App>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'foo'}
    }]
  }, {
    code: '<App>{"foo"}</App>',
    options: [{allow: 'none'}],
    output: [
      '<App>',
      '{"foo"}',
      '</App>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: '{"foo"}'}
    }]
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'foo'}
    }]
  }, {
    code: '<App><Foo /></App>',
    options: [{allow: 'literal'}],
    output: [
      '<App>',
      '<Foo />',
      '</App>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }]
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'baz'}
    }]
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'foobar'}
    }]
  }, {
    code: '<>{"foo"}</>',
    output: [
      '<>',
      '{"foo"}',
      '</>'
    ].join('\n'),
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: '{"foo"}'}
    }],
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: '<></>'}
    }],
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    errors: [{
      messageId: 'moveToNewLine',
      data: {descriptor: 'Foo'}
    }],
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: [
      '<div>',
      '<MyComponent>a</MyComponent>',
      '<MyOther>{a}</MyOther>',
      '</div>'
    ].join('\n'),
    output: [
      '<div>',
      '<MyComponent>',
      'a',
      '</MyComponent>',
      '<MyOther>',
      '{a}',
      '</MyOther>',
      '</div>'
    ].join('\n'),
    errors: [
      {
        messageId: 'moveToNewLine',
        data: {descriptor: 'a'}
      },
      {
        messageId: 'moveToNewLine',
        data: {descriptor: '{a}'}
      }
    ],
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }]
});
