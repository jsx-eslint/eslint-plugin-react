'use strict';

/**
 * Extractor function for a ChainExpression type value node.
 * A member expression is accessing a property on an object `obj.property`.
 *
 * @param value - AST Value object with type `ChainExpression`
 * @returns - The extracted value converted to correct type
 *  and maintaing `obj?.property` convention.
 */
function extractValueFromChainExpression(value) {
  const getValue = require('.').default;
  return getValue(value.expression || value);
}

module.exports = {
  default: extractValueFromChainExpression,
};
