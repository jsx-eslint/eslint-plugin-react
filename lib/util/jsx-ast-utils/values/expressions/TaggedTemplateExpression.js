'use strict';

const extractValueFromTemplateLiteral = require('./TemplateLiteral').default;

/**
 * Returns the string value of a tagged template literal object.
 * Redirects the bulk of the work to `TemplateLiteral`.
 */
function extractValueFromTaggedTemplateExpression(value) {
  return extractValueFromTemplateLiteral(value.quasi);
}

module.exports = {
  default: extractValueFromTaggedTemplateExpression,
};
