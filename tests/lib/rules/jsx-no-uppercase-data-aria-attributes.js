/**
 * @fileoverview Forbid data-* and aria-* attributes from being uppercase to support react
 * @author Don Abrams
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-no-uppercase-data-aria-attributes');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
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

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-no-uppercase-data-aria-attributes', rule, {
  valid: [
    {code: '<a data-pop-over={true} href="http://example.com/"></a>'},
    {code: '<a aNonDataAttribute="yay"></a>'},
    {code: '<input aria-describedby="error-message"/>'}
  ],
  invalid: [{
    code: '<a data-popOver={true} href="http://example.com"></a>',
    errors: [{
      message: 'In React, data-* and aria-* attributes must be lowercase' +
          ' as per https://facebook.github.io/react/docs/dom-elements.html'
    }]
  }, {
    code: '<input aria-describedBy="error-message"/>',
    errors: [{
      message: 'In React, data-* and aria-* attributes must be lowercase' +
          ' as per https://facebook.github.io/react/docs/dom-elements.html'
    }]
  }]
});
