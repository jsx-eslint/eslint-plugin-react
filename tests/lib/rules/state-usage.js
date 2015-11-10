/**
 * @fileoverview Prevent unused state or using state that has never been set
 * @author Thai Pangsakulyanont @ Taskworld.com
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/state-usage');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run('state-usage', rule, {

  valid: [
    {
      code:
        'React.createClass({ getInitialState: function () { return { meow: 1 }; },' +
        'render: function () { return this.state.meow; } });'
    }
  ],
  invalid: [
    {
      code: 'React.createClass({ getInitialState: function () { return { meow: 1 }; } });',
      errors: [
        {message: 'Unused state meow'}
      ]
    },
    {
      code: 'React.createClass({ onClick: function () { this.setState({ meow: 1 }); } });',
      errors: [
        {message: 'Unused state meow'}
      ]
    },
    {
      code: 'React.createClass({ render: function () { return this.state.meow; } });',
      errors: [
        {message: 'Undeclared state meow'}
      ]
    }
  ]
});
