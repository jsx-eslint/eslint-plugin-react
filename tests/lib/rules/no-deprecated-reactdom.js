/**
 * @fileoverview Don't access ReactDOM/ReactDOMServer methods on React object
 * @author Scott Feeney
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-deprecated-reactdom');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-deprecated-reactdom', rule, {

  valid: [
    'var MyClass = React.createClass({});',
    'var element = React.createElement(\'p\', {}, null);',
    'var clone = React.cloneElement(element);',
    'ReactDOM.render(element, container);',
    'ReactDOM.unmountComponentAtNode(container);',
    'ReactDOM.findDOMNode(instance);',
    'ReactDOMServer.renderToString(element);',
    'ReactDOMServer.renderToStaticMarkup(element);'
  ],

  invalid: [
    {
      code: 'React.render(element, container);',
      errors: [
        {
          message: 'React.render is deprecated; use ReactDOM.render instead.'
        }
      ]
    },
    {
      code: 'React.unmountComponentAtNode(container);',
      errors: [
        {
          message: (
            'React.unmountComponentAtNode is deprecated; ' +
            'use ReactDOM.unmountComponentAtNode instead.'
          )
        }
      ]
    },
    {
      code: 'React.findDOMNode(instance);',
      errors: [
        {
          message: (
            'React.findDOMNode is deprecated; ' +
            'use ReactDOM.findDOMNode instead.'
          )
        }
      ]
    },
    {
      code: 'React.renderToString(element);',
      errors: [
        {
          message: (
            'React.renderToString is deprecated; ' +
            'use ReactDOMServer.renderToString instead.'
          )
        }
      ]
    },
    {
      code: 'React.renderToStaticMarkup(element);',
      errors: [
        {
          message: (
            'React.renderToStaticMarkup is deprecated; ' +
            'use ReactDOMServer.renderToStaticMarkup instead.'
          )
        }
      ]
    }
  ]
});
