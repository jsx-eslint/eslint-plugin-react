/**
 * @fileoverview Prevent extra closing tags for components without children
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/self-closing-comp');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('self-closing-comp', rule, {

  valid: [
    {
      code: 'var HelloJohn = <Hello name="John" />;'
    }, {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;'
    }, {
      code: `
        <Hello>
          <Hello name="John" />
        </Hello>
      `
    }, {
      code: 'var HelloJohn = <div>&nbsp;</div>;'
    }, {
      code: 'var HelloJohn = <div>{\' \'}</div>;'
    }, {
      code: 'var HelloJohn = <Hello name="John">&nbsp;</Hello>;'
    }, {
      code: 'var HelloJohn = <Hello name="John" />;',
      options: []
    }, {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
      options: []
    }, {
      code: `
        <Hello>
          <Hello name="John" />
        </Hello>
      `,
      options: []
    }, {
      code: 'var HelloJohn = <div>&nbsp;</div>;',
      options: []
    }, {
      code: 'var HelloJohn = <div>{\' \'}</div>;',
      options: []
    }, {
      code: 'var HelloJohn = <Hello name="John">&nbsp;</Hello>;',
      options: []
    }, {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      options: [{component: false}]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      options: [{component: false}]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      options: [{component: false}]
    }, {
      code: 'var contentContainer = <div className="content" />;',
      options: [{html: true}]
    }, {
      code: 'var contentContainer = <div className="content"><img src="picture.png" /></div>;',
      options: [{html: true}]
    }, {
      code: `
        <div>
          <div className="content" />
        </div>
      `,
      options: [{html: true}]
    }
  ],

  invalid: [
    {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      errors: [{
        message: 'Empty components are self-closing'
      }]
    },
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content">\n</div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }, {
      code: 'var contentContainer = <div className="content"> </div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{html: true}],
      errors: [{
        message: 'Empty components are self-closing'
      }]
    }
  ]
});
