/**
 * @fileoverview Forbid certain propTypes
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var DEFAULTS = ['any', 'array', 'object'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  function isForbidden(type) {
    var configuration = context.options[0] || {};

    var forbid = configuration.forbid || DEFAULTS;
    return forbid.indexOf(type) >= 0;
  }

  /**
   * Checks if node is `propTypes` declaration
   * @param {ASTNode} node The AST node being checked.
   * @returns {Boolean} True if node is `propTypes` declaration, false if not.
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
   * Checks if propTypes declarations are forbidden
   * @param {Array} declarations The array of AST nodes being checked.
   * @returns {void}
   */
  function checkForbidden(declarations) {
    declarations.forEach(function(declaration) {
      if (
        declaration.value.type === 'MemberExpression' &&
        declaration.value.property &&
        declaration.value.property.name &&
        declaration.value.property.name === 'isRequired'
      ) {
        declaration.value = declaration.value.object;
      }
      if (
        declaration.value.type === 'CallExpression' &&
        declaration.value.callee.type === 'MemberExpression'
      ) {
        declaration.value = declaration.value.callee;
      }

      if (isForbidden(declaration.value.property.name)) {
        context.report(declaration, 'Prop type `' + declaration.value.property.name + '` is forbidden');
      }
    });
  }

  return {
    ClassProperty: function(node) {
      if (isPropTypesDeclaration(node) && node.value && node.value.type === 'ObjectExpression') {
        checkForbidden(node.value.properties);
      }
    },

    MemberExpression: function(node) {
      if (isPropTypesDeclaration(node.property)) {
        var right = node.parent.right;
        if (right && right.type === 'ObjectExpression') {
          checkForbidden(right.properties);
        }
      }
    },

    ObjectExpression: function(node) {
      node.properties.forEach(function(property) {
        if (!property.key) {
          return;
        }

        if (!isPropTypesDeclaration(property.key)) {
          return;
        }
        if (property.value.type === 'ObjectExpression') {
          checkForbidden(property.value.properties);
        }
      });
    }

  };
};

module.exports.schema = [{
  type: 'object',
  properties: {
    forbid: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  additionalProperties: true
}];
