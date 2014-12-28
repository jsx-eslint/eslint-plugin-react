/**
 * @fileoverview Prevent extra closing tags for components without children
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
eslintTester.addRuleTest('lib/rules/self-closing-comp', {

    valid: [
        {
            code: 'var contentContainer = <div className="content"></div>;',
            settings: {
                ecmascript: 6,
                jsx: true
            }
        }, {
            code: 'var HelloJohn = <Hello name="John" />;',
            settings: {
                ecmascript: 6,
                jsx: true
            }
        }, {
            code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
            settings: {
                ecmascript: 6,
                jsx: true
            }
        }
    ],

    invalid: [
        {
            code: 'var HelloJohn = <Hello name="John"></Hello>;',
            settings: {
                ecmascript: 6,
                jsx: true
            },
            errors: [{
                message: 'Empty components are self-closing'
            }]
        }, {
            code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
            settings: {
                ecmascript: 6,
                jsx: true
            },
            errors: [{
                message: 'Empty components are self-closing'
            }]
        }, {
            code: 'var HelloJohn = <Hello name="John"> </Hello>;',
            settings: {
                ecmascript: 6,
                jsx: true
            },
            errors: [{
                message: 'Empty components are self-closing'
            }]
        }
    ]
});
