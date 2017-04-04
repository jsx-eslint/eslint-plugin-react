/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author Yannick Croissant
 */
'use strict';

var Components = require('../util/Components');
var noSetStateViaMethods = require('../util/no-set-state-via-methods');

var DISALLOW_IN_FUNCTIONS = 'disallow-in-func';
var ALLOW_IN_FUNCTIONS = 'allow-in-func';
var DISALLOW_VIA_METHODS = 'disallow-via-methods';
var ALLOW_VIA_METHODS = 'allow-via-methods';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of setState in componentDidMount',
      category: 'Best Practices',
      recommended: false
    },

    schema: [{
      enum: [DISALLOW_IN_FUNCTIONS, ALLOW_IN_FUNCTIONS]
    }, {
      enum: [DISALLOW_VIA_METHODS, ALLOW_VIA_METHODS]
    }]
  },

  create: Components.detect(function(context, components, utils) {
    var modeInFunctions = context.options[0] || ALLOW_IN_FUNCTIONS;
    var modeViaMethods = context.options[1] || ALLOW_VIA_METHODS;

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      CallExpression: function(node) {
        var callee = node.callee;
        if (
          callee.type !== 'MemberExpression' ||
          callee.object.type !== 'ThisExpression' ||
          callee.property.name !== 'setState'
        ) {
          return;
        }
        var ancestors = context.getAncestors(callee).reverse();
        var depth = 0;
        for (var i = 0, j = ancestors.length; i < j; i++) {
          if (/Function(Expression|Declaration)$/.test(ancestors[i].type)) {
            depth++;
          }
          if (
            (ancestors[i].type !== 'Property' && ancestors[i].type !== 'MethodDefinition') ||
            ancestors[i].key.name !== 'componentDidMount' ||
            (modeInFunctions !== DISALLOW_IN_FUNCTIONS && depth > 1)
          ) {
            continue;
          }
          context.report({
            node: callee,
            message: 'Do not use setState in componentDidMount'
          });
          break;
        }
        if (modeViaMethods === DISALLOW_VIA_METHODS) {
          noSetStateViaMethods.run('componentDidMount', callee, ancestors, context, components, utils);
        }
      }
    };

  })
};
