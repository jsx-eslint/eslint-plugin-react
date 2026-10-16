'use strict';

/**
 * Extractor function for an ObjectExpression type value node.
 * An object expression is using {}.
 *
 * @returns - a representation of the object
 */
function extractValueFromObjectExpression(value) {
  const getValue = require('.').default;
  return value.properties.reduce((obj, property) => {
    // Support types: SpreadProperty and ExperimentalSpreadProperty
    if (/^(?:Experimental)?Spread(?:Property|Element)$/.test(property.type)) {
      if (property.argument.type === 'ObjectExpression') {
        return Object.assign({}, obj, extractValueFromObjectExpression(property.argument));
      }
    } else {
      return Object.assign({}, obj, { [getValue(property.key)]: getValue(property.value) });
    }
    return obj;
  }, {});
}

module.exports = {
  default: extractValueFromObjectExpression,
};
