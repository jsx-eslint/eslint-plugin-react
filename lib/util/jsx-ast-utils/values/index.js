'use strict';

const Literal = require('./Literal').default;
const JSXElement = require('./JSXElement').default;
const JSXText = require('./JSXText').default;
const JSXFragment = require('./JSXFragment').default;
const JSXExpressionContainer = require('./expressions').default;
const { extractLiteral } = require('./expressions');

const TYPES = {
  Literal,
  JSXElement,
  JSXExpressionContainer,
  JSXText,
  JSXFragment,
};

const LITERAL_TYPES = {
  ...TYPES,
  JSXElement: () => null,
  JSXExpressionContainer: extractLiteral,
};

function getValue(value) {
  return TYPES[value.type](value);
}

function getLiteralValue(value) {
  return LITERAL_TYPES[value.type](value);
}

module.exports = {
  default: getValue,
  getLiteralValue,
};
