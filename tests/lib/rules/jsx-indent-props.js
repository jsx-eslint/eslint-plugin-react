/**
 * @fileoverview Validate props indentation in JSX
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-indent-props');

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
      'const Test = () => ([',
      '  (x',
      '    ? <div key="1" />',
      '    : <div key="2" />),',
      '  <div',
      '    key="3"',
      '    align="left"',
      '  />,',
      '  <div',
      '    key="4"',
      '    align="left"',
      '  />,',
      ']);'
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
    options: ['first']
  }, {
    code: [
      '<App aaa',
      '     b',
      '     cc',
      '/>'
    ].join('\n'),
    options: ['first']
  }, {
    code: [
      '<App   aaa',
      '       b',
      '       cc',
      '/>'
    ].join('\n'),
    options: ['first']
  }, {
    code: [
      'const test = <App aaa',
      '                  b',
      '                  cc',
      '             />'
    ].join('\n'),
    options: ['first']
  }, {
    code: [
      '<App aaa x',
      '     b y',
      '     cc',
      '/>'
    ].join('\n'),
    options: ['first']
  }, {
    code: [
      'const test = <App aaa x',
      '                  b y',
      '                  cc',
      '             />'
    ].join('\n'),
    options: ['first']
  }, {
    code: [
      '<App aaa',
      '     b',
      '>',
      '    <Child c',
      '           d/>',
      '</App>'
    ].join('\n'),
    options: ['first']
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
    options: ['first']
  }, {
    code: [
      '<App',
      '  a',
      '  b',
      '/>'
    ].join('\n'),
    options: ['first']
  }, {
    code: [
      '{this.props.ignoreTernaryOperatorFalse',
      '  ? <span',
      '      className="value"',
      '      some={{aaa}}',
      '    />',
      '  : null}'
    ].join('\n'),
    output: [
      '{this.props.ignoreTernaryOperatorFalse',
      '  ? <span',
      '    className="value"',
      '    some={{aaa}}',
      '  />',
      '  : null}'
    ].join('\n'),
    options: [{
      indentMode: 2,
      ignoreTernaryOperator: false
    }]
  }, {
    code: [
      '{this.props.ignoreTernaryOperatorTrue',
      '  ? <span',
      '    className="value"',
      '    some={{aaa}}',
      '    />',
      '  : null}'
    ].join('\n'),
    output: [
      '{this.props.ignoreTernaryOperatorTrue',
      '  ? <span',
      '    className="value"',
      '    some={{aaa}}',
      '  />',
      '  : null}'
    ].join('\n'),
    options: [{
      indentMode: 2,
      ignoreTernaryOperator: true
    }]
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
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 4, type: 'space', characters: 'characters', gotten: 2
      }
    }]
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
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 2, type: 'space', characters: 'characters', gotten: 4
      }
    }]
  }, {
    code: [
      'const test = true',
      '  ? <span',
      '    attr="value"',
      '    />',
      '  : <span',
      '    attr="otherValue"',
      '    />'
    ].join('\n'),
    output: [
      'const test = true',
      '  ? <span',
      '      attr="value"',
      '    />',
      '  : <span',
      '      attr="otherValue"',
      '    />'
    ].join('\n'),
    options: [2],
    errors: [
      {
        messageId: 'wrongIndent',
        data: {
          needed: 6, type: 'space', characters: 'characters', gotten: 4
        }
      }, {
        messageId: 'wrongIndent',
        data: {
          needed: 6, type: 'space', characters: 'characters', gotten: 4
        }
      }
    ]
  }, {
    code: [
      'const test = true',
      '  ? <span attr="value" />',
      '  : (',
      '    <span',
      '        attr="otherValue"',
      '    />',
      '  )'
    ].join('\n'),
    output: [
      'const test = true',
      '  ? <span attr="value" />',
      '  : (',
      '    <span',
      '      attr="otherValue"',
      '    />',
      '  )'
    ].join('\n'),
    options: [2],
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 6, type: 'space', characters: 'characters', gotten: 8
      }
    }]
  }, {
    code: [
      '{test.isLoading',
      '  ? <Value/>',
      '  : <OtherValue',
      '    some={aaa}/>',
      '}'
    ].join('\n'),
    output: [
      '{test.isLoading',
      '  ? <Value/>',
      '  : <OtherValue',
      '      some={aaa}/>',
      '}'
    ].join('\n'),
    options: [2],
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 6, type: 'space', characters: 'characters', gotten: 4
      }
    }]
  }, {
    code: [
      '{test.isLoading',
      '  ? <Value/>',
      '  : <OtherValue',
      '    some={aaa}',
      '    other={bbb}/>',
      '}'
    ].join('\n'),
    output: [
      '{test.isLoading',
      '  ? <Value/>',
      '  : <OtherValue',
      '      some={aaa}',
      '      other={bbb}/>',
      '}'
    ].join('\n'),
    options: [2],
    errors: [
      {
        messageId: 'wrongIndent',
        data: {
          needed: 6, type: 'space', characters: 'characters', gotten: 4
        }
      },
      {
        messageId: 'wrongIndent',
        data: {
          needed: 6, type: 'space', characters: 'characters', gotten: 4
        }
      }
    ]
  }, {
    code: [
      '{this.props.test',
      '  ? <span',
      '    className="value"',
      '    some={{aaa}}',
      '    />',
      '  : null}'
    ].join('\n'),
    output: [
      '{this.props.test',
      '  ? <span',
      '      className="value"',
      '      some={{aaa}}',
      '    />',
      '  : null}'
    ].join('\n'),
    options: [2],
    errors: [
      {
        messageId: 'wrongIndent',
        data: {
          needed: 6, type: 'space', characters: 'characters', gotten: 4
        }
      }, {
        messageId: 'wrongIndent',
        data: {
          needed: 6, type: 'space', characters: 'characters', gotten: 4
        }
      }
    ]
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
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 1, type: 'tab', characters: 'character', gotten: 0
      }
    }]
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
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 1, type: 'tab', characters: 'character', gotten: 3
      }
    }]
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
    options: ['first'],
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 5, type: 'space', characters: 'characters', gotten: 2
      }
    }]
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
    options: ['first'],
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 6, type: 'space', characters: 'characters', gotten: 3
      }
    }]
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
    options: ['first'],
    errors: [{
      messageId: 'wrongIndent',
      data: {
        needed: 6, type: 'space', characters: 'characters', gotten: 3
      }
    }]
  }, {
    code: [
      '<App',
      '  a',
      ' b',
      '   c',
      '/>'
    ].join('\n'),
    output: [
      '<App',
      '  a',
      '  b',
      '  c',
      '/>'
    ].join('\n'),
    options: ['first'],
    errors: [
      {
        messageId: 'wrongIndent',
        data: {
          needed: 2, type: 'space', characters: 'characters', gotten: 1
        }
      },
      {
        messageId: 'wrongIndent',
        data: {
          needed: 2, type: 'space', characters: 'characters', gotten: 3
        }
      }
    ]
  }]
});
