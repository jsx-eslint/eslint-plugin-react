/**
 * @fileoverview Validate JSX maximum depth
 * @author Chris<wfsr@foxmail.com>
 */
'use strict';

const has = require('has');
const variableUtil = require('../util/variable');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: 'Validate JSX maximum depth',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-max-depth')
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 0
          }
        },
        additionalProperties: false
      }
    ]
  },
  create: function(context) {
    const MESSAGE = 'Expected the depth of nested jsx elements to be <= {{needed}}, but found {{found}}.';
    const DEFAULT_DEPTH = 2;

    const option = context.options[0] || {};
    const maxDepth = has(option, 'max') ? option.max : DEFAULT_DEPTH;

    function isJSXElement(node) {
      return node && node.type === 'JSXElement';
    }

    function isExpression(node) {
      return node.type === 'JSXExpressionContainer';
    }

    function hasJSX(node) {
      return isJSXElement(node) || isExpression(node) && isJSXElement(node.expression);
    }

    function isLeaf(node) {
      const children = node.children;

      return !children.length || !children.some(hasJSX);
    }

    function getDepth(node) {
      let count = 0;

      while (isJSXElement(node.parent) || isExpression(node.parent)) {
        node = node.parent;
        if (isJSXElement(node)) {
          count++;
        }
      }

      return count;
    }


    function report(node, depth) {
      context.report({
        node: node,
        message: MESSAGE,
        data: {
          found: depth,
          needed: maxDepth
        }
      });
    }

    function findJSXElement(variables, name) {
      function find(refs) {
        let i = refs.length;

        while (--i >= 0) {
          if (has(refs[i], 'writeExpr')) {
            const writeExpr = refs[i].writeExpr;

            return isJSXElement(writeExpr)
              && writeExpr
              || writeExpr
              && writeExpr.type === 'Identifier'
              && findJSXElement(variables, writeExpr.name);
          }
        }

        return null;
      }

      const variable = variableUtil.getVariable(variables, name);
      return variable && variable.references && find(variable.references);
    }

    function checkDescendant(baseDepth, children) {
      children.forEach(node => {
        if (!hasJSX(node)) {
          return;
        }

        baseDepth++;
        if (baseDepth > maxDepth) {
          report(node, baseDepth);
        } else if (!isLeaf(node)) {
          checkDescendant(baseDepth, node.children);
        }
      });
    }

    return {
      JSXElement: function(node) {
        if (!isLeaf(node)) {
          return;
        }

        const depth = getDepth(node);
        if (depth > maxDepth) {
          report(node, depth);
        }
      },
      JSXExpressionContainer: function(node) {
        if (node.expression.type !== 'Identifier') {
          return;
        }

        const variables = variableUtil.variablesInScope(context);
        const element = findJSXElement(variables, node.expression.name);

        if (element) {
          const baseDepth = getDepth(node);
          checkDescendant(baseDepth, element.children);
        }
      }
    };
  }
};
