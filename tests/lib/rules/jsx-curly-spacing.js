/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Yannick Croissant
 * @author Erik Wendel
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-curly-spacing');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-curly-spacing', rule, {
  valid: [{
    code: '<App foo={bar} />;',
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } />;',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } />;',
    options: ['always', {allowMultiline: false}],
    parserOptions: parserOptions
  }, {
    code: '<App foo={{ bar:baz }} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ {bar:baz} } />;',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: [
      '<div>{/* comment */}</div>;'
    ].join('\n'),
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar/* comment */} />;',
    options: ['never'],
    parserOptions: parserOptions,
    parser: 'babel-eslint'
  }, {
    code: '<App foo={ bar } />;',
    options: ['always', {alternative: true}],
    parserOptions: parserOptions
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: ['always', {alternative: true}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always', {alternative: true}],
    parserOptions: parserOptions
  }],

  invalid: [{
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={ bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={bar} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={ bar } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} />;',
    options: ['always', {alternative: true}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar} />;',
    options: ['always', {alternative: true}],
    errors: [{
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar } />;',
    options: ['always', {alternative: true}],
    errors: [{
      message: 'A space is required after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ {bar: true, baz: true} } />;',
    options: ['always', {alternative: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }]
});
