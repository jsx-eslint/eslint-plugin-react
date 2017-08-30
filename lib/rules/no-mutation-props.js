/**
 * @fileoverview Prevent mutation of this.props
 * @author Ian Schmitz, Joey Baker
 */
'use strict';

const Components = require('../util/Components');
const ARRAY_MUTATIONS = ['push', 'pop', 'shift', 'unshift'];

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

  create: Components.detect((context, components, utils) => {
    /**
     * Determines if a given node is from `this.props`
     * @param {Object} node The node to examine
     */
    function isPropsNode (node) {
      if (!node) {
        return false;
      }

      let topObject = node;

      // when looking at an object path, get the top-most object
      while (topObject.object) {
        if (topObject.object && topObject.object.object) {
          topObject = topObject.object;
        } else {
          break;
        }
      }

      // if this is a simple `this.props` call, we can bail early
      if (topObject.object && topObject.object.type === 'ThisExpression') {
        return topObject.property && topObject.property.name === 'props';
      }

      // if this is a variable, we need to look at the scope to determine if
      // it is actually a reference to a prop
      const name = topObject.name || (topObject.object && topObject.object.name);
      const originalDeclaration = context.getScope().variableScope.set.get(name);
      if (originalDeclaration) {
        const originalIdentifiers = originalDeclaration.identifiers;
        // if the get call returns falsey, we've not set it in our cache
        // and it can't have have been from props. See `VariableDeclaration`
        const currentIdentifier = components.get(originalIdentifiers[originalIdentifiers.length - 1]);
        return currentIdentifier && currentIdentifier.isFromProps;
      }

      return false;
    }

    function setPropMutation(mutation, node) {
      const component = components.get(utils.getParentComponent());
      const propMutations = component && component.propMutations
        ? component.propMutations.concat([mutation])
        : [mutation];
      components.set(node || mutation, {propMutations});
    }

    /**
     * Reports this.props mutations for a given component
     * @param {Object} component The component to process
     */
    function reportMutations(component) {
      if (!component.propMutations) {
        return;
      }

      component.propMutations.forEach(mutation => {
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
      VariableDeclaration: function(node) {
        if (!node.declarations) {
          return;
        }

        node.declarations.forEach(declaration => {
          const init = declaration.init;
          const id = declaration.id;
          const isProps = isPropsNode(init);
          if (!isProps) {
            return;
          }
          const assignments =
            // if this is a simple assignment `const b = this.props.b`
            (id.type === 'Identifier' && [id])
            // if this is object destructuring `const {b} = this.props`
            || (id.type === 'ObjectPattern' && id.properties.map(property => property.value))
            // if this is array destructuring `const [b] = this.props.list`
            || (id.type === 'ArrayPattern' && id.elements);

          // remember that this node is a prop, `isFromProps` relies on this
          assignments.forEach(assignment => {
            components.add(assignment);
            components.set(assignment, {
              isFromProps: true
            });
          });
        });
      },

      UnaryExpression: function(node) {
        const isDeleteOperation = node.operator === 'delete';
        if (!isDeleteOperation) {
          return;
        }
        const isProp = isPropsNode(node.argument);
        if (!isProp) {
          return;
        }

        setPropMutation(node);
      },

      CallExpression: function(node) {
        const callee = node.callee;
        const args = node.arguments;
        const calleeName = callee.property && callee.property.name;

        const isObjectMutation =
          callee.type === 'MemberExpression'
          && callee.object.name === 'Object'
          && (
            calleeName === 'assign'
            || calleeName === 'defineProperty'
          );

        const isArrayMutation =
          callee.type === 'MemberExpression'
          && ARRAY_MUTATIONS.indexOf(calleeName) > -1;

        if (!isObjectMutation && !isArrayMutation) {
          return;
        }

        const isCloneOperation = args.length && args[0].type === 'ObjectExpression';

        if (isObjectMutation && isCloneOperation) {
          return;
        }

        // object mutations are a function call where the possible prop is
        // always the first arg. Array mutations are always method calls on the
        // possible prop
        const isProps = isPropsNode(isObjectMutation ? args[0] : callee.object);

        if (!isProps) {
          return;
        }

        setPropMutation(node);
      },

      AssignmentExpression: function (node) {
        if (isPropsNode(node.left)) {
          setPropMutation(node.left.object, node);
        }
      },

      'Program:exit': function () {
        const list = components.list();

        Object.keys(list).forEach(key => {
          const component = list[key];

          reportMutations(component);
        });
      }
    };
  })
};
