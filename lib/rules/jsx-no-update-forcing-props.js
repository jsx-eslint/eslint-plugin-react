/**
 * @fileoverview Prevent usage of props that would cause the component to render every time its parent renders
 * @author Wojciech Maj
 */
'use strict';

const propName = require('jsx-ast-utils/propName');
const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of props that would cause the component to render every time its parent renders',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-no-update-forcing-props')
    },
    schema: [{
      type: 'object',
      properties: {
        allowObjectExpressions: {
          default: false,
          type: 'boolean'
        },
        allowArrayExpressions: {
          default: false,
          type: 'boolean'
        },
        allowFunctionExpressions: {
          default: false,
          type: 'boolean'
        },
        allowArrowFunctionExpressions: {
          default: false,
          type: 'boolean'
        },
        allowNewExpressions: {
          default: false,
          type: 'boolean'
        },
        allowCallExpressions: {
          default: false,
          type: 'boolean'
        },
        ignoreRefs: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  // eslint-disable-next-line
  create(context) {
    const configuration = context.options[0] || {};

    const typeToName = {
      object: 'Objects',
      array: 'Arrays',
      func: 'Functions',
      arrowFunc: 'Functions',
      new: 'Constructor expressions',
      call: 'Function calls'
    };

    function getNodeViolationType(node) {
      const nodeType = node.type;

      if (!configuration.allowObjectExpressions && nodeType === 'ObjectExpression') {
        return 'object';
      } else if (!configuration.allowArrayExpressions && nodeType === 'ArrayExpression') {
        return 'array';
      } else if (!configuration.allowFunctionExpressions && nodeType === 'FunctionExpression') {
        return 'func';
      } else if (!configuration.allowArrowFunctionExpressions && nodeType === 'ArrowFunctionExpression') {
        return 'arrowFunc';
      } else if (!configuration.allowNewExpressions && nodeType === 'NewExpression') {
        return 'new';
      } else if (!configuration.allowCallExpressions && nodeType === 'CallExpression') {
        return 'call';
      }

      return null;
    }

    function getErrorMessage(valueNodeType) {
      return `${typeToName[valueNodeType]} must be defined outside attributes to avoid unnecessary updates.`;
    }

    return {
      JSXAttribute(node) {
        const isDOMComponent = jsxUtil.isDOMComponent(node.parent);
        if (isDOMComponent) {
          return;
        }

        const isRef = configuration.ignoreRefs && propName(node) === 'ref';
        if (isRef || !node.value || !node.value.expression) {
          return;
        }

        const valueNode = node.value.expression;
        const nodeViolationType = getNodeViolationType(valueNode);

        if (nodeViolationType) {
          context.report({
            node,
            message: getErrorMessage(nodeViolationType)
          });
        }
      }
    };
  }
};
