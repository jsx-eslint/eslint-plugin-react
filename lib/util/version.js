/**
 * @fileoverview Utility functions for React and Flow version configuration
 * @author Yannick Croissant
 */
'use strict';

const resolve = require('resolve');
const log = require('./log');

let warnedForMissingVersion = false;

function detectReactVersion() {
  try {
    const reactPath = resolve.sync('react', {basedir: process.cwd()});
    const react = require(reactPath);
    return react.version;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      log('Warning: React version was set to "detect" in eslint-plugin-react settings, ' +
        'but the "react" package is not installed. Assuming latest React version for linting.');
      return '999.999.999';
    }
    throw e;
  }
}

function getReactVersionFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.version) {
    let settingsVersion = context.settings.react.version;
    if (settingsVersion === 'detect') {
      settingsVersion = detectReactVersion();
    }
    confVer = settingsVersion;
  } else if (!warnedForMissingVersion) {
    log('Warning: React version not specified in eslint-plugin-react settings. ' +
      'See https://github.com/yannickcr/eslint-plugin-react#configuration.');
    warnedForMissingVersion = true;
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return confVer.split('.').map(part => Number(part));
}

function getFlowVersionFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.flowVersion) {
    confVer = context.settings.react.flowVersion;
  } else {
    throw 'Could not retrieve flowVersion from settings';
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return confVer.split('.').map(part => Number(part));
}

function test(context, methodVer, confVer) {
  methodVer = String(methodVer || '').split('.').map(part => Number(part));
  const higherMajor = methodVer[0] < confVer[0];
  const higherMinor = methodVer[0] === confVer[0] && methodVer[1] < confVer[1];
  const higherOrEqualPatch = methodVer[0] === confVer[0] && methodVer[1] === confVer[1] && methodVer[2] <= confVer[2];

  return higherMajor || higherMinor || higherOrEqualPatch;
}

function testReactVersion(context, methodVer) {
  return test(context, methodVer, getReactVersionFromContext(context));
}

function testFlowVersion(context, methodVer) {
  return test(context, methodVer, getFlowVersionFromContext(context));
}

module.exports = {
  testReactVersion,
  testFlowVersion
};
