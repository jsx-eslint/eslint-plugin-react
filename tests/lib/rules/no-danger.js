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
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-danger', rule, {
  valid: [
    {code: '<App />;', parserOptions: parserOptions},
    {code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;', parserOptions: parserOptions},
    {code: '<div className="bar"></div>;', parserOptions: parserOptions}
  ],
  invalid: [{
    code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
    errors: [{message: 'Dangerous property \'dangerouslySetInnerHTML\' found'}],
    parserOptions: parserOptions
  }]
});
