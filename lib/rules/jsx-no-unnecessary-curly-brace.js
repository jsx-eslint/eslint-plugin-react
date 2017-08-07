/**
 * @fileoverview Prevent using string literals in React component definition
 * @author Caleb Morris
 * @author David Buchan-Swanson
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const options = {
  always: 'always',
  never: 'never',
  ignore: 'ignore'
}
const optionValues = ['always', 'never', 'ignore']

module.exports = {
  meta: {
    docs: {
      description: 'Disallow unnecessary JSX expressions when literals alone are sufficient',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',

    schema: [
      {
        type: 'object',
        properties: {
            props: { enum: optionValues },
            children: { enum: optionValues }
        },
        additionalProperties: false
      }
    ]
  },

  create: function(context) {
    const config = context.options[0] || {};

    function containsBackslashForEscaping(rawStringValue) {
      return JSON.stringify(rawStringValue).includes('\\');
    }

    function reportStyleViolation(node) {
      context.report({
        node: node,
        message: 'Curly braces are unnecessary here.',
        fix: function(fixer) {
          let { expression: { value }} = node;

          if (node.parent.type === 'JSXAttribute') {
            value = `"${value}"`
          }

          return fixer.replaceText(node, value);
        }
      });
    }

    function isRuleViolated(node) {
      const { expression } = node;

      if (
        typeof expression.value === 'string' &&
          !containsBackslashForEscaping(expression.raw)
      ) {
        reportStyleViolation(node)
      }
    }

    function shouldCheckForRule(expressionType, parentType, config) {
      return (
        expressionType === 'Literal' && (
          parentType === 'JSXAttribute' &&
            config.props !== 'never'
        ) || (
          parentType === 'JSXElement' && 
            config.children !== 'never'
        )
      )
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXExpressionContainer: (node) => {
        const {
          expression: { type },
          parent: { type: parentType }
        } = node

        if (shouldCheckForRule(type, parentType, config)) {
          isRuleViolated(node)
        }
      }
    }
  }
};
