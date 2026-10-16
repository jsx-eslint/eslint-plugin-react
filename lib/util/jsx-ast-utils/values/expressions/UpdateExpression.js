'use strict';

function extractValueFromUpdateExpression(value) {
  const getValue = require('.').default;
  const { operator, argument, prefix } = value;

  let val = getValue(argument);

  switch (operator) {
    case '++':
      // eslint-disable-next-line no-useless-assignment -- the value of `++` converts `val` to a number, like the original
      return prefix ? ++val : val++;
    case '--':
      // eslint-disable-next-line no-useless-assignment -- the value of `--` converts `val` to a number, like the original
      return prefix ? --val : val--;
    default:
      return undefined;
  }
}

module.exports = {
  default: extractValueFromUpdateExpression,
};
