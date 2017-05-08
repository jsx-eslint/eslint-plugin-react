/**
 * @fileoverview Tests for no-danger
 * @author Scott Andrews
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-danger');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-danger', rule, {
  valid: [
    {code: '<App />;'},
    {code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;'},
    {code: '<div className="bar"></div>;'}
  ],
  invalid: [{
    code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
    errors: [{message: 'Dangerous property \'dangerouslySetInnerHTML\' found'}]
  }]
});
