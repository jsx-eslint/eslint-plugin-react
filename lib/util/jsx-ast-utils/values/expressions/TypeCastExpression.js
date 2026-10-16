'use strict';

function extractValueFromTypeCastExpression(value) {
  const getValue = require('.').default;
  return getValue(value.expression);
}

module.exports = {
  default: extractValueFromTypeCastExpression,
};
