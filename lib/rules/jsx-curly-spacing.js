/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Jamund Ferguson, Brandyn Bennett, Michael Ficarra, Vignesh Anand, Jamund Ferguson, Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
  var spaced = context.options[0] === 'always';

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  /**
   * Determines whether two adjacent tokens are have whitespace between them.
   * @param {Object} left - The left token object.
   * @param {Object} right - The right token object.
   * @returns {boolean} Whether or not there is space between the tokens.
   */
  function isSpaced(left, right) {
    return left.range[1] < right.range[0];
  }

  /**
  * Reports that there shouldn't be a space after the first token
  * @param {ASTNode} node - The node to report in the event of an error.
  * @param {Token} token - The token to use for the report.
  * @returns {void}
  */
  function reportNoBeginningSpace(node, token) {
    context.report(node, token.loc.start,
      'There should be no space after \'' + token.value + '\'');
  }

  /**
  * Reports that there shouldn't be a space before the last token
  * @param {ASTNode} node - The node to report in the event of an error.
  * @param {Token} token - The token to use for the report.
  * @returns {void}
  */
  function reportNoEndingSpace(node, token) {
    context.report(node, token.loc.start,
      'There should be no space before \'' + token.value + '\'');
  }

  /**
  * Reports that there should be a space after the first token
  * @param {ASTNode} node - The node to report in the event of an error.
  * @param {Token} token - The token to use for the report.
  * @returns {void}
  */
  function reportRequiredBeginningSpace(node, token) {
    context.report(node, token.loc.start,
      'A space is required after \'' + token.value + '\'');
  }

  /**
  * Reports that there should be a space before the last token
  * @param {ASTNode} node - The node to report in the event of an error.
  * @param {Token} token - The token to use for the report.
  * @returns {void}
  */
  function reportRequiredEndingSpace(node, token) {
    context.report(node, token.loc.start,
          'A space is required before \'' + token.value + '\'');
  }

  /**
   * Determines if spacing in curly braces is valid.
   * @param {ASTNode} node The AST node to check.
   * @param {Token} first The first token to check (should be the opening brace)
   * @param {Token} second The second token to check (should be first after the opening brace)
   * @param {Token} penultimate The penultimate token to check (should be last before closing brace)
   * @param {Token} last The last token to check (should be closing brace)
   * @returns {void}
   */
  function validateBraceSpacing(node, first, second, penultimate, last) {
    if (spaced && !isSpaced(first, second)) {
      reportRequiredBeginningSpace(node, first);
    }
    if (!spaced && isSpaced(first, second)) {
      reportNoBeginningSpace(node, first);
    }
    if (spaced && !isSpaced(penultimate, last)) {
      reportRequiredEndingSpace(node, last);
    }
    if (!spaced && isSpaced(penultimate, last)) {
      reportNoEndingSpace(node, last);
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    JSXExpressionContainer: function(node) {
      var first = context.getFirstToken(node);
      var second = context.getFirstToken(node, 1);
      var penultimate = context.getLastToken(node, 1);
      var last = context.getLastToken(node);

      validateBraceSpacing(node, first, second, penultimate, last);
    }
  };
};

module.exports.schema = [{
  enum: ['always', 'never']
}];
