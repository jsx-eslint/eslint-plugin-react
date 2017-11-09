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

module.exports = {
  getPropertyName: getPropertyName
};
