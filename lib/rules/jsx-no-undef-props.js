/**
 * @fileoverview Disallow prop value as `undefined`.
 * @author Ethan Cohen
 */

'use strict';

var getPropValue = require('jsx-ast-utils/getPropValue');
var propName = require('jsx-ast-utils/propName');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow JSX prop value as `undefined`',
      category: 'Best Practices',
      recommended: false
    },
    schema: []
  },

  create: function(context) {
    return {
      JSXAttribute: function(node) {
        if (node.value === null || node.value.type === 'Literal' || node.value.type === 'JSXElement') {
          return;
        } else if (typeof getPropValue(node) !== 'undefined') {
          return;
        }

        var name = propName(node);

        context.report({
          node: node,
          message: 'Leave off the prop `' + name + '` instead of passing undefined as its value.'
        });
      }
    };

  }
};
