/**
 * @fileoverview Enforce JSX inline conditional as a ternary
 * @author Kevin Ingersoll
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  inlineConditional: 'Conditional rendering in JSX should use a full ternary expression to avoid unintentionally rendering falsy values (i.e. zero)',
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce JSX inline conditional as a ternary',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-inline-conditional'),
    },
    fixable: 'code',
    messages,
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      JSXExpressionContainer(node) {
        if (
          node.expression.type === 'LogicalExpression'
          && node.expression.operator === '&&'
          && node.expression.right.type === 'JSXElement'
        ) {
          context.report({
            node,
            messageId: 'inlineConditional',
            fix: (fixer) => fixer.replaceText(
              node,
              `{${sourceCode.getText(
                node.expression.left
              )} ? ${sourceCode.getText(node.expression.right)} : null}`
            ),
          });
        }
      },
    };
  },
};
