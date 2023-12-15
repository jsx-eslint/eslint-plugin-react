/**
 * @fileoverview Require all forwardRef components include a ref parameter
 */

'use strict';

const isParenthesized = require('../util/ast').isParenthesized;
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const getMessageData = require('../util/message');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  missingRefParameter:
    'forwardRef is used with this component but no ref parameter is set',
  addRefParameter: 'Add a ref parameter',
  removeForwardRef: 'Remove forwardRef wrapper',
};

module.exports = {
  meta: {
    docs: {
      description: 'Require all forwardRef components include a ref parameter',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('forward-ref-uses-ref'),
    },
    messages,
    schema: [],
    type: 'suggestion',
    hasSuggestions: true,
  },

  create(context) {
    const sourceCode = context.sourceCode;
    /**
     * @param {ASTNode} node
     * @returns {boolean} If the node represents the identifier `forwardRef`.
     */
    function isForwardRefIdentifier(node) {
      return node.type === 'Identifier' && node.name === 'forwardRef';
    }

    /**
     * @param {ASTNode} node
     * @returns {boolean} If the node represents a function call `forwardRef()` or `React.forwardRef()`.
     */
    function isForwardRefCall(node) {
      return (
        node.type === 'CallExpression'
        && (isForwardRefIdentifier(node.callee)
          || (node.callee.type === 'MemberExpression'
            && isForwardRefIdentifier(node.callee.property)))
      );
    }

    return {
      'FunctionExpression, ArrowFunctionExpression'(node) {
        if (!isForwardRefCall(node.parent)) {
          return;
        }

        if (node.params.length === 1) {
          report(context, messages.missingRefParameter, 'missingRefParameter', {
            node,
            suggest: [
              Object.assign(
                getMessageData('addRefParameter', messages.addRefParameter),
                {
                  * fix(fixer) {
                    const param = node.params[0];
                    if (
                      node.type === 'ArrowFunctionExpression'
                      && !isParenthesized(context, param)
                    ) {
                      yield fixer.insertTextBefore(param, '(');
                      yield fixer.insertTextAfter(param, ')');
                    }

                    yield fixer.insertTextAfter(param, ', ref');
                  },
                }
              ),
              Object.assign(
                getMessageData('removeForwardRef', messages.removeForwardRef),
                {
                  fix: (fixer) => fixer.replaceText(node.parent, sourceCode.getText(node)),
                }
              ),
            ],
          });
        }
      },
    };
  },
};
