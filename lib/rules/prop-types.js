/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var components = {};

  var MISSING_MESSAGE = '\'{{name}}\' is missing in props validation';
  var MISSING_MESSAGE_NAMED_COMP = '\'{{name}}\' is missing in props validation for {{component}}';

  var defaultClassName = 'eslintReactComponent';

  /**
   * Get the component id from an ASTNode
   * @param {ASTNode} node The AST node being checked.
   * @returns {String} The component id.
   */
  function getComponentId(node) {
    if (
      node.type === 'MemberExpression' &&
      node.property && node.property.name === 'propTypes' &&
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
        declaredPropTypes: [],
        usedPropTypes: [],
        isComponentDefinition: false,
        ignorePropsValidation: false
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
   * Checks if we are using a prop
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if we are using a prop, false if not.
   */
  function isPropTypesUsage(node) {
    return Boolean(
      node.object.type === 'ThisExpression' &&
      node.property.name === 'props'
    );
  }

  /**
   * Checks if we are declaring a prop
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if we are declaring a prop, false if not.
   */
  function isPropTypesDeclaration(node) {
    return Boolean(
      node &&
      node.name === 'propTypes'
    );
  }

  /**
   * Mark a prop type as used
   * @param {ASTNode} node The AST node being marked.
   */
  function markPropTypesAsUsed(node) {
    var component = getComponent(node);
    var type;
    if (node.parent.property && node.parent.property.name) {
      type = 'direct';
    } else if (
      node.parent.parent.declarations &&
      node.parent.parent.declarations[0].id.properties &&
      node.parent.parent.declarations[0].id.properties[0].key.name
    ) {
      type = 'destructuring';
    }

    switch (type) {
      case 'direct':
        component.usedPropTypes.push({
          name: node.parent.property.name,
          node: node
        });
        break;
      case 'destructuring':
        for (var i = 0, j = node.parent.parent.declarations[0].id.properties.length; i < j; i++) {
          component.usedPropTypes.push({
            name: node.parent.parent.declarations[0].id.properties[i].key.name,
            node: node
          });
        }
        break;
      default:
        break;
    }
  }

  /**
   * Mark a prop type as declared
   * @param {ASTNode} node The AST node being checked.
   * @param {propTypes} node The AST node containing the proptypes
   */
  function markPropTypesAsDeclared(node, propTypes) {
    var component = getComponent(node);
    switch (propTypes.type) {
      case 'ObjectExpression':
        for (var i = 0, j = propTypes.properties.length; i < j; i++) {
          component.declaredPropTypes.push(propTypes.properties[i].key.name);
        }
        break;
      case 'MemberExpression':
        component.declaredPropTypes.push(propTypes.property.name);
        break;
      default:
        component.ignorePropsValidation = true;
        break;
    }
  }

  /**
   * Reports undeclared proptypes for a given component
   * @param {String} id The id of the component to process
   */
  function reportUndeclaredPropTypes(id) {
    if (!components[id] || components[id].ignorePropsValidation === true) {
      return;
    }
    for (var i = 0, j = components[id].usedPropTypes.length; i < j; i++) {
      var isDeclared = components[id].declaredPropTypes.indexOf(components[id].usedPropTypes[i].name) !== -1;
      var isChildren = components[id].usedPropTypes[i].name === 'children';
      if (isDeclared || isChildren) {
        continue;
      }
      context.report(
        components[id].usedPropTypes[i].node,
        id === defaultClassName ? MISSING_MESSAGE : MISSING_MESSAGE_NAMED_COMP, {
          name: components[id].usedPropTypes[i].name,
          component: id
        }
      );
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    MemberExpression: function(node) {
      var type;
      if (isPropTypesUsage(node)) {
        type = 'usage';
      } else if (isPropTypesDeclaration(node.property)) {
        type = 'declaration';
      }

      switch (type) {
        case 'usage':
          markPropTypesAsUsed(node);
          break;
        case 'declaration':
          markPropTypesAsDeclared(node, node.parent.right || node.parent);
          break;
        default:
          break;
      }
    },

    ObjectExpression: function(node) {
      if (!isComponentDefinition(node)) {
        return;
      }

      // Search for the propTypes declaration
      node.properties.forEach(function(property) {
        if (!isPropTypesDeclaration(property.key)) {
          return;
        }
        markPropTypesAsDeclared(node, property.value);
      });
    },

    'ObjectExpression:exit': function(node) {
      if (!isComponentDefinition(node)) {
        return;
      }

      // Report undeclared proptypes for all ES5 classes
      reportUndeclaredPropTypes(defaultClassName);

      // Reset the ES5 default object
      if (components[defaultClassName]) {
        components[defaultClassName].declaredPropTypes.length = 0;
        components[defaultClassName].usedPropTypes.length = 0;
        components[defaultClassName].isComponentDefinition = false;
        components[defaultClassName].ignorePropsValidation = false;
      }
    },

    'Program:exit': function() {
      // Report undeclared proptypes for all ES6 classes
      for (var component in components) {
        if (!components.hasOwnProperty(component)) {
          continue;
        }
        reportUndeclaredPropTypes(component);
      }
    },

    ReturnStatement: detectReactComponent
  };

};
