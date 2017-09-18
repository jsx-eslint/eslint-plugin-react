/**
 * @fileoverview Forbid data-* and aria-* attributes from being uppercase to support react 16
 * @author Don Abrams
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isDataOrAriaAttributeWithUppercase(attr) {
  const lname = attr.name.name.toLowerCase();
  return (lname.startsWith('data-') || lname.startsWith('aria-')) &&
    attr.name.name !== lname;
}

module.exports = {
  meta: {
    docs: {
      description: 'Forbid jsx data-* and aria-* attribute keys from being uppercase to support React',
      category: 'Possible Errors',
      recommended: true
    },
    schema: []
  },

  create: function(context) {
    return {
      JSXAttribute: function(node) {
        if (
          isDataOrAriaAttributeWithUppercase(node)
        ) {
          context.report(node, 'In React, data-* and aria-* attributes must be lowercase' +
              ' as per https://facebook.github.io/react/docs/dom-elements.html');
        }
      }
    };
  }
};
