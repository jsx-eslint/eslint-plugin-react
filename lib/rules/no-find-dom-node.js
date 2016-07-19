/**
 * @fileoverview Prevent usage of findDOMNode
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    CallExpression: function(node) {
      var callee = node.callee;
      if (
        callee.type !== 'MemberExpression' || (
          callee.object.callee && callee.object.callee.name !== 'findDOMNode' &&
          callee.property.name !== 'findDOMNode'
        )
      ) {
        return;
      }
      var ancestors = context.getAncestors(callee);
      for (var i = 0, j = ancestors.length; i < j; i++) {
        if (ancestors[i].type === 'Property' || ancestors[i].type === 'MethodDefinition') {
          context.report({
            node: callee,
            message: 'Do not use findDOMNode'
          });
          break;
        }
      }
    }
  };

};

module.exports.schema = [];
