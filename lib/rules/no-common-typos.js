/**
 * @fileoverview Warn for common attribute typos.
 * @author Koen Punt
 */
'use strict';

var Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var PATTERN_REGEXP = new RegExp('^/(.+)/(.+)?$');

/**
 * Convert pattern string to a regular expression.
 * @param {String|RegExp} string regex
 * @return {RegExp}
 */
function parsePattern(pattern) {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  if (PATTERN_REGEXP.exec(pattern)) {
    return new RegExp(RegExp.$1, RegExp.$2);
  }
  return new RegExp('^' + pattern + '$');
}

module.exports = {
  meta: {
    docs: {
      description: 'Warn for common attribute typos.',
      category: 'Possible Errors',
      recommended: false
    },
    schema: [{
      type: 'object',
      rules: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string'
            },
            correct: {
              type: 'string'
            }
          },
          additionalProperties: false
        }
      }
    }],
    fixable: 'code'
  },

  create: Components.detect(function(context) {

    var rules = context.options || [];

    /**
     * Checks if we are using an incorrect cased dangerouslySetInnerHTML attribute.
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} True if we are using a ref attribute, false if not.
     */
    function isIncorrectAttributeName(regex, correct, node) {
      return Boolean(
        node.type === 'JSXAttribute' &&
        node.name &&
        node.name.name !== correct &&
        regex.test(node.name.name)
      );
    }

    return {
      JSXAttribute: function(node) {
        rules.forEach(function(rule) {
          var regex = parsePattern(rule.pattern);
          if (isIncorrectAttributeName(regex, rule.correct, node)) {
            var attribute = node.name.name;
            context.report({
              node: node,
              message: 'Using possible incorrect attribute `' + attribute + '`, did you mean `' + rule.correct + '`?',
              fix: function(fixer) {
                return fixer.replaceText(attribute, rule.correct);
              }
            });
          }
        });
      }
    };
  })
};
