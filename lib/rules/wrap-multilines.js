/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {

  function isParenthesised(node) {
    var previousToken = context.getTokenBefore(node);
    var nextToken = context.getTokenAfter(node);

    return previousToken && nextToken &&
      previousToken.value === '(' && previousToken.range[1] <= node.range[0] &&
      nextToken.value === ')' && nextToken.range[0] >= node.range[1];
  }

  function isMultilines(node) {
    return node.loc.start.line !== node.loc.end.line;
  }

  function check(node) {
    if (!node || node.type !== 'JSXElement') {
      return;
    }

    if (!isParenthesised(node) && isMultilines(node)) {
      context.report(node, 'Missing parentheses around multilines JSX');
    }
  }

  // --------------------------------------------------------------------------
  // Public
  // --------------------------------------------------------------------------

  return {

    VariableDeclarator: function(node) {
      check(node.init);
    },

    AssignmentExpression: function(node) {
      check(node.right);
    },

    ReturnStatement: function(node) {
      check(node.argument);
    }
  };

};
