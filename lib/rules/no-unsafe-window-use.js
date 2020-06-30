/**
 * @fileoverview Rule to avoid unsafe global window use
 * @author Johnny Zabala
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

function isMethod(node) {
  return node.type === 'Property'
    || node.type === 'MethodDefinition'
    || node.type === 'ClassProperty';
}

function isAllowedLifecycle(node) {
  return ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount'].includes(node.key.name);
}

function isAllowedHook(node) {
  return (node.type === 'CallExpression')
  && ['useEffect', 'useLayoutEffect'].includes(node.callee.name);
}

// guard: typeof window !== 'undefined'
function isGuard(node) {
  return node.type === 'BinaryExpression'
    && ['!==', '!='].includes(node.operator)
    && node.left.type === 'UnaryExpression'
    && node.left.operator === 'typeof'
    && node.right.type === 'Literal'
    && node.right.value === 'undefined';
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-unsafe-window-use')
    },
    messages: {
      unsafeWindowUse: 'Unsafe "window" use'
    }
  },
  create(context) {
    const methodsUsingWindow = [];
    let methodCalls = [];
    function report(node) {
      context.report({
        node,
        messageId: 'unsafeWindowUse'
      });
    }
    function isInsideSaveZone(node) {
      return context
        .getAncestors()
        .reverse()
        .some((ancestor, index, ancestors) => {
          // Is protected by conditional if or ternary
          if ((['IfStatement', 'ConditionalExpression'].includes(ancestor.type))
            // Check the node is the consequent of the guard
            && (ancestor.consequent === node || ancestor.consequent === ancestors[index - 1])
          ) {
            return isGuard(ancestor.test);
          }
          // Is protected by logical AND expression
          if (ancestor.type === 'LogicalExpression' && ancestor.operator === '&&') {
            return isGuard(ancestor.left);
          }

          if (isMethod(ancestor)) {
            // Store method and node to check later if part of call expression
            if (!isAllowedLifecycle(ancestor)) {
              methodsUsingWindow.push({instance: ancestor, node});
            }
            return true;
          }

          if (isAllowedHook(ancestor)) {
            return true;
          }

          return false;
        });
    }
    return {
      'Program:exit'() {
        // Check if methods using window called inside other methods
        methodsUsingWindow.some((method) => {
          if (methodCalls.length > 0) {
            const matchedMethodCalls = [];
            const unmatchedMethodCalls = [];
            // Check if method using window is one of the called methods
            methodCalls.forEach((methodCall) => {
              if (methodCall.callee.property.name === method.instance.key.name
                && methodCall.instance.parent === method.instance.parent
              ) {
                matchedMethodCalls.push(methodCall);
              } else {
                unmatchedMethodCalls.push(methodCall);
              }
            });
            if (matchedMethodCalls.length > 0) {
              report(method.node);
              methodCalls = unmatchedMethodCalls;
            }
            return false;
          }
          return true;
        });
      },
      Identifier(node) {
        if (
          node.name !== 'window'
          // is part of guard
          || isGuard(node.parent.parent)
          || isInsideSaveZone(node)
        ) {
          return;
        }
        report(node);
      },
      CallExpression(node) {
        const {callee} = node;
        if (callee.type === 'MemberExpression' && callee.object.type === 'ThisExpression') {
          const method = context.getAncestors().reverse().find(isMethod);
          if (method && !isAllowedLifecycle(method)) {
            methodCalls.push({
              instance: method,
              callee
            });
          }
        }
      }
    };
  }
};
