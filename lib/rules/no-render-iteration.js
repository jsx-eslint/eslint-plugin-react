/**
 * @fileoverview Prevent usage of iteration in React render functions (no-render-iteration)
 * @author Eli White
 */

'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = Components.detect(function(context, components, utils) {

  function markRenderUsesIteration(node) {
    components.set(node, {
      usesIteration: true
    });
  }

  function getComponentProperties(node) {
    switch (node.type) {
      case 'ClassDeclaration':
        return node.body.body;
      case 'ObjectExpression':
        return node.properties;
      default:
        return [];
    }
  }

  function getPropertyName(node) {
    // Special case for class properties
    // (babel-eslint does not expose property name so we have to rely on tokens)
    if (node.type === 'ClassProperty') {
      var tokens = context.getFirstTokens(node, 2);
      return tokens[1] && tokens[1].type === 'Identifier' ? tokens[1].value : tokens[0].value;
    } else if (['MethodDefinition', 'Property'].indexOf(node.type) !== -1) {
      return node.key.name;
    }
    return '';
  }

  function hasRenderMethod(node) {
    var properties = getComponentProperties(node);
    for (var i = 0, j = properties.length; i < j; i++) {
      if (getPropertyName(properties[i]) !== 'render') {
        continue;
      }
      return /FunctionExpression$/.test(properties[i].value.type);
    }
    return false;
  }

  return {
    CallExpression: function(node) {
      var callee = node.callee;

      if (
        callee.type !== 'MemberExpression' ||
        callee.property.name !== 'map'
      ) {
        return;
      }

      var ancestors = context.getAncestors(node).reverse();
      var depth = 0;
      for (var i = 0, j = ancestors.length; i < j; i++) {
        if (/Function(Expression|Declaration)$/.test(ancestors[i].type)) {
          depth++;
        }
        if (
          !/(MethodDefinition|(Class)?Property)$/.test(ancestors[i].type) ||
          getPropertyName(ancestors[i]) !== 'render' ||
          depth > 1
        ) {
          continue;
        }

        markRenderUsesIteration(node);
      }
    },

    'Program:exit': function() {
      var list = components.list();

      for (var component in list) {
        if (
          !list.hasOwnProperty(component) ||
          !hasRenderMethod(list[component].node) ||
          !list[component].usesIteration ||
          (!utils.isES5Component(list[component].node) && !utils.isES6Component(list[component].node))
        ) {
          continue;
        }
        context.report({
          node: list[component].node,
          message: 'Your render method should not include iteration'
        });
      }
    }
  };
});

module.exports.schema = [{}];
