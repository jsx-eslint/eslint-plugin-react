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
      options: [],
      parserOptions: parserOptions
    }, {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
      options: [],
      parserOptions: parserOptions
    }, {
      code: '\
      <Hello>\
        <Hello name="John" />\
      </Hello>',
      options: [],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <div>&nbsp;</div>;',
      options: [],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <div>{\' \'}</div>;',
      options: [],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John">&nbsp;</Hello>;',
      options: [],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      options: [{component: false}],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      options: [{component: false}],
      parserOptions: parserOptions
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      options: [{component: false}],
      parserOptions: parserOptions
    }, {
      code: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      parserOptions: parserOptions
    }, {
      code: 'var contentContainer = <div className="content"><img src="picture.png" /></div>;',
      options: [{html: true}],
      parserOptions: parserOptions
    }, {
      code: '\
      <div>\
        <div className="content" />\
      </div>',
      options: [{html: true}],
      parserOptions: parserOptions
    }
  ],

  invalid: [
    {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    },
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content">\n</div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"> </div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      parserOptions: parserOptions,
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }
  ]
});
