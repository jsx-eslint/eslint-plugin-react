/**
 * @fileoverview Utility functions for React version configuration
 * @author Yannick Croissant
 */
'use strict';

function getFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.version) {
    confVer = context.settings.react.version;
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return confVer.split('.').map(part => Number(part));
}

function test(context, methodVer) {
  const confVer = getFromContext(context);
  methodVer = methodVer.split('.').map(part => Number(part));
  const higherMajor = methodVer[0] < confVer[0];
  const higherMinor = methodVer[0] === confVer[0] && methodVer[1] < confVer[1];
  const higherOrEqualPatch = methodVer[0] === confVer[0] && methodVer[1] === confVer[1] && methodVer[2] <= confVer[2];

  return higherMajor || higherMinor || higherOrEqualPatch;
}

module.exports = {
  test: test
};
