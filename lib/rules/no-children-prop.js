/**
 * @fileoverview Prevent passing of children as props
 * @author Benjamin Stepp
 */
'use strict';

const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const pragmaUtil = require('../util/pragma');

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Checks if the node is a jsxPragma call with a props literal.
 * @param {ASTNode} node - The AST node being checked.
 * @returns {Boolean} - True if node is a createElement call with a props
 * object literal, False if not.
*/
function isJsxPragmaWithProps(node, context) {
  const jsxPragma = pragmaUtil.getJsxFromContext(context);

  if (!node.callee) {
    return false;
  }

  if (node.arguments.length < 2) {
    return false;
  }

  if (node.arguments[1].type !== 'ObjectExpression') {
    return false;
  }

  return astUtil.isMemberExpressionPrintedTo(node.callee, jsxPragma);
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent passing of children as props.',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-children-prop')
    },
    schema: []
  },
  create: function(context) {
    return {
      JSXAttribute: function(node) {
        if (node.name.name !== 'children') {
          return;
        }

        context.report({
          node: node,
          message: 'Do not pass children as props. Instead, nest children between the opening and closing tags.'
        });
      },
      CallExpression: function(node) {
        if (!isJsxPragmaWithProps(node, context)) {
          return;
        }

        const props = node.arguments[1].properties;
        const childrenProp = props.find(prop => prop.key && prop.key.name === 'children');

        if (childrenProp) {
          context.report({
            node: node,
            message: 'Do not pass children as props. Instead, pass them as additional arguments to React.createElement.'
          });
        }
      }
    };
  }
};
