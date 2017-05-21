/**
 * @fileoverview Prevent casing typos when declaring propTypes, contextTypes and defaultProps
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var STATIC_CLASS_PROPERTIES = ['propTypes', 'contextTypes', 'defaultProps'];

module.exports = {
  meta: {
    docs: {
      description: 'Prevent casing typos when declaring static class properties',
      category: 'Stylistic Issues',
      recommended: false
    },
    schema: []
  },

  create: Components.detect(function(context, components, utils) {

    function reportError(node) {
      context.report({
        node: node,
        message: 'Typo in static class property declaration'
      });
    }

    return {
      ClassProperty: function(node) {
        if (!node.static || !utils.isES6Component(node.parent.parent)) {
          return;
        }

        var tokens = context.getFirstTokens(node, 2);

        var propertyName = tokens[1].value;
        var propertyNameLowerCase = propertyName.toLowerCase();

        STATIC_CLASS_PROPERTIES.forEach(function(CLASS_PROP) {
          if (CLASS_PROP.toLowerCase() === propertyNameLowerCase && CLASS_PROP !== propertyName) {
            reportError(node);
          }
        });
      }
    };
  })
};
