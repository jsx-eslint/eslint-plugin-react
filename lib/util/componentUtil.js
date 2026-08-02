'use strict';

const doctrine = require('doctrine');
const pragmaUtil = require('./pragma');
const eslintUtil = require('./eslint');

const getScope = eslintUtil.getScope;
const getSourceCode = eslintUtil.getSourceCode;
const getText = eslintUtil.getText;

// eslint-disable-next-line valid-jsdoc
/**
 * @template {(_: object) => any} T
 * @param {T} fn
 * @returns {T}
 */
function memoize(fn) {
  const cache = new WeakMap();
  // @ts-ignore
  return function memoizedFn(arg) {
    const cachedValue = cache.get(arg);
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    const v = fn(arg);
    cache.set(arg, v);
    return v;
  };
}

const getPragma = memoize(pragmaUtil.getFromContext);
const getCreateClass = memoize(pragmaUtil.getCreateClassFromContext);

/**
 * @param {ASTNode} node
 * @param {Context} context
 * @returns {boolean}
 */
function isES5Component(node, context) {
  const pragma = getPragma(context);
  const createClass = getCreateClass(context);

  // NOSONAR - Optional chaining requires Node 14+, but this plugin supports Node >=4. Remove when dropping Node < 14.
  if (!node.parent || !node.parent.callee) { // NOSONAR
    return false;
  }
  const callee = node.parent.callee;
  // React.createClass({})
  if (callee.type === 'MemberExpression') {
    return callee.object.name === pragma && callee.property.name === createClass;
  }
  // createClass({})
  if (callee.type === 'Identifier') {
    return callee.name === createClass;
  }
  return false;
}

/**
 * Checks whether a node represents an ES6 export declaration.
 * Mirrors ESLint's own `isExportDeclaration` in ast-utils.
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isExportDeclaration(node) {
  return (
    node.type === 'ExportDefaultDeclaration'
    || node.type === 'ExportNamedDeclaration'
    || node.type === 'ExportAllDeclaration'
  );
}

/**
 * Checks that `tokenBefore` is a JSDoc block comment immediately preceding
 * `node` (at most one blank line between them). Mirrors ESLint's own
 * `findJSDocComment` in ast-utils.
 * @param {ASTNode} node The target AST node
 * @param {any} sourceCode The ESLint source code object
 * @returns {ASTNode | null}
 */
function findJSDocComment(node, sourceCode) {
  // NOSONAR - Optional chaining requires Node 14+, but this plugin supports Node >=6. Remove when dropping Node < 14.
  const tokenBefore = sourceCode.getTokenBefore(node, { includeComments: true });
  if (
    tokenBefore // NOSONAR
    && tokenBefore.type === 'Block'
    && tokenBefore.value.charAt(0) === '*'
    && node.loc.start.line - tokenBefore.loc.end.line <= 1
  ) {
    return tokenBefore;
  }
  return null;
}

/**
 * Walks up the parent chain from a function expression's immediate parent to
 * find the appropriate ancestor node for a JSDoc look-up. Mirrors ESLint 9's
 * internal walk in `SourceCode#getJSDocComment`.
 * Returns the ancestor to search, or `null` to fall back to the function node.
 * @param {ASTNode} parent The immediate parent of the function expression
 * @param {any} sourceCode
 * @returns {ASTNode | null}
 */
function getFunctionExpressionJSDocTarget(parent, sourceCode) {
  if (!parent || parent.type === 'CallExpression' || parent.type === 'NewExpression') {
    return null;
  }
  let target = parent;
  while (
    target
    && !sourceCode.getCommentsBefore(target).length
    && !/Function/u.test(target.type)
    && target.type !== 'MethodDefinition'
    && target.type !== 'Property'
  ) {
    target = target.parent;
  }
  if (target && target.type !== 'FunctionDeclaration' && target.type !== 'Program') {
    return target;
  }
  return null;
}

/**
 * Retrieves the JSDoc comment for a given node.
 *
 * When `sourceCode.getJSDocComment` is available (ESLint ≤ 9) it is used
 * directly. Otherwise (ESLint 10+, where the method was removed) this
 * fallback mirrors the exact node-remapping and adjacency logic from
 * ESLint's internal `getJSDocComment` / `findJSDocComment` in ast-utils.js
 * so that the semantics remain identical across ESLint versions.
 *
 * @param {any} sourceCode The ESLint source code object
 * @param {ASTNode} node The AST node
 * @returns {ASTNode | null} The JSDoc comment node or null
 */
function getJSDocComment(sourceCode, node) {
  if (typeof sourceCode.getJSDocComment === 'function') {
    // Sometimes the passed node may not have been parsed yet by eslint, and this function call crashes.
    // Can be removed when eslint sets "parent" property for all nodes on initial AST traversal: https://github.com/eslint/eslint-scope/issues/27
    // eslint-disable-next-line no-warning-comments -- ESLint <8 is still in peerDeps (^5||^6||^7); remove when those are dropped. // NOSONAR
    // FIXME: Remove try/catch when dropping support for ESLint < 8.
    try {
      return sourceCode.getJSDocComment(node);
    } catch (e) { // NOSONAR
      return null;
    }
  }

  // ESLint 10+ fallback: replicate the node-remapping logic from ESLint 9's
  // SourceCode#getJSDocComment so that exported declarations and class
  // expressions are resolved to the correct parent node before the adjacency
  // check is performed.
  const parent = node.parent;
  switch (node.type) {
    case 'ClassDeclaration':
    case 'FunctionDeclaration':
      return findJSDocComment(
        parent && isExportDeclaration(parent) ? parent : node,
        sourceCode,
      );

    case 'ClassExpression': {
      // class expression: `const Foo = class {}` → look at VariableDeclaration
      // NOSONAR - Optional chaining requires Node 14+, but this plugin supports Node >=6. Remove when dropping Node < 14.
      const classExprTarget = parent && parent.parent ? parent.parent : node; // NOSONAR
      return findJSDocComment(classExprTarget, sourceCode);
    }

    case 'ArrowFunctionExpression':
    case 'FunctionExpression': {
      const fnTarget = getFunctionExpressionJSDocTarget(parent, sourceCode);
      return findJSDocComment(fnTarget || node, sourceCode);
    }

    default:
      return null;
  }
}

/**
 * @param {any} node
 * @param {Context} context
 * @returns {boolean}
 */
function isExplicitComponent(node, context) {
  const sourceCode = getSourceCode(context);
  const comment = getJSDocComment(sourceCode, node);

  if (comment === null) {
    return false;
  }

  let commentAst;
  try {
    commentAst = doctrine.parse(comment.value, {
      unwrap: true,
      tags: ['extends', 'augments'],
    });
  } catch (e) { // NOSONAR
    // handle a bug in the archived `doctrine`, see #2596
    return false;
  }

  const relevantTags = commentAst.tags.filter((tag) => tag.name === 'React.Component' || tag.name === 'React.PureComponent');

  return relevantTags.length > 0;
}

/**
 * @param {ASTNode} node
 * @param {Context} context
 * @returns {boolean}
 */
function isES6Component(node, context) {
  const pragma = getPragma(context);
  if (isExplicitComponent(node, context)) {
    return true;
  }

  if (!node.superClass) {
    return false;
  }
  if (node.superClass.type === 'MemberExpression') {
    return node.superClass.object.name === pragma
      && /^(Pure)?Component$/.test(node.superClass.property.name);
  }
  if (node.superClass.type === 'Identifier') {
    return /^(Pure)?Component$/.test(node.superClass.name);
  }
  return false;
}

/**
 * Get the parent ES5 component node from the current scope
 * @param {Context} context
 * @param {ASTNode} node
 * @returns {ASTNode|null}
 */
function getParentES5Component(context, node) {
  let scope = getScope(context, node);
  while (scope) {
    // @ts-ignore
    node = scope.block && scope.block.parent && scope.block.parent.parent; // NOSONAR
    if (node && isES5Component(node, context)) {
      return node;
    }
    scope = scope.upper;
  }
  return null;
}

/**
 * Get the parent ES6 component node from the current scope
 * @param {Context} context
 * @param {ASTNode} node
 * @returns {ASTNode | null}
 */
function getParentES6Component(context, node) {
  let scope = getScope(context, node);
  while (scope && scope.type !== 'class') {
    scope = scope.upper;
  }
  node = scope && scope.block; // NOSONAR
  if (!node || !isES6Component(node, context)) {
    return null;
  }
  return node;
}

/**
 * Checks if a component extends React.PureComponent
 * @param {ASTNode} node
 * @param {Context} context
 * @returns {boolean}
 */
function isPureComponent(node, context) {
  const pragma = getPragma(context);
  if (node.superClass) {
    return new RegExp(String.raw`^(${pragma}\.)?PureComponent$`).test(getText(context, node.superClass));
  }
  return false;
}

/**
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isStateMemberExpression(node) {
  return node.type === 'MemberExpression'
    && node.object.type === 'ThisExpression'
    && node.property.name === 'state';
}

module.exports = {
  isES5Component,
  isES6Component,
  getParentES5Component,
  getParentES6Component,
  isExplicitComponent,
  isPureComponent,
  isStateMemberExpression,
};
