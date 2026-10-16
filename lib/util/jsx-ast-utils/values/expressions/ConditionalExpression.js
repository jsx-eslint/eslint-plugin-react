'use strict';

function extractValueFromConditionalExpression(value) {
  const getValue = require('.').default;
  const {
    test,
    alternate,
    consequent,
  } = value;

  return getValue(test) ? getValue(consequent) : getValue(alternate);
}

module.exports = {
  default: extractValueFromConditionalExpression,
};
