'use strict';

/**
 * Extractor function for a OptionalMemberExpression type value node.
 * A member expression is accessing a property on an object `obj.property`.
 *
 * @param value - AST Value object with type `OptionalMemberExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj?.property` convention.
 */
function extractValueFromOptionalMemberExpression(value) {
  const getValue = require('.').default;
  return `${getValue(value.object)}?.${getValue(value.property)}`;
}

module.exports = {
  default: extractValueFromOptionalMemberExpression,
};
