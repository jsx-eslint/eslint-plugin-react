/**
 * @fileoverview Utility functions for AST
 */
'use strict';

/**
 * Get properties name
 * @param {Object} node - Property.
 * @returns {String} Property name.
 */
function getPropertyName(node) {
  if (node.key || ['MethodDefinition', 'Property'].indexOf(node.type) !== -1) {
    return node.key.name;
  } else if (node.type === 'MemberExpression') {
    return node.property.name;
  }
  return '';
}

/**
 * Get properties for a given AST node
 * @param {ASTNode} node The AST node being checked.
 * @returns {Array} Properties array.
 */
function getComponentProperties(node) {
  switch (node.type) {
    case 'ClassDeclaration':
    case 'ClassExpression':
      return node.body.body;
    case 'ObjectExpression':
      // return node.properties;
      return node.properties;
    default:
      return [];
  }
}

module.exports = {
  getPropertyName: getPropertyName,
  getComponentProperties: getComponentProperties
};
