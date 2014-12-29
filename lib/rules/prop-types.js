/**
 * @fileoverview Prevent missing propTypes in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var hasPropTypes = false;

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

    'ObjectExpression': function(node) {

      if (!isComponentDefinition(node.parent)) {
        return;
      }

      node.properties.forEach(function(property) {
        var keyName = property.key.name || property.key.value;
        if (keyName === 'propTypes') {
          hasPropTypes = true;
        }
      });
    },

    'ObjectExpression:exit': function(node) {

      if (!isComponentDefinition(node.parent)) {
        return;
      }

      if (!hasPropTypes) {
        context.report(node, 'Component definition is missing props validation');
      }

      hasPropTypes = false;
    }
  };

};
