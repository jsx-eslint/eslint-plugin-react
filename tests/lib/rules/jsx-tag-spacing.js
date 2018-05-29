/**
 * @fileoverview Tests for jsx-tag-spacing
 * @author Diogo Franco (Kovensky)
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-tag-spacing');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// generate options object that disables checks other than the tested one

function closingSlashOptions(option) {
  return [{
    closingSlash: option,
    beforeSelfClosing: 'allow',
    afterOpening: 'allow',
    beforeClosing: 'allow'
  }];
}

function beforeSelfClosingOptions(option) {
  return [{
    closingSlash: 'allow',
    beforeSelfClosing: option,
    afterOpening: 'allow',
    beforeClosing: 'allow'
  }];
}

function afterOpeningOptions(option) {
  return [{
    closingSlash: 'allow',
    beforeSelfClosing: 'allow',
    afterOpening: option,
    beforeClosing: 'allow'
  }];
}

function beforeClosingOptions(option) {
  return [{
    closingSlash: 'allow',
    beforeSelfClosing: 'allow',
    afterOpening: 'allow',
    beforeClosing: option
  }];
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-tag-spacing', rule, {
  valid: [{
    code: '<App />'
  }, {
    code: '<App />',
    options: beforeSelfClosingOptions('always')
  }, {
    code: '<App foo />',
    options: beforeSelfClosingOptions('always')
  }, {
    code: '<App foo={bar} />',
    options: beforeSelfClosingOptions('always')
  }, {
    code: '<App {...props} />',
    options: beforeSelfClosingOptions('always')
  }, {
    code: '<App></App>',
    options: beforeSelfClosingOptions('always')
  }, {
    code: [
      '<App',
      '  foo={bar}',
      '/>'
    ].join('\n'),
    options: beforeSelfClosingOptions('always')
  }, {
    code: '<App/>',
    options: beforeSelfClosingOptions('never')
  }, {
    code: '<App foo/>',
    options: beforeSelfClosingOptions('never')
  }, {
    code: '<App foo={bar}/>',
    options: beforeSelfClosingOptions('never')
  }, {
    code: '<App {...props}/>',
    options: beforeSelfClosingOptions('never')
  }, {
    code: '<App></App>',
    options: beforeSelfClosingOptions('never')
  }, {
    code: [
      '<App',
      '  foo={bar}',
      '/>'
    ].join('\n'),
    options: beforeSelfClosingOptions('never')
  }, {
    code: '<App/>;',
    options: closingSlashOptions('never')
  }, {
    code: '<App />;',
    options: closingSlashOptions('never')
  }, {
    code: '<div className="bar"></div>;',
    options: closingSlashOptions('never')
  }, {
    code: '<div className="bar"></ div>;',
    options: closingSlashOptions('never')
  }, {
    code: '<App prop="foo">< /App>',
    options: closingSlashOptions('always')
  }, {
    code: '<p/ >',
    options: closingSlashOptions('always')
  }, {
    code: '<App/>',
    options: afterOpeningOptions('never')
  }, {
    code: '<App></App>',
    options: afterOpeningOptions('never')
  }, {
    code: '< App></ App>',
    options: afterOpeningOptions('always')
  }, {
    code: '< App/>',
    options: afterOpeningOptions('always')
  }, {
    code: [
      '<',
      'App/>'
    ].join('\n'),
    options: afterOpeningOptions('allow-multiline')
  }, {
    code: '<App />',
    options: beforeClosingOptions('never')
  }, {
    code: '<App></App>',
    options: beforeClosingOptions('never')
  }, {
    code: [
      '<App',
      'foo="bar"',
      '>',
      '</App>'
    ].join('\n'),
    options: beforeClosingOptions('never')
  }, {
    code: [
      '<App',
      '   foo="bar"',
      '>',
      '</App>'
    ].join('\n'),
    options: beforeClosingOptions('never')
  }, {
    code: '<App ></App >',
    options: beforeClosingOptions('always')
  }, {
    code: [
      '<App',
      'foo="bar"',
      '>',
      '</App >'
    ].join('\n'),
    options: beforeClosingOptions('always')
  }, {
    code: [
      '<App',
      '    foo="bar"',
      '>',
      '</App >'
    ].join('\n'),
    options: beforeClosingOptions('always')
  }, {
    code: '<App/>',
    options: [{
      closingSlash: 'never',
      beforeSelfClosing: 'never',
      afterOpening: 'never',
      beforeClosing: 'never'
    }]
  }, {
    code: '< App / >',
    options: [{
      closingSlash: 'always',
      beforeSelfClosing: 'always',
      afterOpening: 'always',
      beforeClosing: 'always'
    }]
  }],

  invalid: [{
    code: '<App/>',
    output: '<App />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App foo/>',
    output: '<App foo />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App foo={bar}/>',
    output: '<App foo={bar} />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App {...props}/>',
    output: '<App {...props} />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {message: 'A space is required before closing bracket'}
    ]
  }, {
    code: '<App />',
    output: '<App/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App foo />',
    output: '<App foo/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App foo={bar} />',
    output: '<App foo={bar}/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App {...props} />',
    output: '<App {...props}/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {message: 'A space is forbidden before closing bracket'}
    ]
  }, {
    code: '<App/ >;',
    output: '<App/>;',
    errors: [{message: 'Whitespace is forbidden between `/` and `>`; write `/>`'}],
    options: closingSlashOptions('never')
  }, {
    code: [
      '<App/',
      '>'
    ].join('\n'),
    output: '<App/>',
    errors: [{message: 'Whitespace is forbidden between `/` and `>`; write `/>`'}],
    options: closingSlashOptions('never')
  }, {
    code: '<div className="bar">< /div>;',
    output: '<div className="bar"></div>;',
    errors: [{message: 'Whitespace is forbidden between `<` and `/`; write `</`'}],
    options: closingSlashOptions('never')
  }, {
    code: [
      '<div className="bar"><',
      '/div>;'
    ].join('\n'),
    output: '<div className="bar"></div>;',
    errors: [{message: 'Whitespace is forbidden between `<` and `/`; write `</`'}],
    options: closingSlashOptions('never')
  }, {
    code: '<App prop="foo"></App>',
    output: '<App prop="foo">< /App>',
    errors: [{message: 'Whitespace is required between `<` and `/`; write `< /`'}],
    options: closingSlashOptions('always')
  }, {
    code: '<p/>',
    output: '<p/ >',
    errors: [{message: 'Whitespace is required between `/` and `>`; write `/ >`'}],
    options: closingSlashOptions('always')
  }, {
    code: '< App/>',
    output: '<App/>',
    errors: [{message: 'A space is forbidden after opening bracket'}],
    options: afterOpeningOptions('never')
  }, {
    code: '< App></App>',
    output: '<App></App>',
    errors: [{message: 'A space is forbidden after opening bracket'}],
    options: afterOpeningOptions('never')
  }, {
    code: '<App></ App>',
    output: '<App></App>',
    errors: [{message: 'A space is forbidden after opening bracket'}],
    options: afterOpeningOptions('never')
  }, {
    code: '< App></ App>',
    output: '<App></App>',
    errors: [
      {message: 'A space is forbidden after opening bracket'},
      {message: 'A space is forbidden after opening bracket'}
    ],
    options: afterOpeningOptions('never')
  }, {
    code: [
      '<',
      'App/>'
    ].join('\n'),
    output: '<App/>',
    errors: [{message: 'A space is forbidden after opening bracket'}],
    options: afterOpeningOptions('never')
  }, {
    code: '<App></ App>',
    output: '< App></ App>',
    errors: [{message: 'A space is required after opening bracket'}],
    options: afterOpeningOptions('always')
  }, {
    code: '< App></App>',
    output: '< App></ App>',
    errors: [{message: 'A space is required after opening bracket'}],
    options: afterOpeningOptions('always')
  }, {
    code: '<App></App>',
    output: '< App></ App>',
    errors: [
      {message: 'A space is required after opening bracket'},
      {message: 'A space is required after opening bracket'}
    ],
    options: afterOpeningOptions('always')
  }, {
    code: '<App/>',
    output: '< App/>',
    errors: [{message: 'A space is required after opening bracket'}],
    options: afterOpeningOptions('always')
  }, {
    code: '< App/>',
    output: '<App/>',
    errors: [{message: 'A space is forbidden after opening bracket'}],
    options: afterOpeningOptions('allow-multiline')
  }, {
    code: '<App ></App>',
    output: '<App></App>',
    errors: [{message: 'A space is forbidden before closing bracket'}],
    options: beforeClosingOptions('never')
  }, {
    code: '<App></App >',
    output: '<App></App>',
    errors: [{message: 'A space is forbidden before closing bracket'}],
    options: beforeClosingOptions('never')
  }, {
    code: [
      '<App',
      'foo="bar"',
      '>',
      '</App >'
    ].join('\n'),
    output: [
      '<App',
      'foo="bar"',
      '>',
      '</App>'
    ].join('\n'),
    errors: [{message: 'A space is forbidden before closing bracket'}],
    options: beforeClosingOptions('never')
  }, {
    code: '<App></App >',
    output: '<App ></App >',
    errors: [{message: 'Whitespace is required before closing bracket'}],
    options: beforeClosingOptions('always')
  }, {
    code: '<App ></App>',
    output: '<App ></App >',
    errors: [{message: 'Whitespace is required before closing bracket'}],
    options: beforeClosingOptions('always')
  }, {
    code: [
      '<App',
      'foo="bar"',
      '>',
      '</App>'
    ].join('\n'),
    output: [
      '<App',
      'foo="bar"',
      '>',
      '</App >'
    ].join('\n'),
    errors: [{message: 'Whitespace is required before closing bracket'}],
    options: beforeClosingOptions('always')
  }]
});
