/**
 * @fileoverview Prevent missing propTypes in a React component definition
 * @author Yannick Croissant
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var hasPropTypes = false;

  return {

    'ObjectExpression': function(node) {

      if (!node.parent.callee || node.parent.callee.object.name !== 'React' || node.parent.callee.property.name !== 'createClass') {
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
      if (!node.parent.callee || node.parent.callee.object.name !== 'React' || node.parent.callee.property.name !== 'createClass') {
        return;
      }
      if (!hasPropTypes) {
        context.report(node, 'Component definition is missing props validation');
      }
      hasPropTypes = false;
    }
  };

};
