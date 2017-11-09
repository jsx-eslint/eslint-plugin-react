/**
 * @fileoverview Forbid "button" element without an explicit "type" attribute
 * @author Filipp Riabchun
 */
'use strict';

const hasProp = require('jsx-ast-utils/hasProp');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid "button" element without an explicit "type" attribute',
      category: 'Possible Errors',
      recommended: false
    },
    schema: []
  },

  create: function(context) {
    return {
      JSXElement: function(node) {
        if (node.openingElement.name.name !== 'button') {
          return;
        }

        if (hasProp(node.openingElement.attributes, 'type')) {
          return;
        }

        context.report({
          node: node,
          message: 'Missing an explicit "type" attribute for button'
        });
      }
    };
  }
};
