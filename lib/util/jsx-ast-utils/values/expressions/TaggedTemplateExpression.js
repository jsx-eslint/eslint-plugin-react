'use strict';

const extractValueFromTemplateLiteral = require('./TemplateLiteral').default;

function extractValueFromTaggedTemplateExpression(value) {
  return extractValueFromTemplateLiteral(value.quasi);
}

module.exports = {
  default: extractValueFromTaggedTemplateExpression,
};
