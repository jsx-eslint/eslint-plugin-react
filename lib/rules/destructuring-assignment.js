/**
 * @fileoverview Enforce consistent usage of destructuring assignment of props, state, and context.
 **/
'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

const DEFAULT_OPTION = 'always';
const SCHEMA = {
  type: 'string',
  enum: [
    'always',
    'never'
  ]
};

/**
 * Check if the node is in a render method of the component.
 *
 * @param {Object} node - The node.
 * @param {Object} component - The component.
 * @returns {Boolean} - Returns whether or not the node is in a render method.
 */
function isInRenderMethod(node, component) {
  while (node !== component) {
    if (node.type === 'MethodDefinition' || node.type === 'Property') {
      // Check if the method is named render and that it's not a static method
      return !node.static && node.key.name === 'render';
    }

    node = node.parent;
  }

  return false;
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent usage of destructuring assignment of props, state, and context',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('destructuring-assignment')
    },
    schema: [{
      oneOf: [SCHEMA, {
        type: 'object',
        properties: {
          SFC: SCHEMA,
          class: SCHEMA,
          createClass: SCHEMA
        }
      }]
    }]
  },

  create: Components.detect((context, components, utils) => {
    function getConfiguration(componentType) {
      if (typeof context.options[0] === 'object') {
        return context.options[0][componentType] || DEFAULT_OPTION;
      }

      return context.options[0] || DEFAULT_OPTION;
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function handleStatelessComponent(node) {
      const hasProps = node.params && node.params[0];
      const isDestructuringProps = hasProps && node.params[0].type === 'ObjectPattern';
      const hasContext = node.params && node.params[1];
      const isDestructuringContext = hasContext && node.params[1].type === 'ObjectPattern';

      if (!components.get(node) || components.get(node).confidence === 0) {
        return;
      }

      if (getConfiguration('SFC') === 'never') {
        if (hasProps && isDestructuringProps) {
          context.report({
            node: node,
            message: 'Must never use destructuring props assignment in SFC argument'
          });
        }

        if (hasContext && isDestructuringContext) {
          context.report({
            node: node,
            message: 'Must never use destructuring context assignment in SFC argument'
          });
        }
      }
    }

    function handleStatelessUsage(node, component) {
      if (getConfiguration('SFC') === 'always') {
        const propsName = component.params[0] ? component.params[0].name : null;
        const contextName = component.params[1] ? component.params[1].name : null;

        if (!node.object.type === 'Identifier') {
          return;
        }

        const objName = node.object.name;

        if (objName === propsName) {
          context.report({
            node: node,
            message: 'Must use destructuring props assignment in SFC argument'
          });
        } else if (objName === contextName) {
          context.report({
            node: node,
            message: 'Must use destructuring context assignment in SFC argument'
          });
        }
      }
    }

    function handleClassUsage(node, component, configuration) {
      // Check if we are in a render method
      if (!isInRenderMethod(node, component)) {
        return;
      }

      // this.props.Aprop || this.context.aProp || this.state.aState
      const isPropUsed = (
        node.object.type === 'MemberExpression' && node.object.object.type === 'ThisExpression' &&
        (node.object.property.name === 'props' || node.object.property.name === 'context' || node.object.property.name === 'state')
      );

      if (isPropUsed && configuration === 'always') {
        context.report({
          node: node,
          message: `Must use destructuring ${node.object.property.name} assignment`
        });
      }
    }

    return {
      FunctionDeclaration: handleStatelessComponent,
      ArrowFunctionExpression: handleStatelessComponent,
      FunctionExpression: handleStatelessComponent,

      MemberExpression: function(node) {
        const component = utils.getParentComponent();

        if (!component) {
          return;
        }

        if (utils.isES6Component(component)) {
          handleClassUsage(node, component, getConfiguration('class'));
        } else if (utils.isES5Component(component)) {
          handleClassUsage(node, component, getConfiguration('createClass'));
        } else {
          handleStatelessUsage(node, component);
        }
      },

      VariableDeclarator: function(node) {
        const component = utils.getParentComponent(node);
        const isDestructuring = (node.init && node.id && node.id.type === 'ObjectPattern');

        if (!isDestructuring || !component) {
          return;
        }

        // Checks for class components
        if (utils.isES5Component(component) || utils.isES6Component(component)) {
          const isDestructuringClassProperties = node.init.object && node.init.object.type === 'ThisExpression' && (
            node.init.property.name === 'props' || node.init.property.name === 'context' || node.init.property.name === 'state'
          );

          if (!isDestructuringClassProperties || !isInRenderMethod(node, component)) {
            return;
          }

          if (utils.isES5Component(component) && getConfiguration('createClass') === 'never') {
            context.report({
              node: node,
              message: `Must never use destructuring ${node.init.property.name} assignment`
            });
          } else if (utils.isES6Component(component) && getConfiguration('class') === 'never') {
            context.report({
              node: node,
              message: `Must never use destructuring ${node.init.property.name} assignment`
            });
          }

          return;
        }

        if (component.params[0] && component.params[0].name === node.init.name) {
          context.report({
            node: node,
            message: 'Must never use destructuring props assignment'
          });

          return;
        }

        if (component.params[1] && component.params[1].name === node.init.name) {
          context.report({
            node: node,
            message: 'Must never use destructuring context assignment'
          });

          return;
        }
      }
    };
  })
};
