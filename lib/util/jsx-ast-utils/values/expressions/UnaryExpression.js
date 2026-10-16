'use strict';

function extractValueFromUnaryExpression(value) {
  const getValue = require('.').default;
  const { operator, argument } = value;

  switch (operator) {
    case '-':
      return -getValue(argument);
    case '+':
      return +getValue(argument);
    case '!':
      return !getValue(argument);
    case '~':
      return ~getValue(argument);
    case 'delete':
      return true;
    case 'typeof':
    case 'void':
    default:
      return undefined;
  }
}

module.exports = {
  default: extractValueFromUnaryExpression,
};
