/**
 * @fileoverview Utility functions for React and Flow version configuration
 * @author Yannick Croissant
 */

'use strict';

const fs = require('fs');
const resolve = require('resolve');
const path = require('path');
const error = require('./error');

let warnedForMissingVersion = false;

function resetWarningFlag() {
  warnedForMissingVersion = false;
}

let cachedDetectedReactVersion;

function resetDetectedVersion() {
  cachedDetectedReactVersion = undefined;
}

function resolveBasedir(context) {
  let basedir = process.cwd();
  if (context) {
    const filename = context.getFilename();
    const dirname = path.dirname(filename);
    try {
      if (fs.statSync(filename).isFile()) {
        // dirname must be dir here
        basedir = dirname;
      }
    } catch (err) {
      // https://github.com/eslint/eslint/issues/11989
      if (err.code === 'ENOTDIR') {
        // the error code alreay indicates that dirname is a file
        basedir = path.dirname(dirname);
      }
    }
  }
  return basedir;
}

// TODO, semver-major: remove context fallback
function detectReactVersion(context) {
  if (cachedDetectedReactVersion) {
    return cachedDetectedReactVersion;
  }

  const basedir = resolveBasedir(context);

  try {
    const reactPath = resolve.sync('react', {basedir});
    const react = require(reactPath); // eslint-disable-line global-require, import/no-dynamic-require
    cachedDetectedReactVersion = react.version;
    return cachedDetectedReactVersion;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      if (!warnedForMissingVersion) {
        error('Warning: React version was set to "detect" in eslint-plugin-react settings, '
        + 'but the "react" package is not installed. Assuming latest React version for linting.');
        warnedForMissingVersion = true;
      }
      cachedDetectedReactVersion = '999.999.999';
      return cachedDetectedReactVersion;
    }
    throw e;
  }
}

const isANumber = (part) => typeof part === 'number';

function normalizeParts(parts) {
  if (parts.length === 3 && parts.every(isANumber)) {
    return parts;
  }
  return Array.from({length: 3}, (_, i) => (parts[i] || 0));
}

function getReactVersionFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings && context.settings.react && context.settings.react.version) {
    let settingsVersion = context.settings.react.version;
    if (settingsVersion === 'detect') {
      settingsVersion = detectReactVersion(context);
    }
    if (typeof settingsVersion !== 'string') {
      error('Warning: React version specified in eslint-plugin-react-settings must be a string; '
        + `got “${typeof settingsVersion}”`);
    }
    confVer = String(settingsVersion);
  } else if (!warnedForMissingVersion) {
    error('Warning: React version not specified in eslint-plugin-react settings. '
      + 'See https://github.com/yannickcr/eslint-plugin-react#configuration .');
    warnedForMissingVersion = true;
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return normalizeParts(confVer.split('.').map(Number));
}

// TODO, semver-major: remove context fallback
function detectFlowVersion(context) {
  const basedir = resolveBasedir(context);

  try {
    const flowPackageJsonPath = resolve.sync('flow-bin/package.json', {basedir});
    const flowPackageJson = require(flowPackageJsonPath); // eslint-disable-line global-require, import/no-dynamic-require
    return flowPackageJson.version;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      error('Warning: Flow version was set to "detect" in eslint-plugin-react settings, '
        + 'but the "flow-bin" package is not installed. Assuming latest Flow version for linting.');
      return '999.999.999';
    }
    throw e;
  }
}

function getFlowVersionFromContext(context) {
  let confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.flowVersion) {
    let flowVersion = context.settings.react.flowVersion;
    if (flowVersion === 'detect') {
      flowVersion = detectFlowVersion(context);
    }
    if (typeof flowVersion !== 'string') {
      error('Warning: Flow version specified in eslint-plugin-react-settings must be a string; '
        + `got “${typeof flowVersion}”`);
    }
    confVer = String(flowVersion);
  } else {
    throw 'Could not retrieve flowVersion from settings'; // eslint-disable-line no-throw-literal
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return normalizeParts(confVer.split('.').map(Number));
}

function isLessThan(a, b) {
  const higherMajor = a[0] < b[0];
  if (higherMajor) {
    return true;
  }
  const higherMinor = a[0] === b[0] && a[1] < b[1];
  if (higherMinor) {
    return true;
  }
  const higherOrEqualPatch = a[0] === b[0]
    && a[1] === b[1]
    && a[2] <= b[2];
  return higherOrEqualPatch;
}

function test(methodVer, confVer) {
  const methodVers = normalizeParts(
    (typeof methodVer === 'string'
      ? methodVer
      : String(methodVer || '')
    ).split('.').map(Number)
  );
  return isLessThan(methodVers, confVer);
}

function testReactVersion(context, methodVer) {
  return test(methodVer, getReactVersionFromContext(context));
}

function testFlowVersion(context, methodVer) {
  return test(methodVer, getFlowVersionFromContext(context));
}

module.exports = {
  getReactVersionFromContext,
  isLessThan,
  testReactVersion,
  testFlowVersion,
  resetWarningFlag,
  resetDetectedVersion
};
