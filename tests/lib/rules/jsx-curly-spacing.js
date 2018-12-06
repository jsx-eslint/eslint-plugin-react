/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Yannick Croissant
 * @author Erik Wendel
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-curly-spacing');
const RuleTester = require('eslint').RuleTester;
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
ruleTester.run('jsx-curly-spacing', rule, {
  valid: [{
    code: '<App foo={bar} />;'
  }, {
    code: '<App foo={bar}>{bar}</App>;'
  }, {
    code: '<App foo={bar}>{ bar }</App>;'
  }, {
    code: [
      '<App foo={',
      'bar',
      '}>',
      '{bar}',
      '</App>;'
    ].join('\n')
  }, {
    code: '<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;'
  }, {
    code: '<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;'
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n')
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '}>',
      '{{ bar: true, baz: true }}',
      '</App>;'
    ].join('\n')
  }, {
    code: '<App>{ foo /* comment 1 */ }</App>'
  }, {
    code: '<App>{ /* comment 1 */ foo }</App>'
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
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
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
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: [{attributes: false}]
  }, {
    code: '<App foo={ bar } />;',
    options: [{attributes: false}]
  }, {
    code: '<App foo={ { bar: true, baz: true } } />;',
    options: [{attributes: false}]
  }, {
    code: '<App>{bar}</App>;',
    options: [{children: true}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: true}]
  }, {
    code: '<App>{{ bar: true, baz: true }}</App>;',
    options: [{children: true}]
  }, {
    code: [
      '<App>{',
      '{ bar: true, baz: true }',
      '}</App>;'
    ].join('\n'),
    options: [{children: true}]
  }, {
    code: '<App>{bar}</App>;',
    options: [{children: false}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: false}]
  }, {
    code: '<App>{{ bar: true, baz: true }}</App>;',
    options: [{children: false}]
  }, {
    code: [
      '<App>{',
      '{ bar: true, baz: true }',
      '}</App>;'
    ].join('\n'),
    options: [{children: false}]
  }, {
    code: '<App>{ bar }</App>;',
    options: [{children: false}]
  }, {
    code: '<App>{ { bar: true, baz: true } }</App>;',
    options: [{children: false}]
  }, {
    code: '<App foo={bar} />;',
    options: [{when: 'never'}]
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
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
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
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
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
    options: [{attributes: {when: 'never'}}]
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
    code: '<App foo={bar/* comment 2 */} />;',
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
    options: [{attributes: {when: 'always', spacing: {}}}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: [{attributes: {when: 'always', spacing: {objectLiterals: 'never'}}}]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always', spacing: {objectLiterals: 'never'}}}]
  }, {
    code: '<App>{bar}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{ bar }</App>;',
    options: [{children: {when: 'always'}}]
  }, {
    code: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', allowMultiline: false}}]
  }, {
    code: '<App>{{ bar:baz }}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: [
      '<App>{',
      '{ bar: true, baz: true }',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{ {bar:baz} }</App>;',
    options: [{children: {when: 'always'}}]
  }, {
    code: [
      '<App>{',
      '{ bar: true, baz: true }',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'always'}}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'always'}}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'always', allowMultiline: true}}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'never'}}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'never', allowMultiline: true}}]
  }, {
    code: [
      '<App>{/* comment 3 */}</App>;'
    ].join('\n'),
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{bar/* comment 4 */}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', spacing: {}}}]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'always', spacing: {}}}]
  }, {
    code: '<App>{{ bar: true, baz: true }}</App>;',
    options: [{children: {when: 'always', spacing: {objectLiterals: 'never'}}}]
  }, {
    code: [
      '<App>{',
      '{ bar: true, baz: true }',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'always', spacing: {objectLiterals: 'never'}}}]
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
    code: '<App {...bar/* comment 5 */} />;',
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
      '} />;'
    ].join('\n'),
    options: [{attributes: {when: 'always'}}]
  }, {
    code: '<App foo={bar/* comment 6 */} {...baz/* comment 7 */} />;',
    options: [{attributes: {when: 'never'}}]
  }, {
    code: '<App foo={3} bar={ {a: 2} } />',
    options: [{attributes: {when: 'never', spacing: {objectLiterals: 'always'}}}]
  }, {
    code: '<App>{bar/* comment 8 */}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{bar} {baz}</App>;'
  }, {
    code: '<App>{bar} {baz}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always'}}]
  }, {
    code: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always', allowMultiline: false}}]
  }, {
    code: '<App>{{ bar:baz }} {baz}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{ {bar:baz} } { baz }</App>;',
    options: [{children: {when: 'always'}}]
  }, {
    code: [
      '<App>{',
      'bar',
      '} {',
      'bar',
      '}</App>;'
    ].join('\n'),
    options: [{children: {when: 'always'}}]
  }, {
    code: '<App>{bar/* comment 9 */} {baz/* comment 10 */}</App>;',
    options: [{children: {when: 'never'}}]
  }, {
    code: '<App>{3} { {a: 2} }</App>',
    options: [{children: {when: 'never', spacing: {objectLiterals: 'always'}}}]
  }, {
    code: '<App foo={ bar }>{bar}</App>',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: '<App foo={ bar }>{bar}</App>',
    options: [{attributes: {when: 'always'}}]
  }, {
    code: [
      '<App foo={ 42 } { ...bar } baz={{ 4: 2 }}>',
      '{foo} {{ bar: baz }}',
      '</App>'
    ].join('\n'),
    options: [{
      when: 'never',
      attributes: {when: 'always', spacing: {objectLiterals: 'never'}},
      children: true
    }]
  }, {
    code: [
      '<App foo={42} {...bar} baz={ { 4: 2 } }>',
      '{foo} { { bar: baz } }',
      '</App>'
    ].join('\n'),
    options: [{
      when: 'never',
      spacing: {objectLiterals: 'always'},
      attributes: true,
      children: {when: 'never'}
    }]
  }, {
    code: [
      '<App foo={42} {...bar} baz={ { 4: 2 } }>',
      '{foo} { { bar: baz } }',
      '</App>'
    ].join('\n'),
    options: [{
      spacing: {objectLiterals: 'always'},
      attributes: {when: 'never', spacing: {objectLiterals: 'always'}},
      children: {when: 'never'}
    }]
  }, {
    code: '<App foo={bar} />;',
    options: ['never']
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: ['never', {spacing: {objectLiterals: 'never'}}]
  }, {
    code: '<App foo={ bar } />;',
    options: ['always']
  }, {
    code: '<App foo={ bar } />;',
    options: ['always', {allowMultiline: false}]
  }, {
    code: '<App foo={{ bar:baz }} />;',
    options: ['never']
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: ['never']
  }, {
    code: '<App foo={ {bar:baz} } />;',
    options: ['always']
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: ['always']
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always']
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['never']
  }, {
    code: [
      '<App>{/* comment 11 */}</App>;'
    ].join('\n'),
    options: ['never']
  }, {
    code: '<App foo={bar/* comment 12 */} />;',
    options: ['never']
  }, {
    code: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always', {spacing: {}}]
  }, {
    code: '<App foo={{ bar: true, baz: true }} />;',
    options: ['always', {spacing: {objectLiterals: 'never'}}]
  }, {
    code: [
      '<App foo={',
      'bar',
      '} />;'
    ].join('\n'),
    options: ['always', {allowMultiline: true}]
  }, {
    code: [
      '<App foo={',
      '{ bar: true, baz: true }',
      '} />;'
    ].join('\n'),
    options: ['always', {spacing: {objectLiterals: 'never'}}]
  }, {
    code: '<App {...bar} />;',
    options: ['never']
  }, {
    code: '<App { ...bar } />;',
    options: ['always']
  }, {
    code: '<App { ...bar } />;',
    options: ['always', {allowMultiline: false}]
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: ['always']
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: ['always']
  }, {
    code: [
      '<App {',
      '...bar',
      '} />;'
    ].join('\n'),
    options: ['never']
  }, {
    code: '<App {...bar/* comment 13 */} />;',
    options: ['never']
  }, {
    code: '<App foo={bar} {...baz} />;',
    options: ['never']
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    options: ['always']
  }, {
    code: '<App foo={ bar } { ...baz } />;',
    options: ['always', {allowMultiline: false}]
  }, {
    code: '<App foo={{ bar:baz }} {...baz} />;',
    options: ['never']
  }, {
    code: '<App foo={ {bar:baz} } { ...baz } />;',
    options: ['always']
  }, {
    code: [
      '<App foo={',
      'bar',
      '} {',
      '...bar',
      '}/>;'
    ].join('\n'),
    options: ['always']
  }, {
    code: '<App foo={bar/* comment 14 */} {...baz/* comment 15 */} />;',
    options: ['never']
  }, {
    code: '<App foo={3} bar={ {a: 2} } />',
    options: ['never', {spacing: {objectLiterals: 'always'}}]
  }, {
    code: '<App foo={ bar }>{bar}</App>',
    options: ['always']
  }, {
    code: [
      '<App>{`',
      'text',
      '`}</App>'
    ].join('\n'),
    options: [{children: {when: 'never', allowMultiline: false}}]
  }, {
    code: '<>{bar} {baz}</>;',
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: '<App foo={ bar }>{bar}</App>;',
    output: '<App foo={bar}>{bar}</App>;',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ bar }>{ bar }</App>;',
    output: '<App foo={bar}>{ bar }</App>;',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } }>{{ bar: true, baz: true }}</App>;',
    output: '<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ { bar: true, baz: true } }>{ { bar: true, baz: true } }</App>;',
    output: '<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;',
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
    code: '<App>{ bar }</App>;',
    output: '<App>{bar}</App>;',
    options: [{children: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<>{ bar }</>;',
    output: '<>{bar}</>;',
    parser: 'babel-eslint',
    options: [{children: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App>{ { bar: true, baz: true } }</App>;',
    output: '<App>{{ bar: true, baz: true }}</App>;',
    options: [{children: true}],
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
    code: '<App foo={{ bar: true, baz: true }} />;',
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{when: 'never', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
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
    code: '<App foo={{ bar: true, baz: true }} />;',
    output: '<App foo={ { bar: true, baz: true } } />;',
    options: [{when: 'always', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
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
    code: '<App>{ bar }</App>;',
    output: '<App>{bar}</App>;',
    options: [{children: true, when: 'never'}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    output: '<App>{bar}</App>;',
    options: [{children: true, when: 'never', allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App>{ { bar: true, baz: true } }</App>;',
    output: '<App>{{ bar: true, baz: true }}</App>;',
    options: [{children: true, when: 'never', spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App>{{ bar: true, baz: true }}</App>;',
    output: '<App>{ { bar: true, baz: true } }</App>;',
    options: [{children: true, when: 'never', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{bar}</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: true, when: 'always'}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    output: '<App>{ bar }</App>;',
    options: [{children: true, when: 'always', allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App>{ { bar: true, baz: true } }</App>;',
    output: '<App>{{ bar: true, baz: true }}</App>;',
    options: [{children: true, when: 'always', spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App>{{ bar: true, baz: true }}</App>;',
    output: '<App>{ { bar: true, baz: true } }</App>;',
    options: [{children: true, when: 'always', spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{ bar }</App>;',
    output: '<App>{bar}</App>;',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App>{ bar }</App>;',
    output: '<App>{bar}</App>;',
    options: [{children: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App>{bar}</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{bar}</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{ bar}</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{bar }</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App>{ bar}</App>;',
    output: '<App>{bar}</App>;',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App>{bar }</App>;',
    output: '<App>{bar}</App>;',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    output: '<App>{bar}</App>;',
    options: [{children: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App>{',
      'bar',
      '}</App>;'
    ].join('\n'),
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App>{bar}</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', spacing: {}}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{ bar}</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', spacing: {}}}],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{bar }</App>;',
    output: '<App>{ bar }</App>;',
    options: [{children: {when: 'always', spacing: {}}}],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App>{ {bar: true, baz: true} }</App>;',
    output: '<App>{{bar: true, baz: true}}</App>;',
    options: [{children: {when: 'always', spacing: {objectLiterals: 'never'}}}],
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
    code: '<App foo={ foo /* comment 16 */ } />',
    output: '<App foo={foo /* comment 16 */} />',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={foo /* comment 17 */} />',
    output: '<App foo={ foo /* comment 17 */ } />',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ /* comment 18 */ foo } />',
    output: '<App foo={/* comment 18 */ foo} />',
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={/* comment 19 */ foo} />',
    output: '<App foo={ /* comment 19 */ foo } />',
    options: [{attributes: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{ bar } { baz }</App>;',
    output: '<App>{bar} {baz}</App>;',
    options: [{children: {when: 'never'}}],
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
    code: '<App>{ bar } { baz }</App>;',
    output: '<App>{bar} {baz}</App>;',
    options: [{children: {when: 'never', allowMultiline: false}}],
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
    code: '<App>{bar} {baz}</App>;',
    output: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always'}}],
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
    code: '<App>{bar} {baz}</App>;',
    output: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always', allowMultiline: false}}],
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
    code: '<App>{ bar} { baz}</App>;',
    output: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{bar } {baz }</App>;',
    output: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App>{ bar} { baz}</App>;',
    output: '<App>{bar} {baz}</App>;',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App>{bar } {baz }</App>;',
    output: '<App>{bar} {baz}</App>;',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space before \'}\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App>{',
      'bar',
      '} {',
      'baz',
      '}</App>;'
    ].join('\n'),
    output: '<App>{bar} {baz}</App>;',
    options: [{children: {when: 'never', allowMultiline: false}}],
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
      '<App>{',
      'bar',
      '} {',
      'baz',
      '}</App>;'
    ].join('\n'),
    output: '<App>{ bar } { baz }</App>;',
    options: [{children: {when: 'always', allowMultiline: false}}],
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
    code: '<App>{ 3 } bar={{a: 2}}</App>',
    output: '<App>{3} bar={ {a: 2} }</App>',
    options: [{children: {when: 'never', spacing: {objectLiterals: 'always'}}}],
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
    code: '<App>{foo /* comment 20 */}</App>',
    output: '<App>{ foo /* comment 20 */ }</App>',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{/* comment 21 */ foo}</App>',
    output: '<App>{ /* comment 21 */ foo }</App>',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App foo={ bar } />;',
    output: '<App foo={bar} />;',
    options: ['never', {allowMultiline: false}],
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
    options: ['never', {allowMultiline: false, spacing: {objectLiterals: 'never'}}],
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
    options: ['never', {allowMultiline: false, spacing: {objectLiterals: 'always'}}],
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
    options: ['always', {allowMultiline: false, spacing: {objectLiterals: 'never'}}],
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
    options: ['always', {allowMultiline: false, spacing: {objectLiterals: 'always'}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={ bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={bar} />;',
    options: ['never'],
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
    options: ['never', {allowMultiline: false}],
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
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: '<App foo={bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={ bar} />;',
    output: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar } />;',
    output: '<App foo={ bar } />;',
    options: ['always', {spacing: {}}],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App foo={ {bar: true, baz: true} } />;',
    output: '<App foo={{bar: true, baz: true}} />;',
    options: ['always', {spacing: {objectLiterals: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App { ...bar } />;',
    output: '<App {...bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App { ...bar } />;',
    output: '<App {...bar} />;',
    options: ['never', {allowMultiline: false}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App {...bar} />;',
    output: '<App { ...bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App {...bar} />;',
    output: '<App { ...bar } />;',
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App { ...bar} />;',
    output: '<App { ...bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App {...bar } />;',
    output: '<App { ...bar } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App { ...bar} />;',
    output: '<App {...bar} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App {...bar } />;',
    output: '<App {...bar} />;',
    options: ['never'],
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
    options: ['never', {allowMultiline: false}],
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
    options: ['always', {allowMultiline: false}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }, {
      message: 'There should be no newline before \'}\''
    }]
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
    }]
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
    }]
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
    }]
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
    }]
  }, {
    code: '<App foo={ bar} { ...baz} />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required before \'}\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={bar } {...baz } />;',
    output: '<App foo={ bar } { ...baz } />;',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required after \'{\''
    }]
  }, {
    code: '<App foo={ bar} { ...baz} />;',
    output: '<App foo={bar} {...baz} />;',
    options: ['never'],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App foo={bar } {...baz } />;',
    output: '<App foo={bar} {...baz} />;',
    options: ['never'],
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
    options: ['never', {allowMultiline: false}],
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
    options: ['always', {allowMultiline: false}],
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
    options: ['never', {spacing: {objectLiterals: 'always'}}],
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
    code: '<App foo={foo /* comment 22 */} />',
    output: '<App foo={ foo /* comment 22 */ } />',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App foo={/* comment 23 */ foo} />',
    output: '<App foo={ /* comment 23 */ foo } />',
    options: ['always'],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: '<App>{/*comment24*/ }</App>',
    output: '<App>{/*comment24*/}</App>',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: '<App>{ /*comment25*/}</App>',
    output: '<App>{/*comment25*/}</App>',
    options: [{children: {when: 'never'}}],
    errors: [{
      message: 'There should be no space after \'{\''
    }]
  }, {
    code: '<App>{/*comment26*/}</App>',
    output: '<App>{ /*comment26*/ }</App>',
    options: [{children: {when: 'always'}}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: [
      '<App>',
      '{ /* comment 27 */ }',
      '</App>;'
    ].join('\n'),
    output: [
      '<App>',
      '{/* comment 27 */}',
      '</App>;'
    ].join('\n'),
    options: [{when: 'never', children: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App>',
      '{/* comment 28 */}',
      '</App>;'
    ].join('\n'),
    output: [
      '<App>',
      '{ /* comment 28 */ }',
      '</App>;'
    ].join('\n'),
    options: [{when: 'always', children: true}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: [
      '<App>',
      '{/*comment29*/',
      '}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '{/*comment29*/}',
      '</App>'
    ].join('\n'),
    options: [{children: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline before \'}\''
    }]
  }, {
    code: [
      '<App>',
      '{',
      '/*comment30*/}',
      '</App>'
    ].join('\n'),
    output: [
      '<App>',
      '{/*comment30*/}',
      '</App>'
    ].join('\n'),
    options: [{children: {when: 'never', allowMultiline: false}}],
    errors: [{
      message: 'There should be no newline after \'{\''
    }]
  }, {
    code: [
      '<App>{ /* comment 31 */',
      'bar',
      '} {',
      'baz',
      '/* comment 32 */ }</App>;'
    ].join('\n'),
    output: [
      '<App>{/* comment 31 */',
      'bar',
      '} {',
      'baz',
      '/* comment 32 */}</App>;'
    ].join('\n'),
    options: [{when: 'never', children: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }, {
    code: [
      '<App>{/* comment 33 */',
      'bar',
      '} {',
      'baz',
      '/* comment 33 */}</App>;'
    ].join('\n'),
    output: [
      '<App>{ /* comment 33 */',
      'bar',
      '} {',
      'baz',
      '/* comment 33 */ }</App>;'
    ].join('\n'),
    options: [{when: 'always', children: true}],
    errors: [{
      message: 'A space is required after \'{\''
    }, {
      message: 'A space is required before \'}\''
    }]
  }, {
    code: [
      '<div className={ this.state.renderInfo ? "infoPanel col-xs-12" : "unToggled col-xs-12" } />'
    ].join('\n'),
    output: [
      '<div className={this.state.renderInfo ? "infoPanel col-xs-12" : "unToggled col-xs-12"} />'
    ].join('\n'),
    options: ['never', {allowMultiline: true}],
    errors: [{
      message: 'There should be no space after \'{\''
    }, {
      message: 'There should be no space before \'}\''
    }]
  }]
});
