/**
 * @fileoverview Prevent variables used in JSX to be marked as unused
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  return {
    JSXExpressionContainer: function(node) {
      if (node.expression.type === 'Identifier') {
        context.markVariableAsUsed(node.expression.name);
      }
    },

    JSXIdentifier: function(node) {
      context.markVariableAsUsed(node.name);
    }

  };

};
