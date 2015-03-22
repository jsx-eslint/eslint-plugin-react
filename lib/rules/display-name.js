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

  function isComponentDefinition(node) {
    return (
      node &&
      node.callee &&
      node.callee.object &&
      node.callee.property &&
      node.callee.object.name === 'React' &&
      node.callee.property.name === 'createClass'
    );
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    ObjectExpression: function(node) {

      if (!isComponentDefinition(node.parent)) {
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

      if (!isComponentDefinition(node.parent)) {
        return;
      }

      if (!hasDisplayName) {
        context.report(node, 'Component definition is missing display name');
      }

      hasDisplayName = false;
    }
  };

};
