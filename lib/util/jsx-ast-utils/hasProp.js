'use strict';

const propName = require('./propName').default;

const DEFAULT_OPTIONS = {
  spreadStrict: true,
  ignoreCase: true,
};

function hasProp(props = [], prop = '', options = DEFAULT_OPTIONS) {
  const propToCheck = options.ignoreCase ? prop.toUpperCase() : prop;

  return props.some((attribute) => {
    if (attribute.type === 'JSXSpreadAttribute') {
      return !options.spreadStrict;
    }

    const currentProp = options.ignoreCase
      ? propName(attribute).toUpperCase()
      : propName(attribute);

    return propToCheck === currentProp;
  });
}

module.exports = {
  default: hasProp,
};
