/**
 * @fileoverview Prevent using string only property expressions
 */
'use strict';

const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using string only property expressions',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-quoted-string-props')
    },
    schema: []
  },

  create: function(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement: function (node) {
        node.attributes.forEach(decl => {
          if (decl.type === 'JSXSpreadAttribute') {
            return;
          }

          if (!decl.value || decl.value.type !== 'JSXExpressionContainer') {
            return;
          }

          if (decl.value.expression.type === 'Literal' && typeof decl.value.expression.value === 'string') {
            context.report({
              node: decl,
              message: `String literal value for property '${decl.name.name}' shouldn't be wrapped as an expression`
            });
          }
        });
      }
    };
  }
};
