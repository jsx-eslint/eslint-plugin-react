/**
 * @fileoverview Enforce propTypes declarations alphabetical sorting
 */
'use strict';

const variableUtil = require('../util/variable');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce propTypes declarations alphabetical sorting',
      category: 'Stylistic Issues',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        requiredFirst: {
          type: 'boolean'
        },
        callbacksLast: {
          type: 'boolean'
        },
        ignoreCase: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {
    const sourceCode = context.getSourceCode();
    const configuration = context.options[0] || {};
    const requiredFirst = configuration.requiredFirst || false;
    const callbacksLast = configuration.callbacksLast || false;
    const ignoreCase = configuration.ignoreCase || false;
    const propWrapperFunctions = new Set(context.settings.propWrapperFunctions || []);

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
        return (tokens[0] && tokens[0].value === 'propTypes') ||
               (tokens[1] && tokens[1].value === 'propTypes');
      }

      return Boolean(
        node &&
        node.name === 'propTypes'
      );
    }

    function getKey(node) {
      return sourceCode.getText(node.key || node.argument);
    }

    function getValueName(node) {
      return node.type === 'Property' && node.value.property && node.value.property.name;
    }

    function isCallbackPropName(propName) {
      return /^on[A-Z]/.test(propName);
    }

    function isRequiredProp(node) {
      return getValueName(node) === 'isRequired';
    }

    /**
     * Checks if propTypes declarations are sorted
     * @param {Array} declarations The array of AST nodes being checked.
     * @returns {void}
     */
    function checkSorted(declarations) {
      declarations.reduce((prev, curr, idx, decls) => {
        if (/SpreadProperty$/.test(curr.type)) {
          return decls[idx + 1];
        }

        let prevPropName = getKey(prev);
        let currentPropName = getKey(curr);
        const previousIsRequired = isRequiredProp(prev);
        const currentIsRequired = isRequiredProp(curr);
        const previousIsCallback = isCallbackPropName(prevPropName);
        const currentIsCallback = isCallbackPropName(currentPropName);

        if (ignoreCase) {
          prevPropName = prevPropName.toLowerCase();
          currentPropName = currentPropName.toLowerCase();
        }

        if (requiredFirst) {
          if (previousIsRequired && !currentIsRequired) {
            // Transition between required and non-required. Don't compare for alphabetical.
            return curr;
          }
          if (!previousIsRequired && currentIsRequired) {
            // Encountered a non-required prop after a required prop
            context.report({
              node: curr,
              message: 'Required prop types must be listed before all other prop types'
            });
            return curr;
          }
        }

        if (callbacksLast) {
          if (!previousIsCallback && currentIsCallback) {
            // Entering the callback prop section
            return curr;
          }
          if (previousIsCallback && !currentIsCallback) {
            // Encountered a non-callback prop after a callback prop
            context.report({
              node: prev,
              message: 'Callback prop types must be listed after all other prop types'
            });
            return prev;
          }
        }

        if (currentPropName < prevPropName) {
          context.report({
            node: curr,
            message: 'Prop types declarations should be sorted alphabetically'
          });
          return prev;
        }

        return curr;
      }, declarations[0]);
    }

    return {
      ClassProperty: function(node) {
        if (!isPropTypesDeclaration(node)) {
          return;
        }
        switch (node.value && node.value.type) {
          case 'ObjectExpression':
            checkSorted(node.value.properties);
            break;
          case 'CallExpression':
            if (
              propWrapperFunctions.has(node.value.callee.name) &&
              node.value.arguments && node.value.arguments[0]
            ) {
              checkSorted(node.value.arguments[0].properties);
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
        let declarations;
        switch (right && right.type) {
          case 'CallExpression':
            if (
              propWrapperFunctions.has(right.callee.name) &&
              right.arguments && right.arguments[0]
            ) {
              declarations = right.arguments[0].properties;
            }
            break;
          case 'ObjectExpression':
            declarations = right.properties;
            break;
          case 'Identifier':
            const variable = variableUtil.variablesInScope(context).find(item => item.name === right.name);
            if (
              !variable || !variable.defs[0] ||
              !variable.defs[0].node.init || !variable.defs[0].node.init.properties
            ) {
              break;
            }
            declarations = variable.defs[0].node.init.properties;
            break;
          default:
            break;
        }
        if (declarations) {
          checkSorted(declarations);
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
            checkSorted(property.value.properties);
          }
        });
      }

    };
  }
};
