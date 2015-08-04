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

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-danger', rule, {
  valid: [
    {code: '<App />;', ecmaFeatures: {jsx: true}},
    {code: '<App dangerouslySetInnerHTML={{ __html: "" }} />;', ecmaFeatures: {jsx: true}},
    {code: '<div className="bar"></div>;', ecmaFeatures: {jsx: true}}
  ],
  invalid: [{
    code: '<div dangerouslySetInnerHTML={{ __html: "" }}></div>;',
    errors: [{message: 'Dangerous property \'dangerouslySetInnerHTML\' found'}],
    ecmaFeatures: {jsx: true}
  }]
});
