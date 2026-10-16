'use strict';

/**
 * Extractor function for a ConditionalExpression type value node.
 *
 * @param value - AST Value object with type `ConditionalExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromConditionalExpression(value) {
  const getValue = require('.').default;
  const {
    test,
    alternate,
    consequent,
  } = value;

  return getValue(test) ? getValue(consequent) : getValue(alternate);
}

module.exports = {
  default: extractValueFromConditionalExpression,
};
