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
  suggestAsyncNamed: 'Make {{functionName}} an `async` function',
  suggestAsyncAnon: 'Make this function `async`',
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
        const parent = currentFunction.parent;
        const isMethod = parent.type === 'MethodDefinition' || (parent.type === 'Property' && parent.method);

        let name;
        if (currentFunction.id) {
          name = currentFunction.id.name;
        } else if (isMethod && parent.key && parent.key.type === 'Identifier') {
          name = parent.key.name;
        }

        const suggestMessage = name ? messages.suggestAsyncNamed : messages.suggestAsyncAnon;
        const data = name ? { functionName: `\`${name}\`` } : {};
        report(context, messages.asyncServerAction, 'asyncServerAction', {
          node: currentFunction,
          data,
          suggest: [{
            desc: suggestMessage,
            data,
            fix(fixer) {
              if (isMethod) {
                return fixer.insertTextBefore(parent.key, 'async ');
              }
              return fixer.insertTextBefore(currentFunction, 'async ');
            },
          }],
        });
      },
    };
  },
};
