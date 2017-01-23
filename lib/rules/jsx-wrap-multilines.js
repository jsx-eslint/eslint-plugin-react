/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */
'use strict';

var has = require('has');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var DEFAULTS = {
  style: 'always',
  declaration: true,
  assignment: true,
  return: true
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent missing parentheses around multilines JSX',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',

    schema: [{
      type: 'object',
      properties: {
        style: {
          type: 'string',
          enum: ['always', 'never']
        },
        declaration: {
          type: 'boolean'
        },
        assignment: {
          type: 'boolean'
        },
        return: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {

    var sourceCode = context.getSourceCode();

    function isEnabled(type) {
      var userOptions = context.options[0] || {};
      if (has(userOptions, type)) {
        return userOptions[type];
      }
      return DEFAULTS[type];
    }

    function isParenthesised(node) {
      var previousToken = sourceCode.getTokenBefore(node);
      var nextToken = sourceCode.getTokenAfter(node);

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

      var style = isEnabled('style');
      if (style === 'always' && !isParenthesised(node) && isMultilines(node)) {
        context.report({
          node: node,
          message: 'Missing parentheses around multilines JSX',
          fix: function(fixer) {
            return fixer.replaceText(node, '(' + sourceCode.getText(node) + ')');
          }
        });
      }

      if (style === 'never' && isParenthesised(node)) {
        context.report({
          node: node,
          message: 'Parentheses around JSX are not allowed',
          fix: function(fixer) {
            // Taken from 'no-extra-parens'
            // https://github.com/eslint/eslint/blob/master/lib/rules/no-extra-parens.js#L338
            var leftParenToken = sourceCode.getTokenBefore(node);
            var rightParenToken = sourceCode.getTokenAfter(node);
            var parenthesizedSource = sourceCode.text.slice(leftParenToken.range[1], rightParenToken.range[0]);

            return fixer.replaceTextRange([
              leftParenToken.range[0],
              rightParenToken.range[1]
            ], parenthesizedSource);
          }
        });
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      VariableDeclarator: function(node) {
        if (!isEnabled('declaration')) {
          return;
        }
        if (node.init && node.init.type === 'ConditionalExpression') {
          check(node.init.consequent);
          check(node.init.alternate);
          return;
        }
        check(node.init);
      },

      AssignmentExpression: function(node) {
        if (!isEnabled('assignment')) {
          return;
        }
        if (node.right.type === 'ConditionalExpression') {
          check(node.right.consequent);
          check(node.right.alternate);
          return;
        }
        check(node.right);
      },

      ReturnStatement: function(node) {
        if (isEnabled('return')) {
          check(node.argument);
        }
      }
    };

  }
};
