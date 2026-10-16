'use strict';

function extractValueFromLogicalExpression(value) {
  const getValue = require('.').default;
  const { operator, left, right } = value;
  const leftVal = getValue(left);
  const rightVal = getValue(right);

  if (operator === '&&') {
    return leftVal && rightVal;
  }
  if (operator === '??') {
    return (leftVal === null || typeof leftVal === 'undefined') ? rightVal : leftVal;
  }
  return leftVal || rightVal;
}

module.exports = {
  default: extractValueFromLogicalExpression,
};
