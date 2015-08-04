/**
 * @fileoverview Prevent extra closing tags for components without children
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/self-closing-comp');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('self-closing-comp', rule, {

  valid: [
    {
      code: 'var contentContainer = <div className="content"></div>;',
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: 'var HelloJohn = <Hello name="John" />;',
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: '\
      <Hello>\
        <Hello name="John" />\
      </Hello>',
      ecmaFeatures: {
        jsx: true
      }
    }
  ],

  invalid: [
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }
  ]
});
