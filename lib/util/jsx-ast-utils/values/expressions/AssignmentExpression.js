'use strict';

/**
 * Extractor function for a AssignmentExpression type value node.
 * An assignment expression looks like `x = y` or `x += y` in expression position.
 * This will return the assignment as the value.
 *
 * @param value - AST Value object with type `AssignmentExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromAssignmentExpression(value) {
  const getValue = require('.').default;
  return `${getValue(value.left)} ${value.operator} ${getValue(value.right)}`;
}

module.exports = {
  default: extractValueFromAssignmentExpression,
};
