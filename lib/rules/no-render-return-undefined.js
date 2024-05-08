/**
 * @fileoverview Prevent returning undefined from react components
 * @author Akul Srivastava
 */

'use strict';

const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const variableUtil = require('../util/variable');

const messages = {
  returnsUndefined: "Don't return undefined from react components",
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow returning undefined from react components',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-render-return-undefined'),
    },
    messages,
    schema: [],
  },

  create(context) {
    const handleFunctionalComponents = (node) => {
      const fnName = (node.id && node.id.name) || node.parent.id.name;
      const isReactComponent = fnName[0] === fnName[0].toUpperCase();
      const returnStatement = astUtil.findReturnStatement(node);

      if (!isReactComponent) return;

      const variables = variableUtil.variablesInScope(context);
      const returnNode = returnStatement && returnStatement.argument;
      const returnIdentifierName = returnNode && returnNode.name;
      const returnIdentifierVar = variableUtil.getVariable(
        variables,
        returnIdentifierName
      );
      const returnIdentifierValue = (() => {
        if (!returnNode) return undefined;
        if (
          returnIdentifierVar
          && returnIdentifierVar.defs
          && returnIdentifierVar.defs[0]
        ) {
          const value = returnIdentifierVar.defs[0].node.init;
          if (
            returnIdentifierVar.defs[0].node.type === 'VariableDeclarator'
            && value === null
          ) {
            return undefined;
          }
          return value;
        }

        if (returnNode.type === 'ArrayExpression') {
          return returnNode.elements;
        }

        if (returnNode.type === 'JSXElement') {
          return returnNode;
        }

        return returnNode.value;
      })();

      const returnsArrayHavingUndefined = Array.isArray(returnIdentifierValue)
          && returnIdentifierValue.some((el) => el.type === 'Identifier' && el.name === 'undefined');

      if (
        !returnStatement
        || returnIdentifierName === 'undefined'
        || returnIdentifierValue === undefined
        || (returnIdentifierValue && returnIdentifierValue.name === 'undefined')
        || returnsArrayHavingUndefined
      ) {
        report(context, messages.returnsUndefined, 'returnsUndefined', {
          node,
        });
      }
    };

    return {
      FunctionDeclaration: handleFunctionalComponents,
      ArrowFunctionExpression: handleFunctionalComponents,
    };
  },
};
