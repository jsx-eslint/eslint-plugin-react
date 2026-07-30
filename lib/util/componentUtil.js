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
 * Retrieves the JSDoc comment for a given node.
 * @param {any} sourceCode The ESLint source code object
 * @param {ASTNode} node The AST node
 * @returns {ASTNode | null} The JSDoc comment node or null
 */
function getJSDocComment(sourceCode, node) {
  if (typeof sourceCode.getJSDocComment === 'function') {
    // Sometimes the passed node may not have been parsed yet by eslint, and this function call crashes.
    // Can be removed when eslint sets "parent" property for all nodes on initial AST traversal: https://github.com/eslint/eslint-scope/issues/27
    // eslint-disable-next-line no-warning-comments
    // FIXME: Remove try/catch when dropping support for ESLint < 8. // NOSONAR
    try {
      return sourceCode.getJSDocComment(node);
    } catch (e) { // NOSONAR
      return null;
    }
  }
  const comments = sourceCode.getCommentsBefore(node);
  for (let i = comments.length - 1; i >= 0; i--) {
    const comment = comments[i];
    if (comment.type === 'Block' && comment.value.startsWith('*')) {
      return comment;
    }
  }
  return null;
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
