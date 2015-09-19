/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author David Petersen
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

    AssignmentExpression: function(node) {
      var item = node.left.object;
      while (item.object.property) {
        item = item.object;
      }
      if (
        item.object.type === 'ThisExpression' &&
        item.property.name === 'state'
      ) {
        context.report(node.left.object, 'Do not mutate state directly. Use setState().');
      }
    }
  };

};
