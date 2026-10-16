'use strict';

function extractValueFromMemberExpression(value) {
  const getValue = require('.').default;
  return `${getValue(value.object)}${value.optional ? '?.' : '.'}${getValue(value.property)}`;
}

module.exports = {
  default: extractValueFromMemberExpression,
};
