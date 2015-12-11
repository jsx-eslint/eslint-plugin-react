/**
 * @fileoverview Don't access ReactDOM/ReactDOMServer methods on React object
 * @author Scott Feeney
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var movedMethods = {
  render: 'ReactDOM',
  unmountComponentAtNode: 'ReactDOM',
  findDOMNode: 'ReactDOM',
  renderToString: 'ReactDOMServer',
  renderToStaticMarkup: 'ReactDOMServer'
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    MemberExpression: function(node) {
      if (
        node.object.type === 'Identifier'
        && node.object.name.match(/^react$/i)
        && node.property.type === 'Identifier'
        && Object.keys(movedMethods).indexOf(node.property.name) !== -1
      ) {
        var method = node.property.name;
        context.report({
          node: node,
          message: (
            'React.' + method + ' is deprecated; ' +
            'use ' + movedMethods[method] + '.' + method + ' instead.'
          )
        });
      }
    }
  };
};
