/**
 * @fileoverview Prevent mutation of this.props
 * @author Ian Schmitz, Joey Baker
 */
'use strict';

const Components = require('../util/Components');
const ARRAY_MUTATIONS = ['push', 'pop', 'shift', 'unshift', 'copyWithin', 'fill', 'reverse', 'sort', 'splice'];
const OBJECT_STATIC_MUTATORS = ['assign', 'defineProperty', 'defineProperties'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent mutation of this.props',
      category: 'Possible Errors',
      recommended: false
    },
    schema: [{
      type: 'object',
      properties: {
        allowArrayMutations: {
          description: 'If true, will allow all array mutations (e.g. `this.props.list.push(1)`). https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods',
          type: 'boolean',
          default: false
        },
        allowableArrayMutations: {
          description: 'Will allow a whitelist of specified array mutations (e.g. `this.props.list.push(1)`) if `allowArrayMutations: true`. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods',
          type: 'array',
          default: []
        },
        allowObjectStatics: {
          description: 'If true, will allow all array mutations (e.g. `this.props.list.push(1)`). https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods',
          type: 'boolean',
          default: false
        },
        allowableObjectStatics: {
          description: 'Will allow a whitelist of specified array mutations (e.g. `this.props.list.push(1)`) if `allowArrayMutations: true`. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Mutator_methods',
          type: 'array',
          default: []
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => {
    const options = context.options[0] || {};
    // allowArrayMutation might be a boolean or an array, if an array it will
    // be a list of array mutations
    const allowArrayMutations = options.allowArrayMutations;
    const initialArrayMutations = allowArrayMutations ? [] : ARRAY_MUTATIONS;
    const allowableArrayMutations = options.allowableArrayMutations && allowArrayMutations
      ? ARRAY_MUTATIONS.filter(mutation => options.allowableArrayMutations.indexOf(mutation) < 0)
      : initialArrayMutations;
    const allowObjectStatics = options.allowObjectStatics;
    const initialObjectStatics = allowObjectStatics ? [] : OBJECT_STATIC_MUTATORS;
    const allowableObjectStatics = options.allowableObjectStatics && allowObjectStatics
      ? OBJECT_STATIC_MUTATORS.filter(mutation => options.allowableObjectStatics.indexOf(mutation) < 0)
      : initialObjectStatics;

    /**
     * Gets a unique ID for a node
     * @param {Object} node The node to get an ID for
     */
    const getId = node => node && node.range.join(':');

    const propsNodes = {};
    /**
     * Adds a node to the list of nodes that come from this.props
     * @param {Object} node The node to add
     */
    const addToPropsNodes = node => {
      const id = getId(node);

      if (!id) {
        return null;
      }

      if (!propsNodes[id]) {
        propsNodes[id] = node;
      }
      return propsNodes[id];
    };

    /**
     * Gets a node if it's been declared as a propsNode
     * @param {Object} node The node to get
     */
    const getPropsNode = node => propsNodes[getId(node)];

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
        const currentIdentifier = getPropsNode(originalIdentifiers[originalIdentifiers.length - 1]);
        return currentIdentifier;
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
          assignments.forEach(addToPropsNodes);
        });
      },

      UpdateExpression: function(node) {
        // allow `const {foo} = this.props; foo++`
        // but disallow this.props.foo++ by looking at the argument.object
        if (isPropsNode(node.argument.object)) {
          setPropMutation(node);
        }
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
          && allowableObjectStatics.indexOf(calleeName) > -1;

        const isArrayMutation =
          callee.type === 'MemberExpression'
          && allowableArrayMutations.indexOf(calleeName) > -1;

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
