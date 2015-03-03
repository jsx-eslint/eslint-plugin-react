/**
 * @fileoverview Prevent usage of deprecated methods
 * @author Yannick Croissant
 * @author Scott Feeney
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var DEPRECATED_MESSAGE = '{{oldMethod}} is deprecated since React {{version}}{{newMethod}}';

var DEPRECATED = {
  MemberExpression: {
    // 0.12.0
    'React.renderComponent': ['0.12.0', 'React.render'],
    'React.renderComponentToString': ['0.12.0', 'React.renderToString'],
    'React.renderComponentToStaticMarkup': ['0.12.0', 'React.renderToStaticMarkup'],
    'React.isValidComponent': ['0.12.0', 'React.isValidElement'],
    'React.PropTypes.component': ['0.12.0', 'React.PropTypes.element'],
    'React.PropTypes.renderable': ['0.12.0', 'React.PropTypes.node'],
    'React.isValidClass': ['0.12.0'],
    'this.transferPropsTo': ['0.12.0', 'spread operator ({...})'],
    // 0.13.0
    'React.addons.classSet': ['0.13.0', 'the npm module classnames'],
    'React.addons.cloneWithProps': ['0.13.0', 'React.cloneElement'],
    // 0.14.0
    'React.render': ['0.14.0', 'ReactDOM.render'],
    'React.unmountComponentAtNode': ['0.14.0', 'ReactDOM.unmountComponentAtNode'],
    'React.findDOMNode': ['0.14.0', 'ReactDOM.findDOMNode'],
    'React.renderToString': ['0.14.0', 'ReactDOMServer.renderToString'],
    'React.renderToStaticMarkup': ['0.14.0', 'ReactDOMServer.renderToStaticMarkup']
  }
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  // Validate React version passed in options
  // (append the patch version if missing, allowing shorthands like 0.12 for React 0.12.0)
  var optVer = context.options[0] ? context.options[0].react : '999.999.999';
  optVer = /^[0-9]+\.[0-9]+$/.test(optVer) ? optVer + '.0' : optVer;
  optVer = optVer.split('.').map(function(part) {
    return Number(part);
  });

  function checkVersion(methodVer) {
    methodVer = methodVer.split('.').map(function(part) {
      return Number(part);
    });
    var higherMajor = methodVer[0] < optVer[0];
    var higherMinor = methodVer[0] === optVer[0] && methodVer[1] < optVer[1];
    var higherOrEqualPatch = methodVer[0] === optVer[0] && methodVer[1] === optVer[1] && methodVer[2] <= optVer[2];

    return higherMajor || higherMinor || higherOrEqualPatch;
  }

  function isDeprecated(type, method) {
    return (
      DEPRECATED[type] &&
      DEPRECATED[type][method] &&
      checkVersion(DEPRECATED[type][method][0])
    );
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    MemberExpression: function(node) {
      var method = context.getSource(node);
      if (!isDeprecated(node.type, method)) {
        return;
      }
      context.report(node, DEPRECATED_MESSAGE, {
        oldMethod: method,
        version: DEPRECATED[node.type][method][0],
        newMethod: DEPRECATED[node.type][method][1] ? ', use ' + DEPRECATED[node.type][method][1] + ' instead' : ''
      });
    }

  };

};

module.exports.schema = [{
  type: 'object',
  properties: {
    react: {
      type: 'string',
      pattern: '^[0-9]+\.[0-9]+(\.[0-9]+)?$'
    }
  },
  additionalProperties: false
}];
