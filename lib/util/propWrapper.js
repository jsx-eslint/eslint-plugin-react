/**
 * @fileoverview Utility functions for propWrapperFunctions setting
 */

'use strict';

function getPropWrapperFunctions(context) {
  return new Set(context.settings.propWrapperFunctions || null);
}

function isPropWrapperFunction(context, name) {
  if (typeof name !== 'string') {
    return false;
  }
  const propWrapperFunctions = context.settings.propWrapperFunctions;
  if (propWrapperFunctions && propWrapperFunctions.length > 0) {
    const splitName = name.split('.');
    return propWrapperFunctions.some((func) => {
      if (splitName.length === 2 && func.object === splitName[0] && func.property === splitName[1]) {
        return true;
      }
      return name === func || func.property === name;
    });
  }
  return false;
}

module.exports = {
  getPropWrapperFunctions,
  isPropWrapperFunction
};
