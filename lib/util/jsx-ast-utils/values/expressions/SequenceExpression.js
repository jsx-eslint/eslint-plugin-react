'use strict';

function extractValueFromSequenceExpression(value) {
  const getValue = require('.').default;
  return value.expressions.map((element) => getValue(element));
}

module.exports = {
  default: extractValueFromSequenceExpression,
};
