/**
 * @fileoverview Tests for no-unknown-property
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unknown-property');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-unknown-property', rule, {
  valid: [
    {code: '<App class="bar" />;'},
    {code: '<App for="bar" />;'},
    {code: '<App accept-charset="bar" />;'},
    {code: '<meta charset="utf-8" />;'},
    {code: '<meta charSet="utf-8" />;'},
    {code: '<App http-equiv="bar" />;'},
    {code: '<App xlink:href="bar" />;'},
    {code: '<App clip-path="bar" />;'},
    {code: '<div className="bar"></div>;'},
    {code: '<div data-foo="bar"></div>;'},
    {code: '<div class="foo" is="my-elem"></div>;'},
    {code: '<div {...this.props} class="foo" is="my-elem"></div>;'},
    {code: '<atom-panel class="foo"></atom-panel>;'}, {
      code: '<div class="bar"></div>;',
      options: [{ignore: ['class']}]
    },
    {code: '<script crossOrigin />'},
    {code: '<audio crossOrigin />'}
  ],
  invalid: [{
    code: '<div class="bar"></div>;',
    output: '<div className="bar"></div>;',
    errors: [{message: 'Unknown property \'class\' found, use \'className\' instead'}]
  }, {
    code: '<div for="bar"></div>;',
    output: '<div htmlFor="bar"></div>;',
    errors: [{message: 'Unknown property \'for\' found, use \'htmlFor\' instead'}]
  }, {
    code: '<div accept-charset="bar"></div>;',
    output: '<div acceptCharset="bar"></div>;',
    errors: [{message: 'Unknown property \'accept-charset\' found, use \'acceptCharset\' instead'}]
  }, {
    code: '<div http-equiv="bar"></div>;',
    output: '<div httpEquiv="bar"></div>;',
    errors: [{message: 'Unknown property \'http-equiv\' found, use \'httpEquiv\' instead'}]
  }, {
    code: '<div accesskey="bar"></div>;',
    output: '<div accessKey="bar"></div>;',
    errors: [{message: 'Unknown property \'accesskey\' found, use \'accessKey\' instead'}]
  }, {
    code: '<div onclick="bar"></div>;',
    output: '<div onClick="bar"></div>;',
    errors: [{message: 'Unknown property \'onclick\' found, use \'onClick\' instead'}]
  }, {
    code: '<div onmousedown="bar"></div>;',
    output: '<div onMouseDown="bar"></div>;',
    errors: [{message: 'Unknown property \'onmousedown\' found, use \'onMouseDown\' instead'}]
  }, {
    code: '<use xlink:href="bar" />;',
    output: '<use xlinkHref="bar" />;',
    errors: [{message: 'Unknown property \'xlink:href\' found, use \'xlinkHref\' instead'}]
  }, {
    code: '<rect clip-path="bar" />;',
    output: '<rect clipPath="bar" />;',
    errors: [{message: 'Unknown property \'clip-path\' found, use \'clipPath\' instead'}]
  }, {
    code: '<script crossorigin />',
    errors: [{message: 'Unknown property \'crossorigin\' found, use \'crossOrigin\' instead'}]
  }, {
    code: '<div crossorigin />',
    errors: [{message: 'Unknown property \'crossorigin\' found, use \'crossOrigin\' instead'}]
  }, {
    code: '<div crossOrigin />',
    errors: [{message: 'Invalid property \'crossOrigin\' found on tag \'div\', but it is only allowed on: script, img, video, audio, link'}]
  }]
});
