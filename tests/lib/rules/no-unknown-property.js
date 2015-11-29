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

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unknown-property', rule, {
  valid: [
    {code: '<App class="bar" />;', ecmaFeatures: {jsx: true}},
    {code: '<App for="bar" />;', ecmaFeatures: {jsx: true}},
    {code: '<App accept-charset="bar" />;', ecmaFeatures: {jsx: true}},
    {code: '<App http-equiv="bar" />;', ecmaFeatures: {jsx: true}},
    {code: '<App xlink:href="bar" />;', ecmaFeatures: {jsx: true}},
    {code: '<App clip-path="bar" />;', ecmaFeatures: {jsx: true}},
    {code: '<div className="bar"></div>;', ecmaFeatures: {jsx: true}},
    {code: '<div data-foo="bar"></div>;', ecmaFeatures: {jsx: true}},
    {code: '<div class="foo" is="my-elem"></div>;', ecmaFeatures: {jsx: true}},
    {code: '<div {...this.props} class="foo" is="my-elem"></div>;', ecmaFeatures: {jsx: true}},
    {code: '<atom-panel class="foo"></atom-panel>;', ecmaFeatures: {jsx: true}}
  ],
  invalid: [{
    code: '<div class="bar"></div>;',
    errors: [{message: 'Unknown property \'class\' found, use \'className\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<div for="bar"></div>;',
    errors: [{message: 'Unknown property \'for\' found, use \'htmlFor\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<div accept-charset="bar"></div>;',
    errors: [{message: 'Unknown property \'accept-charset\' found, use \'acceptCharset\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<div http-equiv="bar"></div>;',
    errors: [{message: 'Unknown property \'http-equiv\' found, use \'httpEquiv\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<div accesskey="bar"></div>;',
    errors: [{message: 'Unknown property \'accesskey\' found, use \'accessKey\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<div onclick="bar"></div>;',
    errors: [{message: 'Unknown property \'onclick\' found, use \'onClick\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<div onmousedown="bar"></div>;',
    errors: [{message: 'Unknown property \'onmousedown\' found, use \'onMouseDown\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<use xlink:href="bar" />;',
    errors: [{message: 'Unknown property \'xlink:href\' found, use \'xlinkHref\' instead'}],
    ecmaFeatures: {jsx: true}
  }, {
    code: '<rect clip-path="bar" />;',
    errors: [{message: 'Unknown property \'clip-path\' found, use \'clipPath\' instead'}],
    ecmaFeatures: {jsx: true}
  }]
});
