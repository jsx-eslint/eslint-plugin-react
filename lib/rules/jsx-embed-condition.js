/**
 * @fileoverview Prevents usage of && condition in JSX Embeds.
 * @author Anees Iqbal <i@steelbrain.me>
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents usage of && condition in JSX embed',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-embed-condition')
    },

    schema: []
  },

  create(context) {
    return {
      JSXExpressionContainer(node) {
        if (
          node.parent == null
          || node.parent.type !== 'JSXElement'
          || node.expression == null
          || node.expression.type !== 'LogicalExpression'
          || node.expression.operator === '??'
        ) {
          return;
        }
        context.report({
          node,
          message: 'Using && to condition JSX embeds is forbidden. Convert it to a ternary operation instead'
        });
      }
    };
  }
};
