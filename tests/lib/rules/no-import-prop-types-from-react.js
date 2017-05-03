/**
 * @fileoverview Tests for no-import-prop-types-from-react
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-import-prop-types-from-react');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Using another component\'s propTypes is forbidden';

var ruleTester = new RuleTester();
ruleTester.run('forbid-foreign-prop-types', rule, {

  valid: [{
    code: 'import { propTypes } from "SomeComponent";',
    parserOptions: parserOptions
  }, {
    code: 'import { propTypes as someComponentPropTypes } from "SomeComponent";',
    parserOptions: parserOptions
  }],

  invalid: [{
    code: 'import { react, propTypes } from "react";',
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'ImportSpecifier'
    }]
  },
  {
    code: 'import { react, propTypes as someComponentPropTypes } from "react";',
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'ImportSpecifier'
    }]
  }]
});
