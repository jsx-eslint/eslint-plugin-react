/**
 * @fileoverview Prevent usage of setState in componentDidMount
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

    'MemberExpression': function(node) {
      if (node.object.type !== 'ThisExpression' || node.property.name !== 'setState') {
        return;
      }
      var ancestors = context.getAncestors(node);
      for (var i = 0, j = ancestors.length; i < j; i++) {
        if (ancestors[i].type !== 'Property' || ancestors[i].key.name !== 'componentDidMount') {
          continue;
        }
        context.report(node, 'Do not use setState in componentDidMount');
      }
    }
  };

};
