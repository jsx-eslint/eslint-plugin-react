/**
 * @fileoverview Tests for jsx-tag-spacing
 * @author Diogo Franco (Kovensky)
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-tag-spacing');

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
      {messageId: 'beforeSelfCloseNeedSpace'}
    ]
  }, {
    code: '<App foo/>',
    output: '<App foo />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {messageId: 'beforeSelfCloseNeedSpace'}
    ]
  }, {
    code: '<App foo={bar}/>',
    output: '<App foo={bar} />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {messageId: 'beforeSelfCloseNeedSpace'}
    ]
  }, {
    code: '<App {...props}/>',
    output: '<App {...props} />',
    options: beforeSelfClosingOptions('always'),
    errors: [
      {messageId: 'beforeSelfCloseNeedSpace'}
    ]
  }, {
    code: '<App />',
    output: '<App/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {messageId: 'beforeSelfCloseNoSpace'}
    ]
  }, {
    code: '<App foo />',
    output: '<App foo/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {messageId: 'beforeSelfCloseNoSpace'}
    ]
  }, {
    code: '<App foo={bar} />',
    output: '<App foo={bar}/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {messageId: 'beforeSelfCloseNoSpace'}
    ]
  }, {
    code: '<App {...props} />',
    output: '<App {...props}/>',
    options: beforeSelfClosingOptions('never'),
    errors: [
      {messageId: 'beforeSelfCloseNoSpace'}
    ]
  }, {
    code: '<App/ >;',
    output: '<App/>;',
    errors: [{messageId: 'selfCloseSlashNoSpace'}],
    options: closingSlashOptions('never')
  }, {
    code: [
      '<App/',
      '>'
    ].join('\n'),
    output: '<App/>',
    errors: [{messageId: 'selfCloseSlashNoSpace'}],
    options: closingSlashOptions('never')
  }, {
    code: '<div className="bar">< /div>;',
    output: '<div className="bar"></div>;',
    errors: [{messageId: 'closeSlashNoSpace'}],
    options: closingSlashOptions('never')
  }, {
    code: [
      '<div className="bar"><',
      '/div>;'
    ].join('\n'),
    output: '<div className="bar"></div>;',
    errors: [{messageId: 'closeSlashNoSpace'}],
    options: closingSlashOptions('never')
  }, {
    code: '<App prop="foo"></App>',
    output: '<App prop="foo">< /App>',
    errors: [{messageId: 'closeSlashNeedSpace'}],
    options: closingSlashOptions('always')
  }, {
    code: '<p/>',
    output: '<p/ >',
    errors: [{messageId: 'selfCloseSlashNeedSpace'}],
    options: closingSlashOptions('always')
  }, {
    code: '< App/>',
    output: '<App/>',
    errors: [{messageId: 'afterOpenNoSpace'}],
    options: afterOpeningOptions('never')
  }, {
    code: '< App></App>',
    output: '<App></App>',
    errors: [{messageId: 'afterOpenNoSpace'}],
    options: afterOpeningOptions('never')
  }, {
    code: '<App></ App>',
    output: '<App></App>',
    errors: [{messageId: 'afterOpenNoSpace'}],
    options: afterOpeningOptions('never')
  }, {
    code: '< App></ App>',
    output: '<App></App>',
    errors: [
      {messageId: 'afterOpenNoSpace'},
      {messageId: 'afterOpenNoSpace'}
    ],
    options: afterOpeningOptions('never')
  }, {
    code: [
      '<',
      'App/>'
    ].join('\n'),
    output: '<App/>',
    errors: [{messageId: 'afterOpenNoSpace'}],
    options: afterOpeningOptions('never')
  }, {
    code: '<App></ App>',
    output: '< App></ App>',
    errors: [{messageId: 'afterOpenNeedSpace'}],
    options: afterOpeningOptions('always')
  }, {
    code: '< App></App>',
    output: '< App></ App>',
    errors: [{messageId: 'afterOpenNeedSpace'}],
    options: afterOpeningOptions('always')
  }, {
    code: '<App></App>',
    output: '< App></ App>',
    errors: [
      {messageId: 'afterOpenNeedSpace'},
      {messageId: 'afterOpenNeedSpace'}
    ],
    options: afterOpeningOptions('always')
  }, {
    code: '<App/>',
    output: '< App/>',
    errors: [{messageId: 'afterOpenNeedSpace'}],
    options: afterOpeningOptions('always')
  }, {
    code: '< App/>',
    output: '<App/>',
    errors: [{messageId: 'afterOpenNoSpace'}],
    options: afterOpeningOptions('allow-multiline')
  }, {
    code: '<App ></App>',
    output: '<App></App>',
    errors: [{messageId: 'beforeCloseNoSpace'}],
    options: beforeClosingOptions('never')
  }, {
    code: '<App></App >',
    output: '<App></App>',
    errors: [{messageId: 'beforeCloseNoSpace'}],
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
    errors: [{messageId: 'beforeCloseNoSpace'}],
    options: beforeClosingOptions('never')
  }, {
    code: '<App></App >',
    output: '<App ></App >',
    errors: [{messageId: 'beforeCloseNeedSpace'}],
    options: beforeClosingOptions('always')
  }, {
    code: '<App ></App>',
    output: '<App ></App >',
    errors: [{messageId: 'beforeCloseNeedSpace'}],
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
    errors: [{messageId: 'beforeCloseNeedSpace'}],
    options: beforeClosingOptions('always')
  }]
});
