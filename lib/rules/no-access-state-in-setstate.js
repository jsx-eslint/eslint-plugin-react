/**
 * @fileoverview Prevent usage of this.state within setState
 * @author Rolf Erik Lekang
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Reports when this.state is accessed within setState',
      category: 'Possible Errors',
      recommended: false
    }
  },

  create: function(context) {
    function isSetStateCall(node) {
      return node.type === 'CallExpression' &&
        node.callee &&
        node.callee.property &&
        node.callee.property.name === 'setState';
    }

    return {
      ThisExpression: function(node) {
        var memberExpression = node.parent;
        if (memberExpression.property.name === 'state') {
          var current = memberExpression;
          while (current.type !== 'Program') {
            if (isSetStateCall(current)) {
              context.report({
                node: memberExpression,
                message: 'Use callback in setState when referencing the previous state.'
              });
              break;
            }
            current = current.parent;
          }
        }
      }
    };
  }
};
