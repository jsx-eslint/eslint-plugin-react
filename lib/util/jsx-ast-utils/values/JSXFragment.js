'use strict';

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
