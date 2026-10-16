'use strict';

function extractValueFromJSXElement(value) {
  const getValue = require('.').default;

  const Tag = value.openingElement.name.name;
  if (value.openingElement.selfClosing) {
    return `<${Tag} />`;
  }
  return `<${Tag}>${[].concat(value.children).map((x) => getValue(x)).join('')}</${Tag}>`;
}

module.exports = {
  default: extractValueFromJSXElement,
};
