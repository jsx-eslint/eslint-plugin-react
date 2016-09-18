/**
 * @fileoverview Forbid certain props on components
 * @author Joe Lencioni
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var DEFAULTS = ['className', 'style'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Forbid certain props on components',
      category: 'Best Practices',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        forbid: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        includeDOM: {
          type: 'boolean'
        }
      },
      additionalProperties: true
    }]
  },

  create: function(context) {
    var configuration = context.options[0] || {};

    function isForbidden(prop) {
      var forbid = configuration.forbid || DEFAULTS;
      return forbid.indexOf(prop) >= 0;
    }

    return {
      JSXAttribute: function(node) {
        var tag = node.parent.name.name;
        var includeDOM = configuration.includeDOM || false;
        if (!includeDOM && tag[0] !== tag[0].toUpperCase()) {
          // This is a DOM node, not a Component, so exit.
          return;
        }

        var prop = node.name.name;

        if (!isForbidden(prop)) {
          return;
        }

        context.report({
          node: node,
          message: 'Prop `' + prop + '` is forbidden on Components'
        });
      }
    };
  }
};
