'use strict';

function extractValueFromOptionalMemberExpression(value) {
  const getValue = require('.').default;
  return `${getValue(value.object)}?.${getValue(value.property)}`;
}

module.exports = {
  default: extractValueFromOptionalMemberExpression,
};
