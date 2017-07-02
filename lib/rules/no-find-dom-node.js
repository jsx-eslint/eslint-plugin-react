/**
 * @fileoverview Prevent usage of findDOMNode
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of findDOMNode',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      CallExpression: function(node) {
        const callee = node.callee;

        const isfindDOMNode =
          (callee.name === 'findDOMNode') ||
          (callee.property && callee.property.name === 'findDOMNode')
        ;

        if (!isfindDOMNode) {
          return;
        }

        context.report({
          node: callee,
          message: 'Do not use findDOMNode'
        });
      }
    };
  }
};
