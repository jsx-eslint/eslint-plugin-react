/**
 * @fileoverview Enforce a space before closing bracket of self-closing JSX elements.
 * @author ryym
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
  var sourceCode = context.getSourceCode();

  /**
   * Find the token before the closing bracket.
   * @param {ASTNode} node - The JSX element node.
   * @returns {Token} The token before the closing bracket.
   */
  function getTokenBeforeClosingBracket(node) {
    var attributes = node.attributes;
    if (attributes.length === 0) {
      return node.name;
    }
    return attributes[ attributes.length - 1 ];
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    JSXOpeningElement: function(node) {
      if (!node.selfClosing) {
        return;
      }

      var leftToken = getTokenBeforeClosingBracket(node);
      var closingSlash = sourceCode.getTokenAfter(leftToken);

      if (sourceCode.isSpaceBetweenTokens(leftToken, closingSlash)) {
        return;
      }

      context.report({
        loc: closingSlash.loc.start,
        message: 'A space is required before \'/>\'',
        fix: function(fixer) {
          return fixer.insertTextBefore(closingSlash, ' ');
        }
      });
    }
  };

};

module.exports.schema = [];
