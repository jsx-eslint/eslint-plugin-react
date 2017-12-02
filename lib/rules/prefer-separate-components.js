/**
 * @fileoverview Report usages of class methods besides render returning JSX
 */
'use strict';

const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Report usages of class methods besides render returning JSX',
      category: 'Best Practices',
      recommended: false
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => {
    function report(node) {
      context.report({
        node,
        message: '{{ function }} should be moved into a separate component.',
        data: {
          function: node.key.name
        }
      });
    }

    return {
      MethodDefinition: function(node) {
        if (!utils.getParentES6Component()) {
          return;
        }
        if (node.key.name !== 'render' && utils.isReturningJSX(node)) {
          report(node);
        }
      }
    };
  })
};
