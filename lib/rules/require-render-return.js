/**
 * @fileoverview Enforce ES5 or ES6 class for returning value in render function.
 * @author Mark Orel
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = Components.detect(function(context, components, utils) {

  /**
   * Mark a return statement as present
   * @param {ASTNode} node The AST node being checked.
   */
  function markReturnStatementPresent(node) {
    components.set(node, {
      hasReturnStatement: true
    });
  }

  return {
    ReturnStatement: function(node) {
      var ancestors = context.getAncestors(node).reverse();
      var depth = 0;
      for (var i = 0, j = ancestors.length; i < j; i++) {
        if (/Function(Expression|Declaration)$/.test(ancestors[i].type)) {
          depth++;
        }
        if (
          (ancestors[i].type !== 'Property' && ancestors[i].type !== 'MethodDefinition') ||
          ancestors[i].key.name !== 'render' ||
          depth > 1
        ) {
          continue;
        }
        markReturnStatementPresent(node);
      }
    },

    'Program:exit': function() {
      var list = components.list();
      for (var component in list) {
        if (
          !list.hasOwnProperty(component) ||
          list[component].hasReturnStatement ||
          (!utils.isES5Component(list[component].node) && !utils.isES6Component(list[component].node))
        ) {
          continue;
        }
        context.report({
          node: list[component].node,
          message: 'Your render method should have return statement'
        });
      }
    }
  };
});

module.exports.schema = [{}];
