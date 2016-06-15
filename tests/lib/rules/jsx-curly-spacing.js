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
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    parserOptions: parserOptions
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: ['always', {spacing: {objectLiterals: 'never'}}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always', {allowMultiline: true}],
    parserOptions: parserOptions
  }, {
    code: '<App {...bar} />;',
    parserOptions: parserOptions
  }, {
    code: '<App {...bar} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App { ...bar } />;',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App { ...bar } />;',
    options: ['always', {allowMultiline: false}],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App {...bar/* comment */} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} {...baz} />;',
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} {...baz} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    options: ['always', {allowMultiline: false}],
    parserOptions: parserOptions
  }, {
    code: '<App foo={{ bar:baz }} {...baz} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ {bar:baz} } { ...baz } />;',
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...bar',
      '}/>;'
    ].join('\n'),
    options: ['always'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar/* comment */} {...baz/* comment */} />;',
    options: ['never'],
    parserOptions: parserOptions
  }, {
    code: '<App foo={3} bar={ {a: 2} } />',
    options: ['never', {spacing: {objectLiterals: 'always'}}],
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
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
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
    output: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    errors: [{
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    errors: [{
      message: 'A space is required after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ {bar: true, baz: true} } />;',
    output: '<App foo={{bar: true, baz: true}} />;',
    options: ['always', {spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App { ...bar } />;',
    output: '<App {...bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App { ...bar } />;',
    output: '<App {...bar} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App {...bar} />;',
    output: '<App { ...bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App {...bar} />;',
    output: '<App { ...bar } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App { ...bar} />;',
    output: '<App { ...bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App {...bar } />;',
    output: '<App { ...bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App { ...bar} />;',
    output: '<App {...bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App {...bar } />;',
    output: '<App {...bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    output: '<App {...bar} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    output: '<App { ...bar } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} {...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar} {...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar} { ...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar } {...baz } />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ bar} { ...baz} />;',
    output: '<App foo={bar} {...baz} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space after \'{\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={bar } {...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...baz',
      '} />;'
    ].join('\n'),
    output: '<App foo={bar} {...baz} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }, {
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...baz',
      '} />;'
    ].join('\n'),
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }, {
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }],
    parserOptions: parserOptions
  }, {
    code: '<App foo={ 3 } bar={{a: 2}} />',
    output: '<App foo={3} bar={ {a: 2} } />',
    options: ['never', {spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }],
    parserOptions: parserOptions
  }]
});
