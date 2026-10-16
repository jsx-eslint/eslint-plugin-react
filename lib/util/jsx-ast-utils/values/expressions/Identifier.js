'use strict';

const JS_RESERVED = {
  Array,
  Date,
  Infinity,
  Math,
  Number,
  Object,
  String,
  undefined,
};

function extractValueFromIdentifier(value) {
  const { name } = value;

  if (Object.hasOwnProperty.call(JS_RESERVED, name)) {
    return JS_RESERVED[name];
  }

  return name;
}

module.exports = {
  default: extractValueFromIdentifier,
};
