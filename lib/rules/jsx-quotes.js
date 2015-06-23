/**
 * @fileoverview Enforce props quotes style
 * @author Matt DuVall <http://www.mattduvall.com/>, Brandon Payton, Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var QUOTE_SETTINGS = {
  double: {
    quote: '"',
    alternateQuote: '\'',
    description: 'doublequote'
  },
  single: {
    quote: '\'',
    alternateQuote: '"',
    description: 'singlequote'
  }
};

var AVOID_ESCAPE = 'avoid-escape';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  /**
   * Validate that a string passed in is surrounded by the specified character
   * @param  {string} val The text to check.
   * @param  {string} character The character to see if it's surrounded by.
   * @returns {boolean} True if the text is surrounded by the character, false if not.
   * @private
   */
  function isSurroundedBy(val, character) {
    return val[0] === character && val[val.length - 1] === character;
  }

  return {

    Literal: function(node) {
      if (node.parent.type !== 'JSXAttribute') {
        return;
      }
      var val = node.value;
      var rawVal = node.raw;
      var quoteOption = context.options[0];
      var settings = QUOTE_SETTINGS[quoteOption];
      var avoidEscape = context.options[1] === AVOID_ESCAPE;
      var isValid;

      if (settings && typeof val === 'string') {
        isValid = isSurroundedBy(rawVal, settings.quote);

        if (!isValid && avoidEscape) {
          isValid = isSurroundedBy(rawVal, settings.alternateQuote) && rawVal.indexOf(settings.quote) >= 0;
        }

        if (!isValid) {
          context.report(node, 'JSX attributes must use ' + settings.description + '.');
        }
      }
    }
  };

};

module.exports.schema = [{
  enum: ['single', 'double']
}, {
  enum: ['avoid-escape']
}];
