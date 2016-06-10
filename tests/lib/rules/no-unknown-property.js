/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-unknown-property');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unknown-property', rule, {
  valid: [
    {code: '<App class="bar" />;', parserOptions: parserOptions},
    {code: '<App for="bar" />;', parserOptions: parserOptions},
    {code: '<App accept-charset="bar" />;', parserOptions: parserOptions},
    {code: '<App http-equiv="bar" />;', parserOptions: parserOptions},
    {code: '<App xlink:href="bar" />;', parserOptions: parserOptions},
    {code: '<App clip-path="bar" />;', parserOptions: parserOptions},
    {code: '<div className="bar"></div>;', parserOptions: parserOptions},
    {code: '<div data-foo="bar"></div>;', parserOptions: parserOptions},
    {code: '<div class="foo" is="my-elem"></div>;', parserOptions: parserOptions},
    {code: '<div {...this.props} class="foo" is="my-elem"></div>;', parserOptions: parserOptions},
    {code: '<atom-panel class="foo"></atom-panel>;', parserOptions: parserOptions},
    {code: '<use xlink:href="bar" />;', parserOptions: parserOptions},
    {code: '<rect clip-path="bar" />;', parserOptions: parserOptions}, {
      code: '<div class="bar"></div>;',
      options: [{ignore: ['class']}],
      parserOptions: parserOptions
    }
  ],
  invalid: [{
    code: '<div class="bar"></div>;',
    output: '<div className="bar"></div>;',
    errors: [{message: 'Unknown property \'class\' found, use \'className\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<div for="bar"></div>;',
    output: '<div htmlFor="bar"></div>;',
    errors: [{message: 'Unknown property \'for\' found, use \'htmlFor\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<div accept-charset="bar"></div>;',
    output: '<div acceptCharset="bar"></div>;',
    errors: [{message: 'Unknown property \'accept-charset\' found, use \'acceptCharset\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<div http-equiv="bar"></div>;',
    output: '<div httpEquiv="bar"></div>;',
    errors: [{message: 'Unknown property \'http-equiv\' found, use \'httpEquiv\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<div accesskey="bar"></div>;',
    output: '<div accessKey="bar"></div>;',
    errors: [{message: 'Unknown property \'accesskey\' found, use \'accessKey\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<div onclick="bar"></div>;',
    output: '<div onClick="bar"></div>;',
    errors: [{message: 'Unknown property \'onclick\' found, use \'onClick\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<div onmousedown="bar"></div>;',
    output: '<div onMouseDown="bar"></div>;',
    errors: [{message: 'Unknown property \'onmousedown\' found, use \'onMouseDown\' instead'}],
    parserOptions: parserOptions
  }, {
    code: '<use xlink:href="bar" />;',
    output: '<use xlinkHref="bar" />;',
    errors: [{message: 'Unknown property \'xlink:href\' found, use \'xlinkHref\' instead'}],
    parserOptions: parserOptions,
    settings: {
      react: {
        version: '0.14.0'
      }
    }
  }, {
    code: '<rect clip-path="bar" />;',
    output: '<rect clipPath="bar" />;',
    errors: [{message: 'Unknown property \'clip-path\' found, use \'clipPath\' instead'}],
    parserOptions: parserOptions,
    settings: {
      react: {
        version: '0.14.0'
      }
    }
  }]
});
