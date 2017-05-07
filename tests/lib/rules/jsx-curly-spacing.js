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
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-curly-spacing', rule, {
  valid: [{
    code: '<App foo={bar} />;'
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n')
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n')
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;'
  }, {
    code: '<App foo={bar} />;',
    options: [{attributes: true}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: true}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: true}]
  }, {
    code: '<App foo={bar} />;',
    options: [{attributes: false}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: false}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: false}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{attributes: false}]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    options: [{attributes: false}]
  }, {
    code: '<App foo={bar} />;',
    options: [{when: 'never'}]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: [{when: 'never', spacing: {objectLiterals: 'never'}}]
  }, {
    code: '<App foo={bar} />;',
    options: [{when: 'never', allowMultiline: false}]
  }, {
    code: '<App foo={bar} />;',
    options: [{when: 'never', allowMultiline: true}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{when: 'never', allowMultiline: true}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: [{when: 'never', spacing: {objectLiterals: 'never'}}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{when: 'always'}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{when: 'always', allowMultiline: false}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{when: 'always', allowMultiline: true}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{when: 'always', allowMultiline: true}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: [{when: 'always', spacing: {objectLiterals: 'never'}}]
  }, {
    code: '<App foo={bar} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}]
  }, {
    code: '<App foo={{ bar:baz }} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: [{when: 'never'}]
  }, {
    code: '<App foo={ {bar:baz} } />;',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always'}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always'}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always', allowMultiline: true}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'never'}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'never', allowMultiline: true}}]
  }, {
    code: [
      '<div>{/* comment */}</div>;'
    ].join('\n'),
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={bar/* comment */} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', spacing: {}}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{when: 'always', spacing: {}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always', spacing: {}}}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: {when: 'always', spacing: {objectLiterals: 'never'}}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: [{when: 'always', allowMultiline: true}]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: [{when: 'always', spacing: {objectLiterals: 'never'}}]
  }, {
    code: '<App {...bar} />;'
  }, {
    code: '<App {...bar} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App { ...bar } />;',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: '<App { ...bar } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always'}}]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always', allowMultiline: true}}]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'never'}}]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'never', allowMultiline: true}}]
  }, {
    code: '<App {...bar/* comment */} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={bar} {...baz} />;'
  }, {
    code: '<App foo={bar} {...baz} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}]
  }, {
    code: '<App foo={{ bar:baz }} {...baz} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={ {bar:baz} } { ...baz } />;',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...bar',
      '}/>;'
    ].join('\n'),
    options: [{attributes: {when: 'always'}}]
  }, {
    code: '<App foo={bar/* comment */} {...baz/* comment */} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={3} bar={ {a: 2} } />',
    options: [{attributes: {when: 'never', spacing: {objectLiterals: 'always'}}}]
  }, {
    code: '<div foo={ bar }>{bar}</div>',
    options: [{attributes: {when: 'always'}}]
  }],

  invalid: [{
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    output: '<App foo={{ bar: true, baz: true }} />;',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: [{attributes: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: [{when: 'never'}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={bar} />;',
    options: [{when: 'never', allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{when: 'never', spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{when: 'never', allowMultiline: false, spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{when: 'never', allowMultiline: false, spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{when: 'always', allowMultiline: false, spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{when: 'always', allowMultiline: false, spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{when: 'never', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: [{when: 'always'}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={ bar } />;',
    options: [{when: 'always', allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{when: 'always', spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{when: 'always', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: [{attributes: true, when: 'never'}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={bar} />;',
    options: [{attributes: true, when: 'never', allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: true, when: 'never', spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{attributes: true, when: 'never', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: true, when: 'always'}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={ bar } />;',
    options: [{attributes: true, when: 'always', allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    output: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: true, when: 'always', spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{attributes: true, when: 'always', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: [{attributes: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={bar} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={bar} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={bar} />;',
    options: [{attributes: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', spacing: {}}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', spacing: {}}}],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={ bar } />;',
    options: [{attributes: {when: 'always', spacing: {}}}],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App foo={ {bar: true, baz: true} } />;',
    output: '<App foo={{bar: true, baz: true}} />;',
    options: [{attributes: {when: 'always', spacing: {objectLiterals: 'never'}}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App { ...bar } />;',
    output: '<App {...bar} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App { ...bar } />;',
    output: '<App {...bar} />;',
    options: [{attributes: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App {...bar} />;',
    output: '<App { ...bar } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App {...bar} />;',
    output: '<App { ...bar } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App { ...bar} />;',
    output: '<App { ...bar } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App {...bar } />;',
    output: '<App { ...bar } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App { ...bar} />;',
    output: '<App {...bar} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App {...bar } />;',
    output: '<App {...bar} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    output: '<App {...bar} />;',
    options: [{attributes: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    output: '<App { ...bar } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: [{attributes: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={bar} {...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar} {...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar} { ...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar } {...baz } />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App foo={ bar} { ...baz} />;',
    output: '<App foo={bar} {...baz} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App foo={bar } {...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: [{attributes: {when: 'never'}}],
    errors: [{
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...baz',
      '} />;'
    ].join('\n'),
    output: '<App foo={bar} {...baz} />;',
    options: [{attributes: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }, {
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...baz',
      '} />;'
    ].join('\n'),
    output: '<App foo={ bar } { ...baz } />;',
    options: [{attributes: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }, {
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={ 3 } bar={{a: 2}} />',
    output: '<App foo={3} bar={ {a: 2} } />',
    options: [{attributes: {when: 'never', spacing: {objectLiterals: 'always'}}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }, {
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<div foo={ foo /* comment */ } />',
    output: '<div foo={foo /* comment */} />',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<div foo={foo /* comment */} />',
    output: '<div foo={ foo /* comment */ } />',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<div foo={ /* comment */ foo } />',
    output: '<div foo={/* comment */ foo} />',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<div foo={/* comment */ foo} />',
    output: '<div foo={ /* comment */ foo } />',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }]
});
