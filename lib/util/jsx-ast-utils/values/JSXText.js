'use strict';

/**
 * Extractor function for a JSXText type value node.
 *
 * Returns self-closing element with correct name.
 */
function extractValueFromJSXText(value) {
  return value.raw;
}

module.exports = {
  default: extractValueFromJSXText,
};
