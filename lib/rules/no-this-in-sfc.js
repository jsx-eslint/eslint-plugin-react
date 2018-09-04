/**
 * @fileoverview Report "this" being used in stateless functional components.
 */
'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Stateless functional components should not use this';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Report "this" being used in stateless components',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-this-in-sfc')
    },
    schema: []
  },

  create: Components.detect((context, components, utils) => {
    let hasReactImport = false;
    return {
      ImportDeclaration(node) {
        if (hasReactImport) {
          return;
        }
        const isReactImport = node.source.value === 'react';
        if (isReactImport) {
          hasReactImport = true;
        }
      },
      MemberExpression(node) {
        if (!hasReactImport) {
          return;
        }
        const component = components.get(utils.getParentStatelessComponent());
        if (!component) {
          return;
        }
        if (node.object.type === 'ThisExpression') {
          context.report({
            node: node,
            message: ERROR_MESSAGE
          });
        }
      }
    };
  })
};
