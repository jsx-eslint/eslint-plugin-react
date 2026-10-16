'use strict';

/**
 * @returns { String|Boolean } - The extracted value converted to correct type.
 */
function extractValueFromLiteral(value) {
  const { value: extractedValue } = value;

  const normalizedStringValue = typeof extractedValue === 'string' && extractedValue.toLowerCase();
  if (normalizedStringValue === 'true') {
    return true;
  }

  if (normalizedStringValue === 'false') {
    return false;
  }

  return extractedValue;
}

module.exports = {
  default: extractValueFromLiteral,
};
