/**
 * @fileoverview every addEventListener should have a matching removeEventListener in the return statement of the same useEffect block
 * @author AndreaPontrandolfo
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const messages = {
  requiredCleanup: 'Missing a cleanup function for the addEventListener.',
  requiredRemoveEventListener: 'Missing a matching removeEventListener.',
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforces that every addEventListener has a matching removeEventListener in the return statement of the same useEffect block',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('ensure-matching-remove-event-listener'),
    },
    messages,
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create: Components.detect((context) => ({
    ExpressionStatement(node) {
      let hasAddEventListener = null;
      let hasReturnStatement = null;
      let hasRemoveEventListener = null;
      const expression = node && node.expression;
      const calleeName = expression && expression.callee && expression.callee.name;
      if (calleeName === 'useEffect') {
        const internalExpressions = expression
            && expression.arguments
            && expression.arguments.length > 0
            && expression.arguments[0].body
            && expression.arguments[0].body.body;
        if (internalExpressions && internalExpressions.length > 0) {
          internalExpressions.every((element) => {
            if (hasRemoveEventListener) {
              return false;
            }
            const elementType = element.type;
            const internalExpression = element.expression;
            const internalExpressionCallee = internalExpression && internalExpression.callee;
            const internalExpressionCalleeProperty = internalExpressionCallee
                && internalExpressionCallee.property
                && internalExpressionCallee.property.name;
            if (internalExpressionCalleeProperty === 'addEventListener') {
              hasAddEventListener = true;
              return true;
            }
            if (hasAddEventListener) {
              if (elementType === 'ReturnStatement') {
                hasReturnStatement = true;
                const returnBlockBody = element.argument
                    && element.argument.body
                    && element.argument.body.body;
                if (returnBlockBody && returnBlockBody.length > 0) {
                  returnBlockBody.every((returnElement) => {
                    if (hasRemoveEventListener) {
                      return false;
                    }
                    const returnElementCallee = returnElement.expression
                        && returnElement.expression.callee;
                    const returnElementCalleeObject = returnElementCallee
                        && returnElementCallee.object
                        && returnElementCallee.object.name;
                    const returnElementCalleeProperty = returnElementCallee
                        && returnElementCallee.property
                        && returnElementCallee.property.name;
                    if (
                      returnElementCalleeObject === 'window'
                        && returnElementCalleeProperty === 'removeEventListener'
                    ) {
                      hasRemoveEventListener = true;
                    }
                    return true;
                  });
                }
              }
            }
            return true;
          });
        }
        if (hasAddEventListener) {
          if (!hasRemoveEventListener) {
            if (!hasReturnStatement) {
              const messageId = 'requiredCleanup';

              report(context, messages, messageId, {
                node,
              });
            } else {
              const messageId = 'requiredRemoveEventListener';

              report(context, messages, messageId, {
                node,
              });
            }
          }
        }
      }
    },
  })),
};
