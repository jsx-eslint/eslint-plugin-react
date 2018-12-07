/**
 * @fileoverview Prevent accidentally rendering zeroes by checking .length truthiness
 * @author Carl Mäsak & David Waller
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const jsxUtils = require('../util/jsx');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const message = 'Don\'t check .length truthiness in JSX, might render 0';

function findDangerousLengthMember(node) {
  if (node.type === 'MemberExpression' && node.property.name === 'length') {
    return node;
  }
  if (node.type === 'LogicalExpression') {
    // we're interested in right side of OR:s and both side of AND:s
    return (
      findDangerousLengthMember(node.right) ||
      (node.operator === '&&' && findDangerousLengthMember(node.left))
    );
  }
  return null;
}

module.exports = {
  meta: {
    docs: {
      description: 'Prevent checking .length truthiness in JSX',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('jsx-no-length-truthiness')
    },
    schema: [],
    fixable: true
  },

  create: context => ({
    LogicalExpression(node) {
      // We're only interested in AND:s, where we'll check for guards to the left
      if (node.operator !== '&&') {
        return;
      }
      // We know we're "rendering" if right side is JSX or we're inside JSX expression
      if (
        !jsxUtils.isJSX(node.right) &&
        node.parent.type !== 'JSXExpressionContainer'
      ) {
        return;
      }
      // If left side doesn't check truthiness of .length then all is well
      const dangerousLengthMember = findDangerousLengthMember(node.left);
      if (!dangerousLengthMember) {
        return;
      }
      context.report({
        node,
        message,
        fix(fixer) {
          return fixer.insertTextAfter(dangerousLengthMember, ' > 0');
        }
      });
    }
  })
};
