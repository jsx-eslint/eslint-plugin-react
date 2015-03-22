/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  var componentCounter = 0;

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {
    MemberExpression: function(node) {
      if (node.object.name === 'React' && node.property.name === 'createClass' && ++componentCounter > 1) {
        context.report(node, 'Declare only one React component per file');
      }
    }
  };
};
