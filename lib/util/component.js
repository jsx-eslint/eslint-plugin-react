/**
 * @fileoverview Utility functions for React components detection
 * @author Yannick Croissant
 */
'use strict';

var util = require('util');

var DEFAULT_COMPONENT_NAME = 'eslintReactComponent';

/**
 * Detect if the node is a component definition
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The AST node being checked.
 * @returns {Boolean} True the node is a component definition, false if not.
 */
function isComponentDefinition(context, node) {
  switch (node.type) {
    case 'ObjectExpression':
      if (node.parent && node.parent.callee && context.getSource(node.parent.callee) === 'React.createClass') {
        return true;
      }
      break;
    case 'ClassDeclaration':
      var superClass = node.superClass && context.getSource(node.superClass);
      if (superClass === 'Component' && superClass === 'React.Component') {
        return true;
      }
      break;
    default:
      break;
  }
  return false;
}

/**
 * Detect if the node is rendering some JSX
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The AST node being checked.
 * @returns {Boolean} True the node is rendering some JSX, false if not.
 */
function isRenderingJSX(context, node) {
  var tokens = context.getTokens(node);
  for (var i = 0, j = tokens.length; i < j; i++) {
    var hasJSX = /^JSX/.test(tokens[i].type);
    var hasReact =
      tokens[i].type === 'Identifier' && tokens[i].value === 'React' &&
      tokens[i + 2] && tokens[i + 2].type === 'Identifier' && tokens[i + 2].value === 'createElement';
    if (!hasJSX && !hasReact) {
      continue;
    }
    return true;
  }
  return false;
}

/**
 * Check if a class has a valid render method
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The AST node being checked.
 * @returns {Boolean} True the class has a valid render method, false if not.
 */
function isClassWithRender(context, node) {
  if (node.type !== 'ClassDeclaration') {
    return false;
  }
  for (var i = 0, j = node.body.body.length; i < j; i++) {
    var declaration = node.body.body[i];
    if (declaration.type !== 'MethodDefinition' || declaration.key.name !== 'render') {
      continue;
    }
    return isRenderingJSX(context, declaration);
  }
  return false;
}

/**
 * Get the React component ASTNode from any child ASTNode
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The AST node being checked.
 * @returns {ASTNode} The ASTNode of the React component.
 */
function getNode(context, node) {
  var componentNode = null;
  var ancestors = context.getAncestors().reverse();

  ancestors.unshift(node);

  for (var i = 0, j = ancestors.length; i < j; i++) {
    if (isComponentDefinition(context, ancestors[i])) {
      componentNode = ancestors[i];
      break;
    }
    if (isClassWithRender(context, ancestors[i])) {
      componentNode = ancestors[i];
      break;
    }

  }

  return componentNode;
}

/**
 * Get the identifiers of a React component ASTNode
 * @param {ASTNode} node The React component ASTNode being checked.
 * @returns {Object} The component identifiers.
 */
function getIdentifiers(node) {
  var name = node.id && node.id.name || DEFAULT_COMPONENT_NAME;
  var id = name + ':' + node.loc.start.line + ':' + node.loc.start.column;

  return {
    id: id,
    name: name
  };
}

/**
 * Store a React component list
 * @constructor
 */
function List() {
  this._list = {};
  this._length = 0;
}

/**
 * Find a component in the list by his node or one of his child node
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The node to find.
 * @returns {Object|null} The component if it is found, null if not.
 */
List.prototype.getByNode = function(context, node) {
  var componentNode = getNode(context, node);
  if (!componentNode) {
    return null;
  }
  var identifiers = getIdentifiers(componentNode);

  return this._list[identifiers.id] || null;
};

/**
 * Find a component in the list by his name
 * @param {String} name Name of the component to find.
 * @returns {Object|null} The component if it is found, null if not.
 */
List.prototype.getByName = function(name) {
  for (var component in this._list) {
    if (this._list.hasOwnProperty(component) && this._list[component].name === name) {
      return this._list[component];
    }
  }
  return null;
};

/**
 * Return the component list
 * @returns {Object} The component list.
 */
List.prototype.getList = function() {
  return this._list;
};

/**
 * Add/update a component in the list
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The node to add.
 * @param {Object} customProperties Additional properties to add to the component.
 * @returns {Object} The added component.
 */
List.prototype.set = function(context, node, customProperties) {
  var componentNode = getNode(context, node);
  if (!componentNode) {
    return null;
  }
  var identifiers = getIdentifiers(componentNode);

  var component = util._extend({
    name: identifiers.name,
    node: componentNode
  }, customProperties || {});

  if (!this._list[identifiers.id]) {
    this._length++;
  }

  this._list[identifiers.id] = util._extend(this._list[identifiers.id] || {}, component);

  return component;
};

/**
 * Remove a component from the list
 * @param {Object} context The current rule context.
 * @param {ASTNode} node The node to remove.
 */
List.prototype.remove = function(context, node) {
  var componentNode = getNode(context, node);
  if (!componentNode) {
    return null;
  }
  var identifiers = getIdentifiers(componentNode);

  if (!this._list[identifiers.id]) {
    return null;
  }

  delete this._list[identifiers.id];
  this._length--;

  return null;
};

/**
 * Return the component list length
 * @returns {Number} The component list length.
 */
List.prototype.count = function() {
  return this._length;
};

module.exports = {
  DEFAULT_COMPONENT_NAME: DEFAULT_COMPONENT_NAME,
  getNode: getNode,
  isComponentDefinition: isComponentDefinition,
  getIdentifiers: getIdentifiers,
  List: List
};
