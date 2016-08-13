/**
 * @fileoverview Prevent variables used in JSX to be marked as unused
 * @author Yannick Croissant
 */
'use strict';

var variableUtil = require('../util/variable');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent variables used in JSX to be marked as unused',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {

    return {
      JSXExpressionContainer: function(node) {
        if (node.expression.type !== 'Identifier') {
          return;
        }
        variableUtil.markVariableAsUsed(context, node.expression.name);
      },

      JSXOpeningElement: function(node) {
        var name;
        if (node.name.namespace && node.name.namespace.name) {
          // <Foo:Bar>
          name = node.name.namespace.name;
        } else if (node.name.name) {
          // <Foo>
          name = node.name.name;
        } else if (node.name.object) {
          // <Foo...Bar>
          var parent = node.name.object;
          while (parent.object) {
            parent = parent.object;
          }
          name = parent.name;
        } else {
          return;
        }

        variableUtil.markVariableAsUsed(context, name);
      }

    };

  }
};
