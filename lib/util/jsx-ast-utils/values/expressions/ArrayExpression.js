'use strict';

function extractValueFromArrayExpression(value) {
  const getValue = require('.').default;
  return value.elements.map((element) => {
    if (element === null) return undefined;
    return getValue(element);
  });
}

module.exports = {
  default: extractValueFromArrayExpression,
};
