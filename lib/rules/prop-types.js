/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// As for exceptions for props.children or props.className (and alike) look at
// https://github.com/yannickcr/eslint-plugin-react/issues/7

var componentUtil = require('../util/component');
var ComponentList = componentUtil.List;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var configuration = context.options[0] || {};
  var ignored = configuration.ignore || [];

  var componentList = new ComponentList();

  var MISSING_MESSAGE = '\'{{name}}\' is missing in props validation';
  var MISSING_MESSAGE_NAMED_COMP = '\'{{name}}\' is missing in props validation for {{component}}';

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

    // Special case for class properties
    // (babel-eslint does not expose property name so we have to rely on tokens)
    if (node.type === 'ClassProperty') {
      var tokens = context.getFirstTokens(node, 2);
      if (tokens[0].value === 'propTypes' || tokens[1].value === 'propTypes') {
        return true;
      }
      return false;
    }

    return Boolean(
      node &&
      node.name === 'propTypes'
    );

  }

  /**
   * Checks if the prop is ignored
   * @param {String} name Name of the prop to check.
   * @returns {Boolean} True if the prop is ignored, false if not.
   */
  function isIgnored(name) {
    return ignored.indexOf(name) !== -1;
  }

  /**
   * Checks if the component must be validated
   * @param {Object} component The component to process
   * @returns {Boolean} True if the component must be validated, false if not.
   */
  function mustBeValidated(component) {
    return (
      component &&
      component.isReactComponent &&
      component.usedPropTypes &&
      !component.ignorePropsValidation
    );
  }

  /**
   * Checks if the prop is declared
   * @param {String} name Name of the prop to check.
   * @param {Object} component The component to process
   * @returns {Boolean} True if the prop is declared, false if not.
   */
  function isDeclaredInComponent(component, name) {
    return (
      component.declaredPropTypes &&
      component.declaredPropTypes.indexOf(name) !== -1
    );
  }

  /**
   * Checks if the prop has spread operator.
   * @param {ASTNode} node The AST node being marked.
   * @returns {Boolean} True if the prop has spread operator, false if not.
   */
  function hasSpreadOperator(node) {
    var tokens = context.getTokens(node);
    return tokens.length && tokens[0].value === '...';
  }

  /**
   * Mark a prop type as used
   * @param {ASTNode} node The AST node being marked.
   */
  function markPropTypesAsUsed(node) {
    var component = componentList.getByNode(context, node);
    var usedPropTypes = component && component.usedPropTypes || [];
    var type;
    if (node.parent.property && node.parent.property.name && !node.parent.computed) {
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
        usedPropTypes.push({
          name: node.parent.property.name,
          node: node.parent.property
        });
        break;
      case 'destructuring':
        var properties = node.parent.parent.declarations[0].id.properties;
        for (var i = 0, j = properties.length; i < j; i++) {
          if (hasSpreadOperator(properties[i])) {
            continue;
          }
          usedPropTypes.push({
            name: properties[i].key.name,
            node: properties[i]
          });
        }
        break;
      default:
        break;
    }

    componentList.set(context, node, {
      usedPropTypes: usedPropTypes
    });
  }

  /**
   * Mark a prop type as declared
   * @param {ASTNode} node The AST node being checked.
   * @param {propTypes} node The AST node containing the proptypes
   */
  function markPropTypesAsDeclared(node, propTypes) {
    var component = componentList.getByNode(context, node);
    var declaredPropTypes = component && component.declaredPropTypes || [];
    var ignorePropsValidation = false;

    switch (propTypes.type) {
      case 'ObjectExpression':
        for (var i = 0, j = propTypes.properties.length; i < j; i++) {
          var key = propTypes.properties[i].key;
          declaredPropTypes.push(key.type === 'Identifier' ? key.name : key.value);
        }
        break;
      case 'MemberExpression':
        declaredPropTypes.push(propTypes.property.name);
        break;
      default:
        ignorePropsValidation = true;
        break;
    }

    componentList.set(context, node, {
      declaredPropTypes: declaredPropTypes,
      ignorePropsValidation: ignorePropsValidation
    });

  }

  /**
   * Reports undeclared proptypes for a given component
   * @param {Object} component The component to process
   */
  function reportUndeclaredPropTypes(component) {
    var name;
    for (var i = 0, j = component.usedPropTypes.length; i < j; i++) {
      name = component.usedPropTypes[i].name;
      if (isDeclaredInComponent(component, name) || isIgnored(name)) {
        continue;
      }
      context.report(
        component.usedPropTypes[i].node,
        component.name === componentUtil.DEFAULT_COMPONENT_NAME ? MISSING_MESSAGE : MISSING_MESSAGE_NAMED_COMP, {
          name: name,
          component: component.name
        }
      );
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    ClassProperty: function(node) {
      if (!isPropTypesDeclaration(node)) {
        return;
      }

      markPropTypesAsDeclared(node, node.value);
    },

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
          var component = componentList.getByName(node.object.name);
          if (!component) {
            return;
          }
          markPropTypesAsDeclared(component.node, node.parent.right || node.parent);
          break;
        default:
          break;
      }
    },

    MethodDefinition: function(node) {
      if (!isPropTypesDeclaration(node.key)) {
        return;
      }

      var i = node.value.body.body.length - 1;
      for (; i >= 0; i--) {
        if (node.value.body.body[i].type === 'ReturnStatement') {
          break;
        }
      }

      markPropTypesAsDeclared(node, node.value.body.body[i].argument);
    },

    ObjectExpression: function(node) {
      // Search for the displayName declaration
      node.properties.forEach(function(property) {
        if (!isPropTypesDeclaration(property.key)) {
          return;
        }
        markPropTypesAsDeclared(node, property.value);
      });
    },

    'Program:exit': function() {
      var list = componentList.getList();
      // Report undeclared proptypes for all classes
      for (var component in list) {
        if (!list.hasOwnProperty(component) || !mustBeValidated(list[component])) {
          continue;
        }
        reportUndeclaredPropTypes(list[component]);
      }
    },

    ReturnStatement: function(node) {
      if (!componentUtil.isReactComponent(context, node)) {
        return;
      }
      componentList.set(context, node, {
        isReactComponent: true
      });
    }
  };

};
