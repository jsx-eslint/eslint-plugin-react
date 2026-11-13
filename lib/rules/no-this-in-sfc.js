/**
 * @fileoverview Report "this" being used in stateless functional components.
 */

'use strict';

const Components = require('../util/Components');
const docsUrl = require('../util/docsUrl');
const report = require('../util/report');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noThisInSFC: 'Stateless functional components should not use `this`',
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow `this` from being used in stateless functional components',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-this-in-sfc'),
    },

    messages,

    schema: [],
  },

  create: Components.detect((context, components, utils) => {
    /**
     * `this` inside a nested non-arrow function or class is rebound and refers
     * to that function's or class's `this`, not to the component.
     * @param {ASTNode} node the ThisExpression's MemberExpression
     * @param {ASTNode} componentNode the enclosing stateless component
     * @returns {boolean} whether `this` still refers to the component
     */
    function isThisBoundToComponent(node, componentNode) {
      let current = node.parent;
      while (current && current !== componentNode) {
        if (
          current.type === 'FunctionDeclaration'
          || current.type === 'FunctionExpression'
          || current.type === 'ClassDeclaration'
          || current.type === 'ClassExpression'
        ) {
          return false;
        }
        current = current.parent;
      }
      return true;
    }

    return {
      MemberExpression(node) {
        if (node.object.type === 'ThisExpression') {
          const component = components.get(utils.getParentStatelessComponent(node));
          if (!component || (component.node && component.node.parent && component.node.parent.type === 'Property')) {
            return;
          }
          if (!isThisBoundToComponent(node, component.node)) {
            return;
          }
          report(context, messages.noThisInSFC, 'noThisInSFC', {
            node,
          });
        }
      },
    };
  }),
};
