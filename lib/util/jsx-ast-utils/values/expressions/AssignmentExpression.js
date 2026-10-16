'use strict';

function extractValueFromAssignmentExpression(value) {
  const getValue = require('.').default;
  return `${getValue(value.left)} ${value.operator} ${getValue(value.right)}`;
}

module.exports = {
  default: extractValueFromAssignmentExpression,
};
