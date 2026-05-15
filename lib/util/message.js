'use strict';

const semver = require('semver');

let eslintVersion;

try {
  eslintVersion = require('eslint/package.json').version; // eslint-disable-line global-require
} catch (error) {
  if (!error || error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}

module.exports = function getMessageData(messageId, message) {
  return messageId && eslintVersion && semver.satisfies(eslintVersion, '>= 4.15') ? { messageId } : { message };
};
