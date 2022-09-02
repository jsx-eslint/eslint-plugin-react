/**
 * @fileoverview Prevent problematic leaked values from being rendered
 * @author Mario Beltrán
 */

'use strict';

const docsUrl = require('../util/docsUrl');
const report = require('../util/report');
const isParenthesized = require('../util/ast').isParenthesized;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const messages = {
  noPotentialLeakedRender: 'Potential leaked value that might cause unintentionally rendered values or rendering crashes',
};

const COERCE_STRATEGY = 'coerce';
const TERNARY_STRATEGY = 'ternary';
const DEFAULT_TERNARY_REPLACE_VALUE = null;
const DEFAULT_VALID_STRATEGIES = [TERNARY_STRATEGY, COERCE_STRATEGY];
const COERCE_VALID_LEFT_SIDE_EXPRESSIONS = ['UnaryExpression', 'BinaryExpression', 'CallExpression'];
const TERNARY_INVALID_ALTERNATE_VALUES = [undefined, null, false];

function trimLeftNode(node) {
  // Remove double unary expression (boolean coercion), so we avoid trimming valid negations
  if (node.type === 'UnaryExpression' && node.argument.type === 'UnaryExpression') {
    return trimLeftNode(node.argument.argument);
  }

  return node;
}

function getIsCoerceValidNestedLogicalExpression(node) {
  if (node.type === 'LogicalExpression') {
    return getIsCoerceValidNestedLogicalExpression(node.left) && getIsCoerceValidNestedLogicalExpression(node.right);
  }

  return COERCE_VALID_LEFT_SIDE_EXPRESSIONS.some((validExpression) => validExpression === node.type);
}

function extractExpressionBetweenLogicalAnds(node) {
  if (node.type !== 'LogicalExpression') return [node];
  if (node.operator !== '&&') return [node];
  return [].concat(
    extractExpressionBetweenLogicalAnds(node.left),
    extractExpressionBetweenLogicalAnds(node.right)
  );
}

function ruleFixer(context, fixStrategy, ternaryReplaceValue, fixer, reportedNode, leftNode, rightNode) {
  const sourceCode = context.getSourceCode();
  const rightSideText = sourceCode.getText(rightNode);

  if (fixStrategy === COERCE_STRATEGY) {
    const expressions = extractExpressionBetweenLogicalAnds(leftNode);
    const newText = expressions.map((node) => {
      let nodeText = sourceCode.getText(node);
      if (isParenthesized(context, node)) {
        nodeText = `(${nodeText})`;
      }
      return `${getIsCoerceValidNestedLogicalExpression(node) ? '' : '!!'}${nodeText}`;
    }).join(' && ');

    return fixer.replaceText(reportedNode, `${newText} && ${rightSideText}`);
  }

  if (fixStrategy === TERNARY_STRATEGY) {
    let leftSideText = sourceCode.getText(trimLeftNode(leftNode));
    if (isParenthesized(context, leftNode)) {
      leftSideText = `(${leftSideText})`;
    }
    return fixer.replaceText(reportedNode, `${leftSideText} ? ${rightSideText} : ${ternaryReplaceValue}`);
  }

  throw new TypeError('Invalid value for "validStrategies" option');
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    docs: {
      description: 'Disallow problematic leaked values from being rendered',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('jsx-no-leaked-render'),
    },

    messages,

    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          validStrategies: {
            type: 'array',
            items: {
              enum: [
                TERNARY_STRATEGY,
                COERCE_STRATEGY,
              ],
            },
            uniqueItems: true,
            default: DEFAULT_VALID_STRATEGIES,
          },
          ternaryReplaceValue: {
            type: ['null', 'object', 'string'],
            default: DEFAULT_TERNARY_REPLACE_VALUE,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const config = context.options[0] || {};
    const validStrategies = new Set(config.validStrategies || DEFAULT_VALID_STRATEGIES);
    const fixStrategy = Array.from(validStrategies)[0];
    const ternaryReplaceValue = config.ternaryReplaceValue || DEFAULT_TERNARY_REPLACE_VALUE;

    return {
      'JSXExpressionContainer > LogicalExpression[operator="&&"]'(node) {
        const leftSide = node.left;

        const isCoerceValidLeftSide = COERCE_VALID_LEFT_SIDE_EXPRESSIONS
          .some((validExpression) => validExpression === leftSide.type);
        if (validStrategies.has(COERCE_STRATEGY)) {
          if (isCoerceValidLeftSide || getIsCoerceValidNestedLogicalExpression(leftSide)) {
            return;
          }
        }

        report(context, messages.noPotentialLeakedRender, 'noPotentialLeakedRender', {
          node,
          fix(fixer) {
            return ruleFixer(context, fixStrategy, ternaryReplaceValue, fixer, node, leftSide, node.right);
          },
        });
      },

      'JSXExpressionContainer > ConditionalExpression'(node) {
        if (validStrategies.has(TERNARY_STRATEGY)) {
          return;
        }

        const isValidTernaryAlternate = TERNARY_INVALID_ALTERNATE_VALUES.indexOf(node.alternate.value) === -1;
        const isJSXElementAlternate = node.alternate.type === 'JSXElement';
        if (isValidTernaryAlternate || isJSXElementAlternate) {
          return;
        }

        report(context, messages.noPotentialLeakedRender, 'noPotentialLeakedRender', {
          node,
          fix(fixer) {
            return ruleFixer(context, fixStrategy, ternaryReplaceValue, fixer, node, node.test, node.consequent);
          },
        });
      },
    };
  },
};
