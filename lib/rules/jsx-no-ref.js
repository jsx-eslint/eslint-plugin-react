/**
 * @fileoverview Report attempt to use `ref` prop in custom component JSX tags.
 * @author John Lianoglou
 */
'use strict';

var hasProp = require('jsx-ast-utils/hasProp');

// ------------------------------------------------------------------------------
// Rule Definition (inspired by jsx-key)
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Report attempt to use `ref` prop in custom component JSX tags',
      category: 'Best Practices',
      recommended: false
    },
    schema: []
  },

  create: function(context) {
    return {
      JSXElement: function(node) {
        var element = node.openingElement;

        if (!hasProp(element.attributes, 'ref')) {
          return;
        }

        if (/^[A-Z]/.test(element.name.name)) {
          context.report({
            node: node,
            message: 'Use of "ref" prop considered smell of non-declarative design'
          });
        }
      }
    };
  }
};
