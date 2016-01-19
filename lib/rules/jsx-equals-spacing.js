/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
  var config = context.options[0];
  var sourceCode = context.getSourceCode();

  /**
   * Determines a given attribute node has an equal sign.
   * @param {ASTNode} attrNode - The attribute node.
   * @returns {boolean} Whether or not the attriute node has an equal sign.
   */
  function hasEqual(attrNode) {
    return attrNode.type !== 'JSXSpreadAttribute' && attrNode.value !== null;
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    JSXOpeningElement: function(node) {
      node.attributes.forEach(function(attrNode) {
        if (!hasEqual(attrNode)) {
          return;
        }

        var equalToken = sourceCode.getTokenAfter(attrNode.name);
        var spacedBefore = sourceCode.isSpaceBetweenTokens(attrNode.name, equalToken);
        var spacedAfter = sourceCode.isSpaceBetweenTokens(equalToken, attrNode.value);

        switch (config) {
          default:
          case 'never':
            if (spacedBefore) {
              context.report(attrNode, equalToken.loc.start,
                'There should be no space before \'=\'');
            }
            if (spacedAfter) {
              context.report(attrNode, equalToken.loc.start,
                'There should be no space after \'=\'');
            }
            break;
          case 'always':
            if (!spacedBefore) {
              context.report(attrNode, equalToken.loc.start,
                'A space is required before \'=\'');
            }
            if (!spacedAfter) {
              context.report(attrNode, equalToken.loc.start,
                'A space is required after \'=\'');
            }
            break;
        }
      });
    }
  };
};

module.exports.schema = [{
  enum: ['always', 'never']
}];
