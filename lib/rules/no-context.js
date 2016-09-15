/**
 * @fileoverview Prevent usage of context
 * @author Zach Guo
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of context',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: Components.detect(function(context, component, utils) {

    /**
     * Checks if we are using context
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if we are using context, false if not.
     */
    function isContextUsage(node) {
      return Boolean(
        (utils.getParentES6Component() || utils.getParentES5Component()) &&
        node.object.type === 'ThisExpression' &&
        node.property.name === 'context'
      );
    }

    /**
   * Checks if we are declaring a context
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if we are declaring a context, false if not.
   */
    function isContextTypesDeclaration(node) {
      // Special case for class properties
      // (babel-eslint does not expose property name so we have to rely on tokens)
      if (node && node.type === 'ClassProperty') {
        var tokens = context.getFirstTokens(node, 2);
        if (
          tokens[0].value === 'contextTypes' ||
          (tokens[1] && tokens[1].value === 'contextTypes')
        ) {
          return true;
        }
        return false;
      }
      return Boolean(
        node &&
        node.name === 'contextTypes'
      );
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     * @returns {Boolean} True if node is a stateless functional component,
     *   false if not.
     */
    function isStatelessComponent(node) {
      return Boolean(
        node.parent.type === 'VariableDeclarator' &&
        utils.isReturningJSX(node)
      );
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     * @returns {Boolean} True if we are using context, false if not.
     */
    function isContextUsageInStatelessComponent(node) {
      return Boolean(
        node &&
        node.params &&
        node.params[1]
      );
    }

    /**
     * @param {ASTNode} node We expect either an ArrowFunctionExpression,
     *   FunctionDeclaration, or FunctionExpression
     */
    function handleStatelessComponent(node) {
      if (
        isStatelessComponent(node) &&
        isContextUsageInStatelessComponent(node)
      ) {
        context.report({
          node: node,
          message: 'Using context is not allowed.'
        });
      }
    }

    return {

      ClassProperty: function(node) {
        if (isContextTypesDeclaration(node)) {
          context.report({
            node: node,
            message: 'Using context is not allowed.'
          });
        }
      },

      MemberExpression: function(node) {
        if (
          isContextUsage(node) ||
          isContextTypesDeclaration(node) ||
          isContextTypesDeclaration(node.property)
        ) {
          context.report({
            node: node,
            message: 'Using context is not allowed.'
          });
        }
      },

      ObjectExpression: function(node) {
        node.properties.forEach(function(property) {
          if (!isContextTypesDeclaration(property.key)) {
            return;
          }
          if (property.value.type === 'ObjectExpression') {
            context.report({
              node: node,
              message: 'Using context is not allowed.'
            });
          }
        });
      },

      FunctionDeclaration: handleStatelessComponent,

      ArrowFunctionExpression: handleStatelessComponent,

      FunctionExpression: handleStatelessComponent

    };

  })
};
