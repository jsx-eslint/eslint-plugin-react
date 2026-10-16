'use strict';

function getSourceCode(context) {
  return context.sourceCode;
}

function getFilename(context) {
  return context.filename;
}

function getAncestors(context, node) {
  return context.sourceCode.getAncestors(node);
}

function getScope(context, node) {
  return context.sourceCode.getScope(node);
}

function markVariableAsUsed(name, node, context) {
  return context.sourceCode.markVariableAsUsed(name, node);
}

function getFirstTokens(context, node, count) {
  return context.sourceCode.getFirstTokens(node, count);
}

function getText(context) {
  const args = Array.prototype.slice.call(arguments, 1);
  return context.sourceCode.getText.apply(context.sourceCode, args);
}

/**
 * Get the comments directly before a node or token, after the previous token
 * @param {Object} context The rule context
 * @param {ASTNode|Token} nodeOrToken The node or token to get the comments before
 * @returns {Array} The comments before the node or token
 */
function getCommentsBefore(context, nodeOrToken) {
  return context.sourceCode.getCommentsBefore(nodeOrToken);
}

/**
 * Get the comments directly after a node or token, before the next token
 * @param {Object} context The rule context
 * @param {ASTNode|Token} nodeOrToken The node or token to get the comments after
 * @returns {Array} The comments after the node or token
 */
function getCommentsAfter(context, nodeOrToken) {
  return context.sourceCode.getCommentsAfter(nodeOrToken);
}

/** @typedef {import('eslint').SourceCode} SourceCode */
/** @typedef {import('estree').Node} Node */
/** @typedef {import('eslint').AST.Token | import('estree').Comment} Token */

/**
 * Determines if two nodes or tokens have at least one whitespace character between them,
 * counting the whitespace inside of JSXText tokens between them too.
 *
 * This is `SourceCode#isSpaceBetweenTokens()` of ESLint 9, which was removed in ESLint 10.
 * Unlike it, `SourceCode#isSpaceBetween()` does not look inside of JSXText.
 * @param {SourceCode} sourceCode The source code object
 * @param {Node | Token} first The first node or token
 * @param {Node | Token} second The second node or token
 * @returns {boolean} True if there is a whitespace character between them
 */
function isSpaceBetweenTokens(sourceCode, first, second) {
  const overlap = (first.range[0] <= second.range[0] && first.range[1] >= second.range[0])
    || (second.range[0] <= first.range[0] && second.range[1] >= first.range[0]);
  if (overlap) {
    return false;
  }

  const ordered = first.range[1] <= second.range[0] ? [first, second] : [second, first];
  // the token methods also accept tokens, though their types only allow nodes
  const firstToken = sourceCode.getLastToken(/** @type {Node} */ (ordered[0])) || ordered[0];
  const finalToken = sourceCode.getFirstToken(/** @type {Node} */ (ordered[1])) || ordered[1];
  let currentToken = firstToken;

  while (currentToken !== finalToken) {
    const nextToken = sourceCode.getTokenAfter(/** @type {Node} */ (currentToken), { includeComments: true });

    if (
      currentToken.range[1] !== nextToken.range[0]
      || (nextToken !== finalToken && nextToken.type === 'JSXText' && /\s/.test(nextToken.value))
    ) {
      return true;
    }

    currentToken = nextToken;
  }

  return false;
}

/**
 * Retrieves the JSDoc comment for a given node.
 *
 * This is `SourceCode#getJSDocComment()` of ESLint 9, which was removed in ESLint 10.
 * @param {SourceCode} sourceCode The source code object
 * @param {Node} node The AST node to get the comment for
 * @returns {Token | null} The Block comment token containing the JSDoc comment, or null if not found
 */
function getJSDocComment(sourceCode, node) {
  /**
   * @param {Node} astNode
   * @returns {Token | null}
   */
  function findJSDocComment(astNode) {
    const tokenBefore = sourceCode.getTokenBefore(astNode, { includeComments: true });

    if (
      tokenBefore
      && tokenBefore.type === 'Block'
      && tokenBefore.value.charAt(0) === '*'
      && astNode.loc.start.line - tokenBefore.loc.end.line <= 1
    ) {
      return tokenBefore;
    }

    return null;
  }

  /** @type {Node} */
  let parent = /** @type {any} */ (node).parent;

  switch (node.type) {
    case 'ClassDeclaration':
    case 'FunctionDeclaration': {
      const isExport = parent.type === 'ExportDefaultDeclaration'
        || parent.type === 'ExportNamedDeclaration'
        || parent.type === 'ExportAllDeclaration'
        || parent.type === 'ExportSpecifier';
      return findJSDocComment(isExport ? parent : node);
    }

    case 'ClassExpression':
      return findJSDocComment(/** @type {any} */ (parent).parent);

    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      if (parent.type !== 'CallExpression' && parent.type !== 'NewExpression') {
        while (
          !sourceCode.getCommentsBefore(parent).length
          && !/Function/.test(parent.type)
          && parent.type !== 'MethodDefinition'
          && parent.type !== 'Property'
        ) {
          parent = /** @type {any} */ (parent).parent;

          if (!parent) {
            break;
          }
        }

        if (parent && parent.type !== 'FunctionDeclaration' && parent.type !== 'Program') {
          return findJSDocComment(parent);
        }
      }

      return findJSDocComment(node);

    default:
      return null;
  }
}

module.exports = {
  getAncestors,
  getCommentsAfter,
  getCommentsBefore,
  getFilename,
  getFirstTokens,
  getJSDocComment,
  getScope,
  getSourceCode,
  getText,
  isSpaceBetweenTokens,
  markVariableAsUsed,
};
