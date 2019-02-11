/**
 * @fileoverview Prevent React to be marked as unused
 * @author Glen Mailer
 */
'use strict';

const pragmaUtil = require('../util/pragma');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent React to be marked as unused',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('jsx-uses-react')
    },
    schema: []
  },

  create: function(context) {
    const jsxPragma = pragmaUtil.getJsxFromContext(context);
    const jsxPragmaObject = jsxPragma.split('.')[0];
    const jsxFragPragma = pragmaUtil.getJsxFragFromContext(context);
    const jsxFragPragmaObject = jsxFragPragma.split('.')[0];

    function handleOpeningElement() {
      context.markVariableAsUsed(jsxPragmaObject);
    }

    function handleOpeningFragment() {
      context.markVariableAsUsed(jsxFragPragmaObject);
    }
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement: handleOpeningElement,
      JSXOpeningFragment: handleOpeningFragment
    };
  }
};
