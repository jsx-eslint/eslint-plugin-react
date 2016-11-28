/**
 * @fileoverview Warn for common attribute typos.
 * @author Koen Punt
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-common-typos');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var options = [
  {
    pattern: /dangerouslySetInnerHTML/i,
    correct: 'dangerouslySetInnerHTML'
  }
];

var ruleTester = new RuleTester();
ruleTester.run('no-common-typos', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div dangerouslySetInnerHTML={{__html: "Hello World"}}/>;',
      '  }',
      '});'
    ].join('\n'),
    options: options,
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true
    }
  }
  ],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div dangerouslySetInnerHtml={{__html: "Hello World"}}/>;',
      '  }',
      '});'
    ].join('\n'),
    options: options,
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Using possible incorrect attribute `dangerouslySetInnerHtml`, did you mean `dangerouslySetInnerHTML`?'
    }]
  }]
});
