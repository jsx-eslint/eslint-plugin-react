'use strict';

const semver = require('semver');
const eslintVersion = require('eslint/package.json').version;

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

function getJSDocComment(context, node) {
  const sourceCode = getSourceCode(context);

  // ESLint 10 removed the deprecated SourceCode#getJSDocComment API, but we
  // still rely on its behavior for JSDoc-based React component detection.
  // Reuse the ESLint 9 SourceCode#getJSDocComment logic as a compatibility
  // fallback when the built-in helper is no longer available.
  if (semver.major(eslintVersion) < 10 && sourceCode.getJSDocComment) {
    return sourceCode.getJSDocComment(node);
  }

  function findJSDocComment(astNode) {
    const tokenBefore = sourceCode.getTokenBefore(astNode, {
      includeComments: true,
    });

    if (
      tokenBefore
      && (tokenBefore.type === 'Block' || tokenBefore.type === 'Line')
      && tokenBefore.type === 'Block'
      && tokenBefore.value.charAt(0) === '*'
      && astNode.loc.start.line - tokenBefore.loc.end.line <= 1
    ) {
      return tokenBefore;
    }

    return null;
  }

  function looksLikeExport(astNode) {
    return astNode
      && (
        astNode.type === 'ExportDefaultDeclaration'
        || astNode.type === 'ExportNamedDeclaration'
        || astNode.type === 'ExportAllDeclaration'
        || astNode.type === 'ExportSpecifier'
      );
  }

  let parent = node.parent;

  switch (node.type) {
    case 'ClassDeclaration':
    case 'FunctionDeclaration':
      return findJSDocComment(looksLikeExport(parent) ? parent : node);

    case 'ClassExpression':
      return findJSDocComment(parent.parent);

    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      if (
        parent.type !== 'CallExpression'
        && parent.type !== 'NewExpression'
      ) {
        while (
          !sourceCode.getCommentsBefore(parent).length
          && !/Function/u.test(parent.type)
          && parent.type !== 'MethodDefinition'
          && parent.type !== 'Property'
        ) {
          parent = parent.parent;

          if (!parent) {
            break;
          }
        }

        if (
          parent
          && parent.type !== 'FunctionDeclaration'
          && parent.type !== 'Program'
        ) {
          return findJSDocComment(parent);
        }
      }

      return findJSDocComment(node);

    default:
      return null;
  }
}

function isSpaceBetweenTokens(context, leftToken, rightToken) {
  const sourceCode = getSourceCode(context);

  if (sourceCode.isSpaceBetweenTokens) {
    return sourceCode.isSpaceBetweenTokens(leftToken, rightToken);
  }

  if (
    leftToken
    && rightToken
    && Array.isArray(leftToken.range)
    && Array.isArray(rightToken.range)
    && (typeof leftToken.value === 'undefined' || typeof rightToken.value === 'undefined')
  ) {
    // Keep this compatibility fallback in the shared util because multiple JSX
    // spacing rules still call through here with nodes, not just tokens.
    // Preserve the old "is there text between these ranges?" behavior instead of
    // delegating to the ESLint 10 token-only helper.
    // Longer term, it would be cleaner to update those rule call sites to pass
    // actual tokens and narrow this helper back to token-only behavior.
    return leftToken.range[1] < rightToken.range[0];
  }

  return sourceCode.isSpaceBetween(leftToken, rightToken);
}

module.exports = {
  getAncestors,
  getFilename,
  getFirstTokens,
  getScope,
  getJSDocComment,
  getSourceCode,
  getText,
  isSpaceBetweenTokens,
  markVariableAsUsed,
};
