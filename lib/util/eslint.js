function getSourceCode(context) {
  return context.sourceCode ?? context.getSourceCode();
}

function getScope(node, context) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();
}

function getAncestors(node, context) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getAncestors ? sourceCode.getAncestors(node) : context.getAncestors();
}

function markVariableAsUsed(name, node, context) {
  const sourceCode = getSourceCode(context);
  return sourceCode.markVariableAsUsed
    ? sourceCode.markVariableAsUsed(name, node)
    : context.markVariableAsUsed(name);
}

module.exports = {
  getSourceCode,
  getScope,
  getAncestors,
  markVariableAsUsed,
};
