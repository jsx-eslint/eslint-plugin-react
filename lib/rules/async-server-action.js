/**
 * @fileoverview Require functions with the `use server` directive to be async
 * @author Jorge Zreik
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  asyncServerAction: 'Server Actions must be async',
  suggestAsync: 'Make {{functionName}} async',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Require functions with the `use server` directive to be async',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('async-server-action'),
    },

    messages,

    type: 'suggestion',
    hasSuggestions: true,

    schema: [],
  },

  create(context) {
    return {
      ':function[async=false][generator=false]>BlockStatement>:first-child[expression.value="use server"]'(node) {
        const currentFunction = node.parent.parent;
        const functionName = currentFunction.id ? `\`${currentFunction.id.name}\`` : 'this function';

        const data = { functionName };
        report(context, messages.asyncServerAction, 'asyncServerAction', {
          node: currentFunction,
          data,
          suggest: [{
            desc: messages.suggestAsync,
            data,
            fix(fixer) {
              return fixer.insertTextBefore(currentFunction, 'async ');
            },
          }],
        });
      },
    };
  },
};
