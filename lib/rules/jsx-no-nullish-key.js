/**
 * @fileoverview Warn against literal `null` or `undefined` as JSX `key` prop values
 * @author Maximilien Tirard
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  nullishKey: 'Avoid using literal `{{value}}` as a `key` prop. Use a stable, unique identifier instead.',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow literal `null` or `undefined` as `key` prop values',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('jsx-no-nullish-key'),
    },

    messages,

    schema: [],
  },

  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'key') {
          return;
        }

        const value = node.value;
        if (!value || value.type !== 'JSXExpressionContainer') {
          return;
        }

        const expr = value.expression;
        const isNull = expr.type === 'Literal' && expr.value === null;
        const isUndefined = expr.type === 'Identifier' && expr.name === 'undefined';

        if (isNull || isUndefined) {
          report(context, messages.nullishKey, 'nullishKey', {
            node,
            data: { value: isNull ? 'null' : 'undefined' },
          });
        }
      },
    };
  },
};
