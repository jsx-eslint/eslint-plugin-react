/**
 * @fileoverview Prevent missing props validation in a React component definition
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
            ecmaFeatures: {
              jsx: true
            }
        }, {
            code: '\
              var Hello = React.createClass({\
                propTypes: {\
                  name: React.PropTypes.object.isRequired\
                },\
                render: function() {\
                  return <div>Hello {this.props.name.firstname}</div>;\
                }\
              });',
            ecmaFeatures: {
              jsx: true
            }
        }, {
            code: '\
              var Hello = React.createClass({\
                render: function() {\
                  return <div>Hello World</div>;\
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
              });',
            ecmaFeatures: {
              jsx: true
            },
            errors: [{
                message: '\'name\' is missing in props validation'
            }]
        }, {
            code: '\
              var Hello = React.createClass({\
                propTypes: {\
                  name: React.PropTypes.string.isRequired\
                },\
                render: function() {\
                  return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;\
                }\
              });\
              var Hello2 = React.createClass({\
                render: function() {\
                  return <div>Hello {this.props.name}</div>;\
                }\
              });',
            ecmaFeatures: {
              jsx: true
            },
            errors: [{
                message: '\'propWithoutTypeDefinition\' is missing in props validation'
            }, {
                message: '\'name\' is missing in props validation'
            }]
        }
    ]
});
