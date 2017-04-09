/**
 * @fileoverview Prevent mutation of this.props
 * @author Ian Schmitz
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent mutation of this.props',
      category: 'Possible Errors',
      recommended: false
    }
  },

  create: Components.detect(function (context, components, utils) {

    /**
     * Reports this.props mutations for a given component
     * @param {Object} component The component to process
     */
    function reportMutations(component) {
      if (!component.mutations) {
        return;
      }

      component.mutations.forEach(function(mutation) {
        context.report({
          node: mutation,
          message: 'A component must never modify its own props.'
        });
      });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      AssignmentExpression: function (node) {
        var item;

        if (!node.left || !node.left.object || !node.left.object.object) {
          return;
        }

        item = node.left.object;
        while (item.object && item.object.property) {
          item = item.object;
        }

        if (item.object.type === 'ThisExpression' && item.property.name === 'props') {
          var component = components.get(utils.getParentComponent());
          var mutations = component && component.mutations || [];
          mutations.push(node.left.object);
          components.set(node, {
            mutations: mutations
          });
        }
      },

      'Program:exit': function () {
        var list = components.list();

        Object.keys(list).forEach(function (key) {
          var component = list[key];

          reportMutations(component);
        });
      }
    };

  })
};
