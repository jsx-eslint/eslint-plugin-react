'use strict';

function extractValueFromChainExpression(value) {
  const getValue = require('.').default;
  return getValue(value.expression || value);
}

module.exports = {
  default: extractValueFromChainExpression,
};
