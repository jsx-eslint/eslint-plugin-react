'use strict';

/**
 * Extractor function for an UpdateExpression type value node.
 * An update expression is an expression with an update operator.
 * For example, foo++ will evaluate to foo + 1.
 *
 * @param value - AST Value object with type `UpdateExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromUpdateExpression(value) {
  const getValue = require('.').default;
  const { operator, argument, prefix } = value;

  let val = getValue(argument);

  switch (operator) {
    case '++':
      // eslint-disable-next-line no-useless-assignment -- the value of `++` converts `val` to a number, like the original
      return prefix ? ++val : val++;
    case '--':
      // eslint-disable-next-line no-useless-assignment -- the value of `--` converts `val` to a number, like the original
      return prefix ? --val : val--;
    default:
      return undefined;
  }
}

module.exports = {
  default: extractValueFromUpdateExpression,
};
