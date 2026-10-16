'use strict';

const getValue = require('./values').default;
const { getLiteralValue } = require('./values');

const extractValue = (attribute, extractor) => {
  if (attribute && attribute.type === 'JSXAttribute') {
    if (attribute.value === null) {
      return true;
    }

    return extractor(attribute.value);
  }

  return undefined;
};

function getPropValue(attribute) {
  return extractValue(attribute, getValue);
}

function getLiteralPropValue(attribute) {
  return extractValue(attribute, getLiteralValue);
}

module.exports = {
  default: getPropValue,
  getLiteralPropValue,
};
