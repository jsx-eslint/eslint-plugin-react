'use strict';

/**
 * Check if the first letter of a string is capitalized.
 * @param {String} word String to check
 * @returns {Boolean} True if first letter is capitalized.
 */
function isFirstLetterCapitalized(word) {
  if (!word) {
    return false;
  }
  return /^[A-Z]/.test(word);
}

module.exports = isFirstLetterCapitalized;
