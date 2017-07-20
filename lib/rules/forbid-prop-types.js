/**
 * @fileoverview Forbid certain propTypes
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DEFAULTS = ['any', 'array', 'object'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid certain propTypes',
      category: 'Best Practices',
      recommended: false
    },

    schema: [{
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
    }]
  },

  create: function(context) {
    const propWrapperFunctions = new Set(context.settings.propWrapperFunctions || []);

    function isForbidden(type) {
      const configuration = context.options[0] || {};

      const forbid = configuration.forbid || DEFAULTS;
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
        const tokens = context.getFirstTokens(node, 2);
        if (tokens[0].value === 'propTypes' || (tokens[1] && tokens[1].value === 'propTypes')) {
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
      declarations.forEach(declaration => {
        if (declaration.type !== 'Property') {
          return;
        }
        let target;
        let value = declaration.value;
        if (
          value.type === 'MemberExpression' &&
          value.property &&
          value.property.name &&
          value.property.name === 'isRequired'
        ) {
          value = value.object;
        }
        if (
          value.type === 'CallExpression' &&
          value.callee.type === 'MemberExpression'
        ) {
          value = value.callee;
        }
        if (value.property) {
          target = value.property.name;
        } else if (value.type === 'Identifier') {
          target = value.name;
        }
        if (isForbidden(target)) {
          context.report({
            node: declaration,
            message: `Prop type \`${target}\` is forbidden`
          });
        }
      });
    }

    return {
      ClassProperty: function(node) {
        if (!isPropTypesDeclaration(node)) {
          return;
        }
        switch (node.value && node.value.type) {
          case 'ObjectExpression':
            checkForbidden(node.value.properties);
            break;
          case 'CallExpression':
            if (
              propWrapperFunctions.has(node.value.callee.name) &&
              node.value.arguments && node.value.arguments[0]
            ) {
              checkForbidden(node.value.arguments[0].properties);
            }
            break;
          default:
            break;
        }
      },

      MemberExpression: function(node) {
        if (!isPropTypesDeclaration(node.property)) {
          return;
        }

        const right = node.parent.right;
        switch (right && right.type) {
          case 'ObjectExpression':
            checkForbidden(right.properties);
            break;
          case 'CallExpression':
            if (
              propWrapperFunctions.has(right.callee.name) &&
              right.arguments && right.arguments[0]
            ) {
              checkForbidden(right.arguments[0].properties);
            }
            break;
          default:
            break;
        }
      },

      ObjectExpression: function(node) {
        node.properties.forEach(property => {
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
  }
};
