/**
 * @fileoverview Forbid certain props on components
 * @author Joe Lencioni
 * @author Nicolas Fernandez <@burabure>
 */
'use strict';

var sanitizeUserPattern = require('../util/sanitizeUserPattern');

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
        checkDomNodes: {
          type: 'boolean'
        },
        forbid: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        forbidPatterns: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      additionalProperties: true
    }]
  },

  create: function(context) {
    var configuration = context.options[0] || {};
    var checkDomNodes = configuration.checkDomNodes || false;
    var ignoreComponents = configuration.ignoreComponents || false;

    function somePatternMatches(patterns, subject) {
      return patterns.reduce(function (acc, pattern) {
        if (sanitizeUserPattern(pattern).test(subject)) {
          return true;
        }
        return acc;
      }, false);
    }

    function isForbidden(prop) {
      var forbid = configuration.forbid || DEFAULTS;
      var forbidPatterns = configuration.forbidPatterns;
      if (forbid.indexOf(prop) >= 0) {
        return true;
      }

      if (forbidPatterns) {
        if (somePatternMatches(forbidPatterns, prop)) {
          return true;
        }
      }

      return false;
    }

    return {
      JSXAttribute: function(node) {
        var tag = node.parent.name.name;
        var isComponent = tag && tag[0] === tag[0].toUpperCase();

        if (!isComponent && !checkDomNodes) {
          // This is a DOM node, we're not checking these.
          return;
        }

        if (isComponent && ignoreComponents) {
          // This is a Component, we're not checking these.
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
