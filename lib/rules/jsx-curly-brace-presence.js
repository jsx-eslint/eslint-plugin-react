/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly brace in JSX
 * @author Jacky Ho
 */
'use strict';

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const OPTION_ALWAYS = 'always';
const OPTION_NEVER = 'never';
const OPTION_IGNORE = 'ignore';

const OPTION_VALUES = [
  OPTION_ALWAYS,
  OPTION_NEVER,
  OPTION_IGNORE
];
const DEFAULT_CONFIG = {props: OPTION_NEVER, children: OPTION_NEVER};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description:
        'Disallow unnecessary JSX expressions when literals alone are sufficient ' +
          'or enfore JSX expressions on literals in JSX children or attributes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',

    schema: [
      {
        oneOf: [
          {
            type: 'object',
            properties: {
              props: {enum: OPTION_VALUES, default: OPTION_NEVER},
              children: {enum: OPTION_VALUES, default: OPTION_NEVER}
            },
            additionalProperties: false
          },
          {
            enum: OPTION_VALUES
          }
        ]
      }
    ]
  },

  create: function(context) {
    const ruleOptions = context.options[0];
    const userConfig = typeof ruleOptions === 'string' ?
      {props: ruleOptions, children: ruleOptions} :
      Object.assign({}, DEFAULT_CONFIG, ruleOptions);

    function containsBackslashForEscaping(rawStringValue) {
      return rawStringValue.includes('\\');
    }

    function escapeDoubleQuotes(rawStringValue) {
      return rawStringValue.replace(/\\"/g, '"').replace(/"/g, '\\"');
    }

    /**
     * Report and fix an unnecessary curly brace violation on a node
     * @param {ASTNode} node - The AST node with an unnecessary JSX expression
     * @param {String} text - The text to replace the unnecessary JSX expression
     */
    function reportUnnecessaryCurly(JSXExpressionNode) {
      context.report({
        node: JSXExpressionNode,
        message: 'Curly braces are unnecessary here.',
        fix: function(fixer) {
          const expression = JSXExpressionNode.expression;
          const expressionType = expression.type;
          const parentType = JSXExpressionNode.parent.type;

          let textToReplace;
          if (parentType === 'JSXAttribute') {
            textToReplace = `"${escapeDoubleQuotes(
              expressionType === 'TemplateLiteral' ?
                expression.quasis[0].value.raw :
                expression.raw.substring(1, expression.raw.length - 1)
            )}"`;
          } else {
            textToReplace = expressionType === 'TemplateLiteral' ?
              expression.quasis[0].value.cooked : expression.value;
          }

          return fixer.replaceText(JSXExpressionNode, textToReplace);
        }
      });
    }

    function reportMissingCurly(literalNode) {
      context.report({
        node: literalNode,
        message: 'Need to wrap this literal in a JSX expression.',
        fix: function(fixer) {
          const expression = literalNode.parent.type === 'JSXAttribute' ?
            `{"${escapeDoubleQuotes(
              literalNode.raw.substring(1, literalNode.raw.length - 1)
            )}"}` :
            `{${JSON.stringify(literalNode.value)}}`;

          return fixer.replaceText(literalNode, expression);
        }
      });
    }

    function lintUnnecessaryCurly(JSXExpressionNode) {
      const expression = JSXExpressionNode.expression;
      const expressionType = expression.type;
      const parentType = JSXExpressionNode.parent.type;

      if (
        expressionType === 'Literal' &&
          typeof expression.value === 'string' && (
          parentType === 'JSXAttribute' ||
          !containsBackslashForEscaping(expression.raw))
      ) {
        reportUnnecessaryCurly(JSXExpressionNode);
      } else if (
        expressionType === 'TemplateLiteral' &&
          expression.expressions.length === 0 && (
          parentType === 'JSXAttribute' ||
          !containsBackslashForEscaping(expression.quasis[0].value.raw))
      ) {
        reportUnnecessaryCurly(JSXExpressionNode);
      }
    }

    function areRuleConditionsSatisfied(parentType, config, ruleCondition) {
      return (
        parentType === 'JSXAttribute' &&
          typeof config.props === 'string' &&
          config.props === ruleCondition
      ) || (
        parentType === 'JSXElement' &&
          typeof config.children === 'string' &&
          config.children === ruleCondition
      );
    }

    function shouldCheckForUnnecessaryCurly(parent, config) {
      const parentType = parent.type;

      // If there are more than one JSX child, there is no need to check for
      // unnecessary curly braces.
      if (parentType === 'JSXElement' && parent.children.length !== 1) {
        return false;
      }

      return areRuleConditionsSatisfied(parentType, config, OPTION_NEVER);
    }

    function shouldCheckForMissingCurly(parentType, config) {
      return areRuleConditionsSatisfied(parentType, config, OPTION_ALWAYS);
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXExpressionContainer: node => {
        const parent = node.parent;

        if (shouldCheckForUnnecessaryCurly(parent, userConfig)) {
          lintUnnecessaryCurly(node);
        }
      },

      Literal: node => {
        const parentType = node.parent.type;

        if (shouldCheckForMissingCurly(parentType, userConfig)) {
          reportMissingCurly(node);
        }
      }
    };
  }
};
