'use strict';

function getSourceCode(context) {
  return context.getSourceCode ? context.getSourceCode() : context.sourceCode;
}

function getFilename(context) {
  return typeof context.getFilename === 'function' ? context.getFilename() : context.filename;
}

function getAncestors(context, node) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getAncestors ? sourceCode.getAncestors(node) : context.getAncestors();
}

function getScope(context, node) {
  const sourceCode = getSourceCode(context);
  if (sourceCode.getScope) {
    return sourceCode.getScope(node);
  }

  return context.getScope();
}

function markVariableAsUsed(name, node, context) {
  const sourceCode = getSourceCode(context);
  return sourceCode.markVariableAsUsed
    ? sourceCode.markVariableAsUsed(name, node)
    : context.markVariableAsUsed(name);
}

function getFirstTokens(context, node, count) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getFirstTokens ? sourceCode.getFirstTokens(node, count) : context.getFirstTokens(node, count);
}

function getText(context) {
  const sourceCode = getSourceCode(context);
  const args = Array.prototype.slice.call(arguments, 1);
  return sourceCode.getText ? sourceCode.getText.apply(sourceCode, args) : context.getSource.apply(context, args);
}

function isSpaceBetween(sourceCode, first, second) {
  if (sourceCode.isSpaceBetweenTokens) {
    return sourceCode.isSpaceBetweenTokens(first, second);
  }
  if (sourceCode.isSpaceBetween(first, second)) {
    return true;
  }

  const nodesOrTokens = first.range[1] <= second.range[0] ? [first, second] : [second, first];
  return sourceCode.getTokensBetween(nodesOrTokens[0], nodesOrTokens[1]).some(
    (token) => token.type === 'JSXText' && /\s/u.test(token.value)
  );
}

module.exports = {
  getAncestors,
  getFilename,
  getFirstTokens,
  getScope,
  getSourceCode,
  getText,
  isSpaceBetween,
  markVariableAsUsed,
};
