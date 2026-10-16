'use strict';

function extractValueFromFunctionExpression(value) {
  return () => value;
}

module.exports = {
  default: extractValueFromFunctionExpression,
};
