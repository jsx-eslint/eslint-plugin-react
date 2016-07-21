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

      var isfindDOMNode =
        (callee.object && callee.object.callee && callee.object.callee.name === 'findDOMNode') ||
        (callee.property && callee.property.name === 'findDOMNode')
      ;

      if (!isfindDOMNode) {
        return;
      }

      context.report({
        node: callee,
        message: 'Do not use findDOMNode'
      });
    }
  };

};

module.exports.schema = [];
