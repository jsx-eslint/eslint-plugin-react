/**
 * @fileoverview Forbid import propTypes form react (deprecated in 15.5)
 * @author Agostino Marzotta
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------


// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid import propTypes form react',
      category: 'Deprecations',
      recommended: false
    }
  },

  create: function(context) {

    return {
      ImportSpecifier: function(node) {
        if (node.imported.name && node.imported.name === 'propTypes' && node.parent.source.value === 'react') {
          context.report({
            node: node,
            message: 'Using another component\'s propTypes is forbidden'
          });
        }
      }
    };
  }
};
