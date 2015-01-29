/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/no-multi-comp', {

    valid: [
        {
            code: '\
              var Hello = require(\'./components/Hello\');\
              var HelloJohn = React.createClass({\
                render: function() {\
                  return <Hello name="John" />;\
                }\
              });',
            ecmaFeatures: {
              jsx: true
            }
        }
    ],

    invalid: [
        {
            code: '\
              var Hello = React.createClass({\
                render: function() {\
                  return <div>Hello {this.props.name}</div>;\
                }\
              });\
              var HelloJohn = React.createClass({\
                render: function() {\
                  return <Hello name="John" />;\
                }\
              });',
            ecmaFeatures: {
              jsx: true
            },
            errors: [{
                message: 'Declare only one React component per file'
            }]
        }
    ]
});
