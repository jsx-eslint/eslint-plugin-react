/**
 * @fileoverview Prevent React to be marked as unused
 * @author Glen Mailer
 */
'use strict';

const pragmaUtil = require('../util/pragma');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent React to be marked as unused',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {
    const pragma = pragmaUtil.getFromContext(context);

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      JSXOpeningElement: function() {
        context.markVariableAsUsed(pragma);
      }

    };
  }
};
