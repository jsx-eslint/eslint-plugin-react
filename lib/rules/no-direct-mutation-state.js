/**
 * @fileoverview Prevent direct mutation of this.state
 * @author David Petersen
 * @author Nicolas Fernandez <@burabure>
 */
'use strict';

const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent direct mutation of this.state',
      category: 'Possible Errors',
      recommended: true
    },

    schema: [{
      type: 'object',
      properties: {
        constructors: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const configuration = context.options[0] || {};
    const ctorsMethod = configuration.constructors || [];

    /**
     * Checks if the component is valid
     * @param {Object} component The component to process
     * @returns {Boolean} True if the component is valid, false if not.
     */
    function isValid(component) {
      return Boolean(component && !component.mutateSetState);
    }

    /**
     * Checks if the method is ignored
     * @param {String} name Name of the method to check.
     * @returns {Boolean} True if the method is ignored, false if not.
     */
    function isCtorMethod(name) {
      return ctorsMethod.indexOf(name) !== -1;
    }

    /**
     * Checks if the node is constructor or ignored
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if the method is is constructor or ignored, false if not.
     */
    function isConstructor(node) {
      return node.kind === 'constructor' || (node.kind === 'method' && isCtorMethod(node.key.name));
    }

    /**
     * Reports undeclared proptypes for a given component
     * @param {Object} component The component to process
     */
    function reportMutations(component) {
      let mutation;
      for (let i = 0, j = component.mutations.length; i < j; i++) {
        mutation = component.mutations[i];
        context.report({
          node: mutation,
          message: 'Do not mutate state directly. Use setState().'
        });
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------
    let inConstructorOrIgnored = false;
    let inCallExpression = false;

    return {
      MethodDefinition(node) {
        if (isConstructor(node)) {
          inConstructorOrIgnored = true;
        }
      },

      CallExpression: function() {
        inCallExpression = true;
      },

      AssignmentExpression(node) {
        let item;
        if ((inConstructorOrIgnored && !inCallExpression) || !node.left || !node.left.object) {
          return;
        }
        item = node.left;
        while (item.object && item.object.property) {
          item = item.object;
        }
        if (
          item.object.type === 'ThisExpression' &&
          item.property.name === 'state'
        ) {
          const component = components.get(utils.getParentComponent());
          const mutations = (component && component.mutations) || [];
          mutations.push(node.left.object);
          components.set(node, {
            mutateSetState: true,
            mutations
          });
        }
      },

      'CallExpression:exit': function() {
        inCallExpression = false;
      },

      'MethodDefinition:exit': function (node) {
        if (isConstructor(node)) {
          inConstructorOrIgnored = false;
        }
      },

      'Program:exit': function () {
        const list = components.list();

        Object.keys(list).forEach(key => {
          if (!isValid(list[key])) {
            reportMutations(list[key]);
          }
        });
      }
    };
  })
};
