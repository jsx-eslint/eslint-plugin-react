/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var components = [];

  var MULTI_COMP_MESSAGE = 'Declare only one React component per file';

  /**
   * Checks if we are inside a component definition
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if we are inside a component definition, false if not.
   */
  function isComponentDefinition(node) {
    return Boolean(
      node.parent &&
      node.parent.callee &&
      node.parent.callee.object &&
      node.parent.callee.property &&
      node.parent.callee.object.name === 'React' &&
      node.parent.callee.property.name === 'createClass'
    );
  }

  /**
   * Get the component from an ASTNode
   * @param {ASTNode} node The AST node being checked.
   * @returns {Object} The component object.
   */
  function getComponent() {
    var scope = context.getScope();
    while (scope && scope.type !== 'class') {
      if (isComponentDefinition(scope.block.parent.parent)) {
        return scope.block.parent.parent.parent.callee;
      }
      scope = scope.upper;
    }

    return scope.block;
  }

  /**
   * Detect if we are in a React component by checking the render method
   * @param {ASTNode} node The AST node being checked.
   */
  function detectReactComponent(node) {
    var scope = context.getScope();
    if (
        (node.argument.type === 'Literal' && (node.argument.value !== null && node.argument.value !== false)) &&
        (node.argument.type !== 'JSXElement') &&
        (scope.block.parent.key.name === 'render')
    ) {
      return;
    }
    components.push(getComponent(node));
  }

  /**
   * Reports missing display name for a given component
   * @param {String} id The id of the component to process
   */
  function reportMultiComponent() {
    if (components.length <= 1) {
      return;
    }

    for (var i = 1, j = components.length; i < j; i++) {
      context.report(components[i], MULTI_COMP_MESSAGE);
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    'Program:exit': reportMultiComponent,

    ReturnStatement: detectReactComponent
  };
};
