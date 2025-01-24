'use strict';

function getSourceCode(context) {
  return context.getSourceCode?.() ?? context.sourceCode;
}

function getAncestors(context, node) {
  return getSourceCode(context).getAncestors?.(node) ?? context.getAncestors();
}

function getScope(context, node) {
  return getSourceCode(context).getScope?.(node) ?? context.getScope();
}

function markVariableAsUsed(name, node, context) {
  return getSourceCode(context).markVariableAsUsed?.(name, node) ?? context.markVariableAsUsed(name);
}

function getFirstTokens(context, node, count) {
  return getSourceCode(context).getFirstTokens?.(node, count) ?? context.getFirstTokens(node, count);
}

function getText(context, arg) {
  return getSourceCode(context).getText?.(arg) ?? context.getSource(arg);
}

module.exports = {
  getAncestors,
  getFirstTokens,
  getScope,
  getSourceCode,
  getText,
  markVariableAsUsed,
};
