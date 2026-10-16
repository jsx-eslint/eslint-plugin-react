'use strict';

function extractValueFromOptionalCallExpression(value) {
  const getValue = require('.').default;
  return `${getValue(value.callee)}?.(${value.arguments.map((x) => getValue(x)).join(', ')})`;
}

module.exports = {
  default: extractValueFromOptionalCallExpression,
};
