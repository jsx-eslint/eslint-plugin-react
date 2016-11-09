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

        // If this attribute is a sibling to JSXSpreadAttribute, ignore undefined
        // You can use undefined here as a way to "omit" a value from the spread
        // i.e. <Foo {...otherProps} bar={undefined} />
        var hasSpreadSibling = node.parent.attributes.some(function (prop) {
          return prop.type === 'JSXSpreadAttribute';
        });
        if (hasSpreadSibling) {
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
