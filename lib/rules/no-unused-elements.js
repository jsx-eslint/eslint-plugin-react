/**
 * @fileoverview Disallow unused React elements
 * @author Duncan Beevers
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const NO_UNUSED_ELEMENTS_MESSAGE = 'noUnusedElements';

function isUnusedElement(node) {
  const isChildOfExpressionStatement = (
    node.parent.type === 'ExpressionStatement'
  );

  if (isChildOfExpressionStatement) {
    return true;
  }

  const isChildOfConditionalExpressionStatement = (
    node.parent.type === 'ConditionalExpression'
    && node.parent.parent
    && node.parent.parent.type === 'ExpressionStatement'
  );

  if (isChildOfConditionalExpressionStatement) {
    return true;
  }

  return false;
}

module.exports = {
  meta: {
    docs: {
      description: 'Disallow unused React elements',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-unused-elements')
    },
    messages: {
      [NO_UNUSED_ELEMENTS_MESSAGE]: 'Unused React element'
    },
    schema: [{
      type: 'object',
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components, utils) => ({
    JSXElement(node) {
      if (isUnusedElement(node)) {
        context.report({
          node,
          messageId: NO_UNUSED_ELEMENTS_MESSAGE
        });
      }
    },
    CallExpression(node) {
      if (utils.isCreateElement(node) && isUnusedElement(node)) {
        context.report({
          node,
          messageId: NO_UNUSED_ELEMENTS_MESSAGE
        });
      }
    }
  })
  )
};
