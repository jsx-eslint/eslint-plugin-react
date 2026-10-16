'use strict';

/**
 * Extractor function for a BinaryExpression type value node.
 * A binary expression has a left and right side separated by an operator
 * such as `a + b`.
 *
 * @param value - AST Value object with type `BinaryExpression`
 * @returns - The extracted value converted to correct type.
 */
function extractValueFromBinaryExpression(value) {
  const getValue = require('.').default;
  const { operator, left, right } = value;
  const leftVal = getValue(left);
  const rightVal = getValue(right);

  switch (operator) {
    case '==':
      return leftVal == rightVal;
    case '!=':
      return leftVal != rightVal;
    case '===':
      return leftVal === rightVal;
    case '!==':
      return leftVal !== rightVal;
    case '<':
      return leftVal < rightVal;
    case '<=':
      return leftVal <= rightVal;
    case '>':
      return leftVal > rightVal;
    case '>=':
      return leftVal >= rightVal;
    case '<<':
      return leftVal << rightVal;
    case '>>':
      return leftVal >> rightVal;
    case '>>>':
      return leftVal >>> rightVal;
    case '+':
      return leftVal + rightVal;
    case '-':
      return leftVal - rightVal;
    case '*':
      return leftVal * rightVal;
    case '/':
      return leftVal / rightVal;
    case '%':
      return leftVal % rightVal;
    case '|':
      return leftVal | rightVal;
    case '^':
      return leftVal ^ rightVal;
    case '&':
      return leftVal & rightVal;
    case 'in':
      try {
        return leftVal in rightVal;
      } catch {
        return false;
      }
    case 'instanceof':
      if (typeof rightVal !== 'function') {
        return false;
      }
      return leftVal instanceof rightVal;
    default:
      return undefined;
  }
}

module.exports = {
  default: extractValueFromBinaryExpression,
};
