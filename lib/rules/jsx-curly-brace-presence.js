/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly brace in JSX
 * @author Jacky Ho
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const optionAlways = 'always';
const optionNever = 'never';

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
          props: {
            type: 'string',
            default: optionNever
          },
          children: {
            type: 'string',
            default: optionNever
          },
          additionalProperties: false
        }
      }
    ]
  },

  create: function(context) {
    const userConfig = context.options[0];

    function containsBackslashForEscaping(rawStringValue) {
      return JSON.stringify(rawStringValue).includes('\\');
    }

    function reportUnnecessaryCurly(node) {
      context.report({
        node: node,
        message: 'Curly braces are unnecessary here.',
        fix: function(fixer) {
          let {expression: {value}} = node;

          if (node.parent.type === 'JSXAttribute') {
            value = `"${value}"`;
          }

          return fixer.replaceText(node, value);
        }
      });
    }

    function reportMissingCurly(node) {
      context.report({
        node: node,
        message: 'Need to wrap this literal in a JSX expression.'
      });
    }

    function lintUnnecessaryCurly(node) {
      const {expression} = node;

      if (
        typeof expression.value === 'string' &&
          !containsBackslashForEscaping(expression.raw)
      ) {
        reportUnnecessaryCurly(node);
      }
    }

    function areRuleConditionsSatisfied({parentType, config, ruleCondition}) {
      return (
        parentType === 'JSXAttribute' && config.props === ruleCondition
      ) || (
        parentType === 'JSXElement' && config.children === ruleCondition
      );
    }

    function shouldCheckForUnnecessaryCurly(expressionType, parentType, config) {
      if (expressionType !== 'Literal') {
        return false;
      }

      return areRuleConditionsSatisfied({
        parentType, config, ruleCondition: optionNever
      });
    }

    function shouldCheckForMissingCurly(parentType, config) {
      return areRuleConditionsSatisfied({
        parentType, config, ruleCondition: optionAlways
      });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXExpressionContainer: node => {
        const {
          expression: {type},
          parent: {type: parentType}
        } = node;

        if (shouldCheckForUnnecessaryCurly(type, parentType, userConfig)) {
          lintUnnecessaryCurly(node);
        }
      },

      Literal: node => {
        const {parent: {type: parentType}} = node;

        if (shouldCheckForMissingCurly(parentType, userConfig)) {
          reportMissingCurly(node);
        }
      }
    };
  }
};
