/**
 * @fileoverview Disallows instantiating classes in JSX attributes
 * @author Daniel Lo Nigro <dan.cx>
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow instantiating classes in JSX attributes',
      category: 'Best Practices',
      recommended: false
    }
  },

  create: function(context) {

    return {
      JSXAttribute: function(node) {
        if (
          node.value &&
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression &&
          node.value.expression.type === 'NewExpression'
        ) {
          context.report({
            node: node,
            message: 'Do not instantiate classes in JSX props'
          });
        }
      }
    };
  }
};
