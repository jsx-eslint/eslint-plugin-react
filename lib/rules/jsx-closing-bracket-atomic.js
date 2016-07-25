/**
 * @fileoverview Ensures the "/>" and "</" closing indicators are written as a single token
 * @author Diogo Franco (Kovensky)
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var MESSAGE_SELF_CLOSING = 'Self-closing JSX elements must not have whitespace between the `/` and the `>`';
var MESSAGE_CLOSING = 'JSX closing tags must not have whitespace between the `<` and the `/`';

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
          context.report(node, MESSAGE_SELF_CLOSING);
        }
      }
    },
    JSXClosingElement: function(node) {
      var sourceCode = context.getSourceCode();
      var sourceText = sourceCode.getText(node);
      if (sourceText.indexOf('</') !== 0) {
        context.report(node, MESSAGE_CLOSING);
      }
    }
  };

};

module.exports.schema = [];
