'use strict';

/**
 * Extractor function for a CallExpression type value node.
 * A call expression looks like `bar()`
 * This will return `bar` as the value to indicate its existence,
 * since we can not execute the function bar in a static environment.
 *
 * @param value - AST Value object with type `CallExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromCallExpression(value) {
  const getValue = require('.').default;
  const args = Array.isArray(value.arguments) ? value.arguments.map((x) => getValue(x)).join(', ') : '';
  return `${getValue(value.callee)}${value.optional ? '?.' : ''}(${args})`;
}

module.exports = {
  default: extractValueFromCallExpression,
};
