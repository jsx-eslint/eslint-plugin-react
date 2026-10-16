'use strict';

const hasProp = require('./hasProp').default;
const { hasAnyProp, hasEveryProp } = require('./hasProp');
const elementType = require('./elementType').default;
const getProp = require('./getProp').default;
const getPropValue = require('./getPropValue').default;
const { getLiteralPropValue } = require('./getPropValue');
const propName = require('./propName').default;

module.exports = {
  hasProp,
  hasAnyProp,
  hasEveryProp,
  elementType,
  getProp,
  getPropValue,
  getLiteralPropValue,
  propName,
};
