'use strict';

function extractValueFromCallExpression(value) {
  const getValue = require('.').default;
  const args = Array.isArray(value.arguments) ? value.arguments.map((x) => getValue(x)).join(', ') : '';
  return `${getValue(value.callee)}${value.optional ? '?.' : ''}(${args})`;
}

module.exports = {
  default: extractValueFromCallExpression,
};
