'use strict';

/**
 * Check if the first letter of a string is capitalized.
 * @param {string} word String to check
 * @returns {boolean} True if first letter is capitalized.
 */
function isFirstLetterCapitalized(word) {
  if (!word) {
    return false;
  }
  const firstLetter = word.replace(/^_+/, '').charAt(0);
  return firstLetter.toUpperCase() === firstLetter;
}

module.exports = isFirstLetterCapitalized;
