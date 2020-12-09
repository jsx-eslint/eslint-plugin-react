/**
 * @fileoverview Ensure symmetric naming of useState hook value and setter variables
 * @author Duncan Beevers
 */

'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

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
      useStateAsymmetric: 'setState variable names are not symmetric, setter should be {{expectedSetterVariableName}}',
      useStateBadPrefix: 'setState setter variable name should begin with set',
      useStateNotDestructured: 'setState call is not destructured into value + setter pair'
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
          context.report({node, messageId: 'useStateNotDestructured'});
          return;
        }

        const variableNodes = node.parent.id.elements;
        const valueVariable = variableNodes[0];
        const setterVariable = variableNodes[1];

        // Make sure the list destructured off of useState is sized just right.
        if (variableNodes.length > 2) {
          context.report({
            node: node.parent,
            messageId: 'useStateNotDestructured',
            fix(fixer) {
              // Set the trim locations, starting from the end of the setter
              // variable, and spanning to the end of final extraneous variable.
              return fixer.removeRange([
                setterVariable.range[1],
                (variableNodes[variableNodes.length - 1]).range[1]
              ]);
            }
          });

          // console.log(node.parent.id.elements);
          return;
        }

        const valueVariableName = valueVariable
          ? valueVariable.name
          : undefined;

        const setterVariableName = setterVariable
          ? setterVariable.name
          : undefined;

        if (valueVariableName) {
          const expectedSetterVariableName = (
            `set${
              valueVariableName.charAt(0).toUpperCase()
            }${valueVariableName.slice(1)}`
          );
          if (setterVariableName !== expectedSetterVariableName) {
            context.report({
              node: node.parent.id,
              messageId: 'useStateAsymmetric',
              data: {expectedSetterVariableName},
              fix(fixer) {
                return fixer.replaceText(
                  setterVariable,
                  expectedSetterVariableName
                );
              }
            });
          }
        } else if (!setterVariableName.match(/^set[A-Z]\w+/)) {
          context.report({
            node: node.parent,
            messageId: 'useStateBadPrefix'
          });
        }
      }
    };
  }
};
