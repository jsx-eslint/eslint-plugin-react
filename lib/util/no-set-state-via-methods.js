/**
 * @fileoverview Prevent usage of findDOMNode
 * @author Valentin Agachi
 */

'use strict';

function getCalleeName(node) {
  if (!node.callee) {
    return null;
  }
  var callee = node.callee;
  if (
    callee.type !== 'MemberExpression' ||
    (
      callee.object.type !== 'ThisExpression' &&
      callee.object.type !== 'Identifier'
    ) ||
    callee.property.type !== 'Identifier'
  ) {
    return null;
  }

  var obj = callee.object.type === 'ThisExpression'
    ? 'this'
    : callee.object.name;
  var prop = callee.property.name;

  return obj + '.' + prop;
}

function isMethodDefinition(node) {
  return (
    node.type === 'MethodDefinition' &&
    node.kind === 'method' &&
    !node.static
  );
}
function isObjectPropertyMethod(node) {
  return (
    node.type === 'Property' &&
    node.method
  );
}

function functionExpressionCallsExpression(node, methodName) {
  var verifyBodyNode = function(bodyNode) {
    switch (bodyNode.type) {
      case 'ExpressionStatement':
        if (bodyNode.expression.type === 'CallExpression') {
          return getCalleeName(bodyNode.expression) === 'this.' + methodName;
        }
        break;
      case 'IfStatement':
        return (
          bodyNode.consequent.body.some(verifyBodyNode) ||
          (bodyNode.alternate && bodyNode.alternate.body.some(verifyBodyNode))
        );
      default:
        return false;
    }
    return false;
  };

  return node.value.body.body.some(verifyBodyNode);
}

function lifecycleCallsMethod(lifecycleMethod, methodName) {
  return function(node) {
    var isLifecycleMethod = (
      (
        isMethodDefinition(node) ||
        isObjectPropertyMethod(node)
      ) &&
      node.key.name === lifecycleMethod
    );
    return isLifecycleMethod &&
      functionExpressionCallsExpression(node, methodName);
  };
}

module.exports = {
  run: function(lifecycleMethod, callee, ancestors, context, components, utils) {
    var method;
    var methodName;

    var es6Class = utils.getParentES6Component();
    if (es6Class) {
      method = ancestors.find(isMethodDefinition);
      methodName = method.key.name;
      var classBody = es6Class.body.body;
      // Loop through all the component's methods to find componentDidUpdate
      // and search for call expressions of `methodName`
      if (classBody.some(lifecycleCallsMethod(lifecycleMethod, methodName))) {
        context.report({
          node: callee,
          message: 'Do not use `setState` in other methods called in `' + lifecycleMethod + '`'
        });
      }
      return;
    }

    var es5Class = utils.getParentES5Component();
    if (es5Class) {
      method = ancestors.find(isObjectPropertyMethod);
      methodName = method.key.name;
      // Loop through all the component's methods to find componentDidUpdate
      // and search for call expressions of `methodName`
      var classProperties = es5Class.properties;
      if (classProperties.some(lifecycleCallsMethod(lifecycleMethod, methodName))) {
        context.report({
          node: callee,
          message: 'Do not use `setState` in other methods called in `' + lifecycleMethod + '`'
        });
      }
      return;
    }
  }
};
