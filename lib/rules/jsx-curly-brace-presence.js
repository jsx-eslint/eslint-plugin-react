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
const OPTION_SINGLE_QUOTE = 'single';
const OPTION_DOUBLE_QUOTE = 'double';
const DEAULT_QUOTE_OPTION = OPTION_DOUBLE_QUOTE;
const OPTION_ORIGINAL_QUOTE = 'original';

const OPTION_VALUES = [
  OPTION_ALWAYS,
  `${OPTION_ALWAYS},${OPTION_SINGLE_QUOTE}`,
  `${OPTION_ALWAYS},${OPTION_DOUBLE_QUOTE}`,
  `${OPTION_ALWAYS},${OPTION_ORIGINAL_QUOTE}`,
  OPTION_NEVER,
  OPTION_IGNORE
];
const QUOTE_OPTON_VALUE_STORE = {
  [OPTION_SINGLE_QUOTE]: '\'',
  [OPTION_DOUBLE_QUOTE]: '"',
  [OPTION_ORIGINAL_QUOTE]: '"' // Defaults to double if no orignal quote
};
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

    function containsQuote(string) {
      return string.match(/'|"/g);
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
            textToReplace = expressionType === 'TemplateLiteral' ?
              `"${expression.quasis[0].value.raw}"` : expression.raw;
          } else {
            textToReplace = expressionType === 'TemplateLiteral' ?
              expression.quasis[0].value.cooked : expression.value;
          }

          return fixer.replaceText(JSXExpressionNode, textToReplace);
        }
      });
    }

    function wrapLiteralNodeInJSXExpression(fixer, literalNode) {
      const parentType = literalNode.parent.type;
      const raw = literalNode.raw;
      const value = literalNode.value;
      const valueContainsQuote = containsQuote(value);
      let text = raw;
      let userSetQuoteOption;

      if (parentType === 'JSXAttribute') {
        userSetQuoteOption = userConfig.props.split(',')[1];
        text = raw.substring(1, raw.length - 1);
      } else if (parentType === 'JSXElement') {
        userSetQuoteOption = userConfig.children.split(',')[1];
      }

      if (
        parentType === 'JSXAttribute' &&
        (userSetQuoteOption === OPTION_ORIGINAL_QUOTE || valueContainsQuote)
      ) {
        return fixer.replaceText(literalNode, `{${raw}}`);
      }

      if (parentType === 'JSXElement' && valueContainsQuote) {
        return fixer.replaceText(literalNode, `{${JSON.stringify(value)}}`);
      }

      const quoteStyle = QUOTE_OPTON_VALUE_STORE[
        userSetQuoteOption || DEAULT_QUOTE_OPTION
      ];
      return fixer.replaceText(
        literalNode,
        `{${quoteStyle}${text}${quoteStyle}}`
      );
    }

    function reportMissingCurly(literalNode) {
      context.report({
        node: literalNode,
        message: 'Need to wrap this literal in a JSX expression.',
        fix: function(fixer) {
          return wrapLiteralNodeInJSXExpression(fixer, literalNode);
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
          !containsBackslashForEscaping(expression.raw) ||
          parentType === 'JSXAttribute')
      ) {
        reportUnnecessaryCurly(JSXExpressionNode);
      } else if (
        expressionType === 'TemplateLiteral' &&
          expression.expressions.length === 0 && (
          !containsBackslashForEscaping(expression.quasis[0].value.raw) ||
          parentType === 'JSXAttribute')
      ) {
        reportUnnecessaryCurly(JSXExpressionNode);
      }
    }

    function areRuleConditionsSatisfied(parentType, config, ruleCondition) {
      return (
        parentType === 'JSXAttribute' &&
          typeof config.props === 'string' &&
          config.props.split(',')[0] === ruleCondition
      ) || (
        parentType === 'JSXElement' &&
          typeof config.children === 'string' &&
          config.children.split(',')[0] === ruleCondition
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
