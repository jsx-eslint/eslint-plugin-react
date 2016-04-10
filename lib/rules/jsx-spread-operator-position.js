/**
 * @fileoverview Enforce the location of the spread operator
 * @author Joachim Seminck
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function (context) {
  var configuration = context.options[0];

  function attributesContainSpreadOperator(node) {
    if (node.attributes.length === 0) {
      return false;
    }

    var spreadOperatorFound = false;
    node.attributes.forEach(function(decl) {
      if (decl.type === 'JSXSpreadAttribute') {
        spreadOperatorFound = true;
      }
    });

    return spreadOperatorFound;
  }

  return {
    JSXOpeningElement: function (node) {
      if ((configuration === 'begin') && attributesContainSpreadOperator(node)) {
        var firstAttribute = node.attributes[0];
        if (firstAttribute.type !== 'JSXSpreadAttribute' && node.attributes.length > 1) {
          context.report({
            node: firstAttribute,
            message: 'First property should be the spread operator'
          });
        }
      } else if (configuration === 'end' && attributesContainSpreadOperator(node)) {
        var lastAttribute = node.attributes[node.attributes.length - 1];
        if (lastAttribute.type !== 'JSXSpreadAttribute' && node.attributes.length > 1) {
          context.report({
            node: lastAttribute,
            message: 'Last property should be the spread operator'
          });
        }
      }
      return;
    }
  };
};

module.exports.schema = [{
  enum: ['begin', 'end']
}];
