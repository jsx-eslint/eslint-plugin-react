/**
 * @fileoverview Enforce stateless components to be written as a pure function
 * @author Yannick Croissant
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = Components.detect(function(context, components, utils) {

  var sourceCode = context.getSourceCode();

  var lifecycleMethods = [
    'state',
    'getInitialState',
    'getChildContext',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
  ];

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  /**
   * Get properties name
   * @param {Object} node - Property.
   * @returns {String} Property name.
   */
  function getPropertyName(node) {
    // Special case for class properties
    // (babel-eslint does not expose property name so we have to rely on tokens)
    if (node.type === 'ClassProperty') {
      var tokens = context.getFirstTokens(node, 2);
      return tokens[1] && tokens[1].type === 'Identifier' ? tokens[1].value : tokens[0].value;
    }

    return node.key.name;
  }

  /**
   * Get properties for a given AST node
   * @param {ASTNode} node The AST node being checked.
   * @returns {Array} Properties array.
   */
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

  /**
   * Check if a given AST node have any lifecycle method
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if the node has at least one lifecycle method, false if not.
   */
  function hasLifecycleMethod(node) {
    var properties = getComponentProperties(node);
    return properties.some(function(property) {
      return lifecycleMethods.indexOf(getPropertyName(property)) !== -1;
    });
  }

  /**
   * Mark a setState as used
   * @param {ASTNode} node The AST node being checked.
   */
  function markSetStateAsUsed(node) {
    components.set(node, {
      useSetState: true
    });
  }

  /**
   * Mark a ref as used
   * @param {ASTNode} node The AST node being checked.
   */
  function markRefAsUsed(node) {
    components.set(node, {
      useRef: true
    });
  }

  return {
    CallExpression: function(node) {
      var callee = node.callee;
      if (callee.type !== 'MemberExpression') {
        return;
      }
      if (callee.object.type !== 'ThisExpression' || callee.property.name !== 'setState') {
        return;
      }
      markSetStateAsUsed(node);
    },

    JSXAttribute: function(node) {
      var name = sourceCode.getText(node.name);
      if (name !== 'ref') {
        return;
      }
      markRefAsUsed(node);
    },

    'Program:exit': function() {
      var list = components.list();
      for (var component in list) {
        if (
          !list.hasOwnProperty(component) ||
          hasLifecycleMethod(list[component].node) ||
          list[component].useSetState ||
          list[component].useRef ||
          (!utils.isES5Component(list[component].node) && !utils.isES6Component(list[component].node))
        ) {
          continue;
        }

        context.report({
          node: list[component].node,
          message: 'Component should be written as a pure function'
        });
      }
    }
  };

});

module.exports.schema = [];
