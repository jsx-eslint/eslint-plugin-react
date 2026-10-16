'use strict';

/**
 * Extractor function for a NewExpression type value node.
 * A new expression instantiates an object with `new` keyword.
 *
 * @returns - an empty object.
 */
function extractValueFromNewExpression() {
  return new Object();
}

module.exports = {
  default: extractValueFromNewExpression,
};
