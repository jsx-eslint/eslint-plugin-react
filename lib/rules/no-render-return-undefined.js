/**
 * @fileoverview Prevent returning undefined from react components
 * @author Akul Srivastava
 */

'use strict';

const astUtil = require('../util/ast');
const docsUrl = require('../util/docsUrl');
const isFirstLetterCapitalized = require('../util/isFirstLetterCapitalized');
const report = require('../util/report');
const variableUtil = require('../util/variable');

const messages = {
  returnsUndefined: "Don't return `undefined` from react components",
};

function getReturnValue(context, returnNode) {
  const variables = variableUtil.variablesInScope(context, returnNode);
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

  switch (returnNode.type) {
    case 'LogicalExpression': {
      return getReturnValue(context, returnNode.right);
    }
    case 'ConditionalExpression': {
      const possibleReturnValue = [
        getReturnValue(context, returnNode.consequent),
        getReturnValue(context, returnNode.alternate),
      ];
      const returnsUndefined = possibleReturnValue.some((val) => typeof val === 'undefined');
      if (returnsUndefined) return;
      return possibleReturnValue;
    }
    case 'CallExpression': {
      if (returnNode.callee.type === 'MemberExpression') {
        const calleeObjName = returnNode.callee.object.name;
        const calleePropertyName = returnNode.callee.property.name;
        const calleeObjNode = variables.find((item) => item && item.name === calleeObjName);
        const isCalleeObjArray = calleeObjNode.defs[0].node.init.type === 'ArrayExpression';
        const isMapCall = isCalleeObjArray && calleePropertyName === 'map';
        if (isMapCall) {
          const mapCallback = returnNode.arguments[0];
          const mapReturnStatement = mapCallback.body.type === 'BlockStatement'
              && astUtil.findReturnStatement(returnNode.arguments[0]);
          const mapReturnNode = (mapReturnStatement && mapReturnStatement.argument) || mapCallback.body;
          // console.log('DEBUG', mapReturnNode);
          return getReturnValue(context, mapReturnNode);
        }
      }
      const calleeName = returnNode.callee.name;
      const calleeNode = variables.find((item) => item && item.name === calleeName);
      const calleeDefinitionNode = calleeNode && calleeNode.defs && calleeNode.defs[0] && calleeNode.defs[0].node;
      const calleeReturnStatement = astUtil.findReturnStatement(calleeDefinitionNode);
      const calleeReturnNode = (calleeReturnStatement && calleeReturnStatement.argument)
        || (calleeDefinitionNode.init && calleeDefinitionNode.init.body);
      return getReturnValue(context, calleeReturnNode);
    }
    case 'ArrayExpression': {
      return returnNode.elements;
    }
    case 'JSXElement': {
      return returnNode;
    }
    default:
      return returnNode.value;
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow returning `undefined` from react components',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-render-return-undefined'),
    },
    messages,
    schema: [],
  },

  create(context) {
    const isReturningUndefined = (returnStatement) => {
      const returnNode = returnStatement && returnStatement.argument;
      const returnIdentifierName = returnNode && returnNode.name;

      const returnIdentifierValue = getReturnValue(context, returnNode);

      const returnsArrayHavingUndefined = Array.isArray(returnIdentifierValue)
          && returnIdentifierValue.some((el) => el && el.type === 'Identifier' && el.name === 'undefined');

      return !returnStatement
          || returnIdentifierName === 'undefined'
          || typeof returnIdentifierValue === 'undefined'
          || (returnIdentifierValue && returnIdentifierValue.name === 'undefined')
          || returnsArrayHavingUndefined;
    };

    const handleFunctionalComponents = (node) => {
      const fnName = (node.id && node.id.name) || (node.parent.id && node.parent.id.name);

      // Considering functions starting with Uppercase letters are react components
      const isReactComponent = isFirstLetterCapitalized(fnName);
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
