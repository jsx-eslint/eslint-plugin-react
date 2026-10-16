'use strict';

/**
 * Logs out a message if there is no format option set.
 * @param {string} message - Message to log.
 */
function log(message) {
  if (!/=-(f|-format)=/.test(process.argv.join('='))) {
    console.log(message);
  }
}

module.exports = log;
