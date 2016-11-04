/**
 * @fileoverview code that call React.render are responsible for calling
 * React.unmountComponentAtNode
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/mount-unmount');
var RuleTester = require('eslint').RuleTester;


// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unused-dependencies', rule, {

  valid: [
    'ReactDOM.render(React.createElement(Component), domNode);ReactDOM.unmountComponentAtNode(domNode)',
    'ReactDOM.render(React.createElement(Component), this.domNode);ReactDOM.unmountComponentAtNode(this.domNode)'
  ],
  invalid: [
    {
      code: 'ReactDOM.render(React.createElement(Component), domNode);',
      errors: [{
        message: '\'domNode\' was never unmounted',
        type: 'Identifier'
      }]
    },
    {
      code: 'ReactDOM.render(React.createElement(Component), domNode);ReactDOM.unmountComponentAtNode(domNode2)',
      errors: [{
        message: '\'domNode\' was never unmounted',
        type: 'Identifier'
      }, {
        message: '\'domNode2\' was never rendered',
        type: 'Identifier'
      }]
    }
  ]
});
