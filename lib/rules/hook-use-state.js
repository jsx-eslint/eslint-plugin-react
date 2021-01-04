/**
 * @fileoverview Ensure symmetric naming of useState hook value and setter variables
 * @author Duncan Beevers
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const USE_STATE_ERROR_MESSAGE = 'useStateErrorMessage';

module.exports = {
  meta: {
    docs: {
      description: 'Ensure symmetric naming of useState hook value and setter variables',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('hook-use-state')
    },
    fixable: 'code',
    messages: {
      [USE_STATE_ERROR_MESSAGE]: 'setState call is not destructured into value + setter pair'
    },
    schema: [{
      type: 'object',
      additionalProperties: false
    }]
  },

  create(context) {
    return {
      CallExpression(node) {
        const isReactUseStateCall = (
          node.callee.type === 'MemberExpression'
          && node.callee.object.type === 'Identifier'
          && node.callee.object.name === 'React'
          && node.callee.property.type === 'Identifier'
          && node.callee.property.name === 'useState'
        );

        const isUseStateCall = (
          node.callee.type === 'Identifier'
          && node.callee.name === 'useState'
        );

        // Ignore unless this is a useState() or React.useState() call.
        if (!isReactUseStateCall && !isUseStateCall) {
          return;
        }

        const isDestructuringDeclarator = (
          node.parent.type === 'VariableDeclarator'
          && node.parent.id.type === 'ArrayPattern'
        );

        if (!isDestructuringDeclarator) {
          context.report({node, messageId: USE_STATE_ERROR_MESSAGE});
          return;
        }

        const variableNodes = node.parent.id.elements;
        const valueVariable = variableNodes[0];
        const setterVariable = variableNodes[1];

        const valueVariableName = valueVariable
          ? valueVariable.name
          : undefined;

        const setterVariableName = setterVariable
          ? setterVariable.name
          : undefined;

        const expectedSetterVariableName = valueVariableName ? (
          `set${
            valueVariableName.charAt(0).toUpperCase()
          }${valueVariableName.slice(1)}`
        ) : undefined;

        if (
          !valueVariable
          || !setterVariable
          || setterVariableName !== expectedSetterVariableName
          || variableNodes.length !== 2
        ) {
          context.report({
            node: node.parent.id,
            messageId: USE_STATE_ERROR_MESSAGE,
            fix: valueVariableName ? (fixer) => fixer.replaceTextRange(
              [node.parent.id.range[0], node.parent.id.range[1]],
              `[${valueVariableName}, ${expectedSetterVariableName}]`
            ) : undefined
          });
        }
      }
    };
  }
};
