/**
 * @fileoverview Enforce props of functional components to be sorted alphabetically
 * @author IRoninCoder
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'Enforce props of functional components to be sorted alphabetically',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-sort-functional-props')
    },

    schema: [
      {
        type: 'object',
        properties: {
          ignoreCase: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const configuration = context.options[0] || {};
    const ignoreCase = configuration.ignoreCase || false;

    function getKey(node) {
      return context.getSourceCode().getText(node.key || node.argument);
    }

    /**
     * Checks if spread prop declarations are sorted
     * @param {Array} properties The array of AST nodes being checked.
     * @returns {void}
     */
    function checkSorted(properties) {
      properties.reduce((prev, curr) => {
        let prevPropName = getKey(prev);
        let currentPropName = getKey(curr);

        if (ignoreCase) {
          prevPropName = prevPropName.toLowerCase();
          currentPropName = currentPropName.toLowerCase();
        }

        if (currentPropName < prevPropName) {
          context.report({
            node: curr,
            message:
              'Functional component prop declarations should be sorted alphabetically'
          });

          return prev;
        }

        return curr;
      }, properties[0]);
    }

    function checkNode(node) {
      switch (node && node.type) {
        case 'FunctionDeclaration': {
          // only match a `function Something ({ one, two })` pattern.
          if (
            node.id.name[0] === node.id.name[0].toUpperCase()
            && node.params.length === 1
            && node.params[0].type === 'ObjectPattern'
          ) {
            checkSorted(node.params[0].properties);
          }
          break;
        }
        case 'VariableDeclaration': {
          // only match a `var/const/let Something = ({ one, two }) =>` pattern
          if (
            node.declarations.length === 1
            && node.declarations[0].type === 'VariableDeclarator'
            && node.declarations[0].id.name[0] === node.declarations[0].id.name[0].toUpperCase()
            && node.declarations[0].init
            && node.declarations[0].init.type === 'ArrowFunctionExpression'
            && node.declarations[0].init.params.length === 1
            && node.declarations[0].init.params[0].type === 'ObjectPattern'
          ) {
            checkSorted(node.declarations[0].init.params[0].properties);
          }
          break;
        }
        default:
          break;
      }
    }

    // --------------------------------------------------------------------------
    // Public API
    // --------------------------------------------------------------------------

    return {
      VariableDeclaration(node) {
        checkNode(node);
      },
      FunctionDeclaration(node) {
        checkNode(node);
      }
    };
  }
};
