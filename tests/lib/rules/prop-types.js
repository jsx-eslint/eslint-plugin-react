/**
 * @fileoverview Prevent missing propTypes in a React component definition
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
eslintTester.addRuleTest('lib/rules/prop-types', {

    valid: [
        {
            code: '\
              var Hello = React.createClass({\
                propTypes: {\
                  name: React.PropTypes.string.isRequired\
                },\
                render: function() {\
                  return <div>Hello {this.props.name}</div>;\
                }\
              });',
            settings: {
                ecmascript: 6,
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
              });',
            settings: {
                ecmascript: 6,
                jsx: true
            },
            errors: [{
                message: 'Component definition is missing props validation'
            }]
        }
    ]
});
