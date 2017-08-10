/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly brace in JSX
 * @author Jacky Ho
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const OPTION_ALWAYS = 'always';
const OPTION_NEVER = 'never';
const OPTION_IGNORE = 'ignore';
const optionValues = [OPTION_ALWAYS, OPTION_NEVER, OPTION_IGNORE];
const defaultConfig = {props: OPTION_NEVER, children: OPTION_NEVER};

module.exports = {
  meta: {
    docs: {
      description: 'Disallow unnecessary JSX expressions when literals alone are sufficient',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',

    schema: [{
      oneOf: [
        {
          type: 'object',
          properties: {
            props: {enum: optionValues, default: OPTION_NEVER},
            children: {enum: optionValues, default: OPTION_NEVER}
          },
          additionalProperties: false
        },
        {
          enum: optionValues
        }
      ]
    }]
  },

  create: function(context) {
    const ruleOptions = context.options[0];
    const userConfig = typeof ruleOptions === 'string' ?
      {props: ruleOptions, children: ruleOptions} :
      Object.assign({}, defaultConfig, ruleOptions);

    function containsBackslashForEscaping(rawStringValue) {
      return JSON.stringify(rawStringValue).includes('\\');
    }

    /**
     * Report an unnecessary curly brace violation on a node
     * @param {ASTNode} node - The AST node with an unnecessary JSX expression
     * @param {String} text - The text to replace the unnecessary JSX expression
     */
    function reportUnnecessaryCurly(JSXExpressionNode, text) {
      context.report({
        node: JSXExpressionNode,
        message: 'Curly braces are unnecessary here.',
        fix: function(fixer) {
          let textToReplace = text;
          if (JSXExpressionNode.parent.type === 'JSXAttribute') {
            textToReplace = `"${text}"`;
          }

          return fixer.replaceText(JSXExpressionNode, textToReplace);
        }
      });
    }

    function reportMissingCurly(literalNode) {
      context.report({
        node: literalNode,
        message: 'Need to wrap this literal in a JSX expression.'
      });
    }

    function lintUnnecessaryCurly(JSXExpressionNode) {
      const {expression, expression: {type}} = JSXExpressionNode;

      if (
        type === 'Literal' &&
          typeof expression.value === 'string' &&
          !containsBackslashForEscaping(expression.raw)
      ) {
        reportUnnecessaryCurly(JSXExpressionNode, expression.value);
      } else if (
        type === 'TemplateLiteral' &&
          expression.expressions.length === 0 &&
          !containsBackslashForEscaping(expression.quasis[0].value.raw)
      ) {
        reportUnnecessaryCurly(
          JSXExpressionNode,
          expression.quasis[0].value.cooked
        );
      }
    }

    function areRuleConditionsSatisfied(parentType, config, ruleCondition) {
      return (
        parentType === 'JSXAttribute' && config.props === ruleCondition
      ) || (
        parentType === 'JSXElement' && config.children === ruleCondition
      );
    }

    function shouldCheckForUnnecessaryCurly(parent, config) {
      const {type: parentType} = parent;

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
        const {parent} = node;

        if (shouldCheckForUnnecessaryCurly(parent, userConfig)) {
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
