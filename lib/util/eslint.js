'use strict';

function getSourceCode(context) {
  return context.getSourceCode ? context.getSourceCode() : context.sourceCode;
}

function getFilename(context) {
  return context.getFilename ? context.getFilename() : context.filename;
}

function getAncestors(context, node) {
  const sourceCode = getSourceCode(context);
  return sourceCode.getAncestors ? sourceCode.getAncestors(node) : context.getAncestors();
}

function getScope(context, node) {
  const sourceCode = getSourceCode(context);
  if (sourceCode.getScope && node) {
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

/**
 * Get the comments directly before a node or token, after the previous token
 * @param {Object} context The rule context
 * @param {ASTNode|Token} nodeOrToken The node or token to get the comments before
 * @returns {Array} The comments before the node or token
 */
function getCommentsBefore(context, nodeOrToken) {
  const sourceCode = getSourceCode(context);
  if (sourceCode.getCommentsBefore) {
    return sourceCode.getCommentsBefore(nodeOrToken);
  }
  // eslint < 4
  const previousToken = sourceCode.getTokenBefore(nodeOrToken);
  const start = previousToken ? previousToken.range[1] : 0;
  return sourceCode.getAllComments().filter((comment) => (
    comment.range[0] >= start && comment.range[1] <= nodeOrToken.range[0]
  ));
}

/**
 * Get the comments directly after a node or token, before the next token
 * @param {Object} context The rule context
 * @param {ASTNode|Token} nodeOrToken The node or token to get the comments after
 * @returns {Array} The comments after the node or token
 */
function getCommentsAfter(context, nodeOrToken) {
  const sourceCode = getSourceCode(context);
  if (sourceCode.getCommentsAfter) {
    return sourceCode.getCommentsAfter(nodeOrToken);
  }
  // eslint < 4
  const nextToken = sourceCode.getTokenAfter(nodeOrToken);
  const end = nextToken ? nextToken.range[0] : Infinity;
  return sourceCode.getAllComments().filter((comment) => (
    comment.range[0] >= nodeOrToken.range[1] && comment.range[1] <= end
  ));
}

module.exports = {
  getAncestors,
  getCommentsAfter,
  getCommentsBefore,
  getFilename,
  getFirstTokens,
  getScope,
  getSourceCode,
  getText,
  markVariableAsUsed,
};
