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
    function getReturnValue(returnNode) {
      const variables = variableUtil.variablesInScope(context);
      const returnIdentifierName = returnNode && returnNode.name;
      const returnIdentifierVar = variableUtil.getVariable(
        variables,
        returnIdentifierName
      );

      if (!returnNode) return undefined;

      if (
        returnIdentifierVar
        && returnIdentifierVar.defs
        && returnIdentifierVar.defs[0]
      ) {
        const value = returnIdentifierVar.defs[0].node.init;
        if (
          returnIdentifierVar.defs[0].node
          && returnIdentifierVar.defs[0].node.type === 'VariableDeclarator'
          && value === null
        ) {
          return undefined;
        }
        return value;
      }

      if (returnNode.type === 'ConditionalExpression') {
        const possibleReturnValue = [getReturnValue(returnNode.consequent), getReturnValue(returnNode.alternate)];
        const returnsUndefined = possibleReturnValue.some((val) => val === undefined);
        if (returnsUndefined) return undefined;
        return possibleReturnValue;
      }

      if (returnNode.type === 'CallExpression') {
        const calleeName = returnNode.callee.name;
        const calleeNode = variableUtil.variablesInScope(context).find((item) => item.name === calleeName);
        const calleeDefinitionNode = calleeNode && calleeNode.defs && calleeNode.defs[0] && calleeNode.defs[0].node;
        const calleeReturnStatement = astUtil.findReturnStatement(calleeDefinitionNode);
        const calleeReturnNode = (calleeReturnStatement && calleeReturnStatement.argument)
          || (calleeDefinitionNode.init && calleeDefinitionNode.init.body);
        return getReturnValue(calleeReturnNode);
      }

      if (returnNode.type === 'ArrayExpression') {
        return returnNode.elements;
      }

      if (returnNode.type === 'JSXElement') {
        return returnNode;
      }

      return returnNode.value;
    }

    const isReturningUndefined = (returnStatement) => {
      const returnNode = returnStatement && returnStatement.argument;
      const returnIdentifierName = returnNode && returnNode.name;

      const returnIdentifierValue = getReturnValue(returnNode);

      const returnsArrayHavingUndefined = Array.isArray(returnIdentifierValue)
          && returnIdentifierValue.some((el) => el && el.type === 'Identifier' && el.name === 'undefined');

      return !returnStatement
          || returnIdentifierName === 'undefined'
          || returnIdentifierValue === undefined
          || (returnIdentifierValue && returnIdentifierValue.name === 'undefined')
          || returnsArrayHavingUndefined;
    };

    const handleFunctionalComponents = (node) => {
      const fnName = (node.id && node.id.name) || node.parent.id.name;

      // Considering functions starting with Uppercase letters are react components
      const isReactComponent = fnName[0] === fnName[0].toUpperCase();
      const returnStatement = astUtil.findReturnStatement(node);

      if (!isReactComponent) return;

      if (isReturningUndefined(returnStatement)) {
        report(context, messages.returnsUndefined, 'returnsUndefined', {
          node,
        });
      }
    };

    const handleClassComponents = (node) => {
      const componentProperties = astUtil.getComponentProperties(node);
      const renderFnNode = componentProperties.find((prop) => prop.key.name === 'render');
      const returnStatement = astUtil.findReturnStatement(renderFnNode);

      if (isReturningUndefined(returnStatement)) {
        report(context, messages.returnsUndefined, 'returnsUndefined', {
          node,
        });
      }
    };

    return {
      FunctionDeclaration: handleFunctionalComponents,
      ArrowFunctionExpression: handleFunctionalComponents,
      ClassDeclaration: handleClassComponents,
      ClassExpression: handleClassComponents,
    };
  },
};
