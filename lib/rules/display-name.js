/**
 * @fileoverview Prevent missing displayName in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var hasDisplayName = false;

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    'ObjectExpression': function(node) {

      if (!node.parent.callee || node.parent.callee.object.name !== 'React' || node.parent.callee.property.name !== 'createClass') {
        return;
      }

      node.properties.forEach(function(property) {
        var keyName = property.key.name || property.key.value;
        if (keyName === 'displayName') {
          hasDisplayName = true;
        }
      });

    },

    'ObjectExpression:exit': function(node) {
      if (!node.parent.callee || node.parent.callee.object.name !== 'React' || node.parent.callee.property.name !== 'createClass') {
        return;
      }
      if (!hasDisplayName) {
        context.report(node, 'Component definition is missing display name');
      }
      hasDisplayName = false;
    }
  };

};
