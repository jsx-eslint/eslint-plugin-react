/**
 * @fileoverview Prevent missing displayName in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var components = {};

  var MISSING_MESSAGE = 'Component definition is missing display name';
  var MISSING_MESSAGE_NAMED_COMP = '{{component}} component definition is missing display name';

  var defaultClassName = 'eslintReactComponent';

  /**
   * Get the component id from an ASTNode
   * @param {ASTNode} node The AST node being checked.
   * @returns {String} The component id.
   */
  function getComponentId(node) {
    if (
      node.type === 'MemberExpression' &&
      node.property && node.property.name === 'displayName' &&
      node.object && components[node.object.name]
    ) {
      return node.object.name;
    }

    var scope = context.getScope();
    while (scope && scope.type !== 'class') {
      scope = scope.upper;
    }

    if (scope) {
      return scope.block.id.name;
    }

    return defaultClassName;
  }

  /**
   * Get the component from an ASTNode
   * @param {ASTNode} node The AST node being checked.
   * @returns {Object} The component object.
   */
  function getComponent(node) {
    var id = getComponentId(node);
    if (!components[id]) {
      components[id] = {
        name: id,
        node: node,
        hasDisplayName: false
      };
    }
    return components[id];
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
    var component = getComponent(node);
    component.isComponentDefinition = true;
  }

  /**
   * Checks if we are inside a component definition
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if we are inside a component definition, false if not.
   */
  function isComponentDefinition(node) {
    var isES5Component = Boolean(
      node.parent &&
      node.parent.callee &&
      node.parent.callee.object &&
      node.parent.callee.property &&
      node.parent.callee.object.name === 'React' &&
      node.parent.callee.property.name === 'createClass'
    );
    var isES6Component = getComponent(node).isComponentDefinition;
    return isES5Component || isES6Component;
  }

  /**
   * Checks if we are declaring a display name
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if we are declaring a display name, false if not.
   */
  function isDisplayNameDeclaration(node) {
    return Boolean(
      node &&
      node.name === 'displayName'
    );
  }

  /**
   * Mark a prop type as declared
   * @param {ASTNode} node The AST node being checked.
   */
  function markDisplayNameAsDeclared(node) {
    var component = getComponent(node);
    component.hasDisplayName = true;
  }

  /**
   * Reports missing display name for a given component
   * @param {String} id The id of the component to process
   */
  function reportMissingDisplayName(id) {
    if (!components[id] || components[id].hasDisplayName === true) {
      return;
    }
    context.report(
      components[id].node,
      id === defaultClassName ? MISSING_MESSAGE : MISSING_MESSAGE_NAMED_COMP, {
        component: id
      }
    );
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    MemberExpression: function(node) {
      if (!isDisplayNameDeclaration(node.property)) {
        return;
      }
      markDisplayNameAsDeclared(node);
    },

    ObjectExpression: function(node) {
      if (!isComponentDefinition(node)) {
        return;
      }

      // Search for the displayName declaration
      node.properties.forEach(function(property) {
        if (!isDisplayNameDeclaration(property.key)) {
          return;
        }
        markDisplayNameAsDeclared(node);
      });
    },

    'ObjectExpression:exit': function(node) {
      if (!isComponentDefinition(node)) {
        return;
      }

      // Report missing display name for all ES5 classes
      reportMissingDisplayName(defaultClassName);

      // Reset the ES5 default object
      components[defaultClassName] = null;
    },

    'Program:exit': function() {
      // Report missing display name for all ES6 classes
      for (var component in components) {
        if (!components.hasOwnProperty(component)) {
          continue;
        }
        reportMissingDisplayName(component);
      }
    },

    ReturnStatement: detectReactComponent
  };

};
