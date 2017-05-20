/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: 'Validate closing tag location in JSX',
      category: 'Stylistic Issues',
      recommended: false
    }
  },

  create: function(context) {
    return {
      JSXClosingElement: function(node) {
        if (!node.parent) {
          return;
        }

        const opening = node.parent.openingElement;
        if (opening.loc.start.line === node.loc.start.line) {
          return;
        }

        if (opening.loc.start.column === node.loc.start.column) {
          return;
        }

        context.report({
          node: node,
          loc: node.loc,
          message: 'Expected closing tag to match indentation of opening.'
        });
      }
    };
  }
};
