'use strict';

/**
 * Extractor function for a JSXFragment type value node.
 *
 * Returns self-closing element with correct name.
 */
function extractValueFromJSXFragment(value) {
  const getValue = require('.').default;

  if (value.children.length === 0) {
    return '<></>';
  }
  return `<>${[].concat(value.children).map((x) => getValue(x)).join('')}</>`;
}

module.exports = {
  default: extractValueFromJSXFragment,
};
