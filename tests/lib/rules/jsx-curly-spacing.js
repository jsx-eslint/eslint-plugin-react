/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-curly-spacing');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-curly-spacing', rule, {
  valid: [{
    code: '<App foo={bar} />;',
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar} />;',
    options: ['never'],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar } />;',
    options: ['always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar } />;',
    options: ['always', {allowMultiline: false}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={{ bar:baz }} />;',
    options: ['never'],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ {bar:baz} } />;',
    options: ['always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['never'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<div>{/* comment */}</div>;'
    ].join('\n'),
    options: ['never'],
    ecmaFeatures: {jsx: true}
  }],

  invalid: [{
    code: '<App foo={ bar } />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar } />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar} />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar} />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar} />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar } />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }]
});
