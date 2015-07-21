/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/jsx-curly-spacing', {
  valid: [{
    code: '<App foo={bar} />;',
    args: 1,
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar} />;',
    args: [1, 'never'],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar } />;',
    args: [1, 'always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar } />;',
    args: [1, 'always', {allowMultiline: false}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={{ bar:baz }} />;',
    args: [1, 'never'],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ {bar:baz} } />;',
    args: [1, 'always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    args: [1, 'always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    args: [1, 'always'],
    ecmaFeatures: {jsx: true}
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    args: [1, 'never'],
    ecmaFeatures: {jsx: true}
  }],

  invalid: [{
    code: '<App foo={ bar } />;',
    args: [1, 'never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar } />;',
    args: [1, 'never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar} />;',
    args: [1, 'always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar} />;',
    args: [1, 'always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar} />;',
    args: [1, 'always'],
    errors: [{
      message: 'A space is required before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar } />;',
    args: [1, 'always'],
    errors: [{
      message: 'A space is required after \'{\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={ bar} />;',
    args: [1, 'never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<App foo={bar } />;',
    args: [1, 'never'],
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
    args: [1, 'never', {allowMultiline: false}],
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
    args: [1, 'always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    ecmaFeatures: {jsx: true}
  }]
});
