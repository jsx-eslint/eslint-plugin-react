/**
 * @fileoverview Prevent usage of deprecated methods
 * @author Yannick Croissant
 * @author Scott Feeney
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-deprecated');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-deprecated', rule, {

  valid: [
    // Not deprecated
    'var element = React.createElement(\'p\', {}, null);',
    'var clone = React.cloneElement(element);',
    'ReactDOM.render(element, container);',
    'ReactDOM.unmountComponentAtNode(container);',
    'ReactDOM.findDOMNode(instance);',
    'ReactDOMServer.renderToString(element);',
    'ReactDOMServer.renderToStaticMarkup(element);',
    // Deprecated in a later version
    {code: 'React.renderComponent()', settings: {react: {version: '0.11.0'}}}
  ],

  invalid: [{
    code: 'React.renderComponent()',
    settings: {react: {version: '0.12.0'}},
    errors: [{
      message: 'React.renderComponent is deprecated since React 0.12.0, use React.render instead'
    }]
  }, {
    code: 'Foo.renderComponent()',
    settings: {react: {pragma: 'Foo', version: '0.12.0'}},
    errors: [{
      message: 'Foo.renderComponent is deprecated since React 0.12.0, use Foo.render instead'
    }]
  }, {
    code: '/** @jsx Foo */ Foo.renderComponent()',
    settings: {react: {version: '0.12.0'}},
    errors: [{
      message: 'Foo.renderComponent is deprecated since React 0.12.0, use Foo.render instead'
    }]
  }, {
    code: 'this.transferPropsTo()',
    errors: [{
      message: 'this.transferPropsTo is deprecated since React 0.12.0, use spread operator ({...}) instead'
    }]
  }, {
    code: 'React.addons.classSet()',
    errors: [{
      message: 'React.addons.classSet is deprecated since React 0.13.0, use the npm module classnames instead'
    }]
  }, {
    code: 'React.render(element, container);',
    errors: [{
      message: 'React.render is deprecated since React 0.14.0, use ReactDOM.render instead'
    }]
  }, {
    code: 'React.unmountComponentAtNode(container);',
    errors: [{
      message: (
        'React.unmountComponentAtNode is deprecated since React 0.14.0, ' +
        'use ReactDOM.unmountComponentAtNode instead'
      )
    }]
  }, {
    code: 'React.findDOMNode(instance);',
    errors: [{
      message: 'React.findDOMNode is deprecated since React 0.14.0, use ReactDOM.findDOMNode instead'
    }]
  }, {
    code: 'React.renderToString(element);',
    errors: [{
      message: 'React.renderToString is deprecated since React 0.14.0, use ReactDOMServer.renderToString instead'
    }]
  }, {
    code: 'React.renderToStaticMarkup(element);',
    errors: [{
      message: (
        'React.renderToStaticMarkup is deprecated since React 0.14.0, ' +
        'use ReactDOMServer.renderToStaticMarkup instead'
      )
    }]
  }, {
    code: 'React.createClass({});',
    errors: [{
      message: 'React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead'
    }]
  }]

});
