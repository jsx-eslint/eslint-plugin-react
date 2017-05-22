/**
 * @fileoverview Forbid target='_blank' attribute
 * @author Kevin Miller
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid target="_blank" attribute without rel="noopener noreferrer"',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {
    return {
      JSXAttribute: function(node) {
        if (node.parent.name.name !== 'a') {
          return;
        }

        if (
          node.name.name === 'target' &&
          node.value.type === 'Literal' &&
          node.value.value.toLowerCase() === '_blank'
        ) {
          var relFound = false;
          var attrs = node.parent.attributes;
          for (var idx in attrs) {
            if (!Object.prototype.hasOwnProperty.call(attrs, idx)) {
              continue;
            }
            var attr = attrs[idx];
            if (!attr.name) {
              continue;
            }
            if (attr.name.name === 'href') {
              if (attr.value.type === 'Literal' && !/^\w+:/.test(attr.value.value)) {
                // it's safe because it is not an external link (i.e. doesn't start with a protocol)
                return;
              }
            }
            if (attr.name.name === 'rel') {
              var tags = attr.value.type === 'Literal' && attr.value.value.toLowerCase().split(' ');
              if (!tags || (tags.indexOf('noopener') >= 0 && tags.indexOf('noreferrer') >= 0)) {
                relFound = true;
                break;
              }
            }
          }
          if (!relFound) {
            context.report(node, 'Using target="_blank" without rel="noopener noreferrer" ' +
            'is a security risk: see https://mathiasbynens.github.io/rel-noopener');
          }
        }
      }
    };
  }
};
