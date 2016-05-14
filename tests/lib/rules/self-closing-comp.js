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

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('self-closing-comp', rule, {

  valid: [
    {
      code: 'var contentContainer = <div className="content"></div>;',
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John" />;',
      parserOptions: parserOptions
    }, {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
      parserOptions: parserOptions
    }, {
      code: '\
      <Hello>\
        <Hello name="John" />\
      </Hello>',
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <div>&nbsp;</div>;',
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <div>{\' \'}</div>;',
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John">&nbsp;</Hello>;',
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John" />;',
      options: ['all'],
      parserOptions: parserOptions
    }, {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
      options: ['all'],
      parserOptions: parserOptions
    }, {
      code: '\
      <Hello>\
        <Hello name="John" />\
      </Hello>',
      options: ['all'],
      parserOptions: parserOptions
    }, {
      code: 'var contentContainer = <div className="content" />;',
      options: ['all'],
      parserOptions: parserOptions
    }, {
      code: 'var contentContainer = <div className="content"><img src="picture.png" /></div>;',
      options: ['all'],
      parserOptions: parserOptions
    }, {
      code: '\
      <div>\
        <div className="content" />\
      </div>',
      options: ['all'],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      options: ['html'],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      options: ['html'],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      options: ['html'],
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      options: ['all'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      options: ['all'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      options: ['all'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"></div>;',
      options: ['all'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content">\n</div>;',
      options: ['all'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"> </div>;',
      options: ['all'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"></div>;',
      options: ['html'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content">\n</div>;',
      options: ['html'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"> </div>;',
      options: ['html'],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }
  ]
});
