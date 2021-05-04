/**
 * @fileoverview Enforce ES5 or ES6 class for returning value in render function.
 * @author Mark Orel
 */

'use strict';

const values = require('object.values');
const Components = require('../util/Components');
const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce ES5 or ES6 class for returning value in render function',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('require-render-return')
    },

    messages: {
      noRenderReturn: 'Your render method should have a return statement'
    },

    schema: []
  },

  create: Components.detect((context, components, utils) => {
    /**
     * Mark a return statement as present
     * @param {ASTNode} node The AST node being checked.
     */
    function markReturnStatementPresent(node) {
      components.set(node, {
        hasReturnStatement: true
      });
    }

    /**
     * Find render method in a given AST node
     * @param {ASTNode} node The component to find render method.
     * @returns {ASTNode} Method node if found, undefined if not.
     */
    function findRenderMethod(node) {
      const properties = astUtil.getComponentProperties(node);
      return properties
        .find((property) => astUtil.getPropertyName(property) === 'render'
          && property.value && astUtil.isFunctionLikeExpression(property.value)
        );
    }

    return {
      ReturnStatement(node) {
        const ancestors = context.getAncestors(node).reverse();
        let depth = 0;
        ancestors.forEach((ancestor) => {
          if (/Function(Expression|Declaration)$/.test(ancestor.type)) {
            depth++;
          }
          if (
            /(MethodDefinition|(Class)?Property)$/.test(ancestor.type)
            && astUtil.getPropertyName(ancestor) === 'render'
            && depth <= 1
          ) {
            markReturnStatementPresent(node);
          }
        });
      },

      ArrowFunctionExpression(node) {
        if (node.expression === false || astUtil.getPropertyName(node.parent) !== 'render') {
          return;
        }
        markReturnStatementPresent(node);
      },

      'Program:exit'() {
        const list = components.list();
        values(list).forEach((component) => {
          if (
            component.hasReturnStatement
            || !findRenderMethod(component.node)
            || (!utils.isES5Component(component.node) && !utils.isES6Component(component.node))
          ) {
            return;
          }
          context.report({
            node: findRenderMethod(component.node),
            messageId: 'noRenderReturn'
          });
        });
      }
    };
  })
};
