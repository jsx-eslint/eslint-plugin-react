/**
 * Takes an unsafe user pattern String and returns a safe RegExp
 */
'use strict';

var escapeRegExp = require('./escapeRegExp');

module.exports = function (str) {
  var safeString = escapeRegExp(str).replace('\\*', '.*');
  return RegExp('^' + safeString + '$');
};
