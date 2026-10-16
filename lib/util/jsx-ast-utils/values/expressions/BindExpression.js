'use strict';

function extractValueFromBindExpression(value) {
  const getValue = require('.').default;
  const callee = getValue(value.callee);

  const object = value.object === null ? getValue(value.callee.object) : getValue(value.object);

  if (value.object && value.object.property) {
    return `${object}.${callee}.bind(${object})`;
  }

  return `${callee}.bind(${object})`;
}

module.exports = {
  default: extractValueFromBindExpression,
};
