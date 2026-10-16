/**
 * @fileoverview Prevent React to be marked as unused
 * @author Glen Mailer
 */

'use strict';

const pragmaUtil = require('../util/pragma');
const docsUrl = require('../util/docsUrl');
const markVariableAsUsed = require('../util/eslint').markVariableAsUsed;
const testReactVersion = require('../util/version').testReactVersion;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {

  meta: {
    docs: {
      description: 'Disallow React to be incorrectly marked as unused',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('jsx-uses-react'),
    },
    schema: [],
  },

  create(context) {
    if (testReactVersion(context, '>= 19.0.0')) {
      return {};
    }

    const pragma = pragmaUtil.getFromContext(context);
    const fragment = pragmaUtil.getFragmentFromContext(context);

    /**
     * @param {ASTNode} node
     * @returns {void}
     */
    function handleOpeningElement(node) {
      markVariableAsUsed(pragma, node, context);
    }
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement: handleOpeningElement,
      JSXOpeningFragment: handleOpeningElement,
      JSXFragment(node) {
        markVariableAsUsed(fragment, node, context);
      },
    };
  },
};
