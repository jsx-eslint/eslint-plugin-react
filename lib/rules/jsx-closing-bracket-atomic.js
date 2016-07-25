/**
 * @fileoverview Ensures the "/>" and "</" closing indicators are written as a single token
 * @author Diogo Franco (Kovensky)
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var MESSAGE = 'JSX tag closing has embedded whitespace';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
  return {
    JSXOpeningElement: function(node) {
      if (node.selfClosing) {
        var sourceCode = context.getSourceCode();
        var sourceText = sourceCode.getText(node);
        if (sourceText.lastIndexOf('/>') !== sourceText.length - 2) {
          context.report(node, MESSAGE);
        }
      }
    },
    JSXClosingElement: function(node) {
      var sourceCode = context.getSourceCode();
      var sourceText = sourceCode.getText(node);
      if (sourceText.indexOf('</') !== 0) {
        context.report(node, MESSAGE);
      }
    }
  };

};

module.exports.schema = [];
