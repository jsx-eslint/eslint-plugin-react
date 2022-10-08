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
  // eslint-disable-next-line eslint-plugin/prefer-message-ids -- https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/issues/292
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow React to be incorrectly marked as unused',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('jsx-uses-react'),
    },
    schema: [],
  },

  create(context) {
    const pragma = pragmaUtil.getFromContext(context);
    const fragment = pragmaUtil.getFragmentFromContext(context);

    function handleOpeningElement() {
      context.markVariableAsUsed(pragma);
    }
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement: handleOpeningElement,
      JSXOpeningFragment: handleOpeningElement,
      JSXFragment() {
        context.markVariableAsUsed(fragment);
      },
    };
  },
};
