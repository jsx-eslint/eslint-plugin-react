/**
 * @fileoverview Prevent casing typos when declaring propTypes, contextTypes and defaultProps
 */
'use strict';

const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var STATIC_CLASS_PROPERTIES = ['propTypes', 'contextTypes', 'childContextTypes', 'defaultProps'];

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
    function reportErrorIfCasingTypo(node, propertyName) {
      STATIC_CLASS_PROPERTIES.forEach(function(CLASS_PROP) {
        if (CLASS_PROP.toLowerCase() === propertyName.toLowerCase() && CLASS_PROP !== propertyName) {
          context.report({
            node: node,
            message: 'Typo in static class property declaration'
          });
        }
      });
    }

    return {
      ClassProperty: function(node) {
        if (!node.static || !utils.isES6Component(node.parent.parent)) {
          return;
        }

        const tokens = context.getFirstTokens(node, 2);
        const propertyName = tokens[1].value;
        reportErrorIfCasingTypo(node, propertyName);
      },

      MemberExpression: function(node) {
        const relatedComponent = utils.getRelatedComponent(node);

        if (
          relatedComponent &&
          (utils.isES6Component(relatedComponent.node) || utils.isReturningJSX(relatedComponent.node))
        ) {
          const propertyName = node.property.name;
          reportErrorIfCasingTypo(node, propertyName);
        }
      }
    };
  })
};
