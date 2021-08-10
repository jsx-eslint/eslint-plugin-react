/**
 * @fileoverview Prevent usage of props that would cause the component to render every time its parent renders
 * @author Wojciech Maj
 */

'use strict';

const propName = require('jsx-ast-utils/propName');
const docsUrl = require('../util/docsUrl');
const jsxUtil = require('../util/jsx');

const typeToName = {
  object: 'Objects',
  array: 'Arrays',
  func: 'Functions',
  arrowFunc: 'Functions',
  new: 'Constructor expressions',
  call: 'Function calls'
};

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
        objectExpressions: {
          default: false,
          type: 'boolean'
        },
        arrayExpressions: {
          default: false,
          type: 'boolean'
        },
        functionExpressions: {
          default: false,
          type: 'boolean'
        },
        arrowFunctionExpressions: {
          default: false,
          type: 'boolean'
        },
        newExpressions: {
          default: false,
          type: 'boolean'
        },
        callExpressions: {
          default: false,
          type: 'boolean'
        },
        ignoreRefs: {
          default: true,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    const config = context.options[0] || {};

    function getNodeViolationType(node) {
      const nodeType = node.type;

      if (!config.objectExpressions && nodeType === 'ObjectExpression') {
        return 'object';
      }
      if (!config.arrayExpressions && nodeType === 'ArrayExpression') {
        return 'array';
      }
      if (!config.functionExpressions && nodeType === 'FunctionExpression') {
        return 'func';
      }
      if (!config.arrowFunctionExpressions && nodeType === 'ArrowFunctionExpression') {
        return 'arrowFunc';
      }
      if (!config.newExpressions && nodeType === 'NewExpression') {
        return 'new';
      }
      if (!config.callExpressions && nodeType === 'CallExpression') {
        return 'call';
      }

      return null;
    }

    return {
      JSXAttribute(node) {
        const isDOMComponent = jsxUtil.isDOMComponent(node.parent);
        if (isDOMComponent) {
          return;
        }

        const shouldIgnoreRefsAndIsRef = config.ignoreRefs && propName(node) === 'ref';
        if (shouldIgnoreRefsAndIsRef || !node.value || !node.value.expression) {
          return;
        }

        const valueNode = node.value.expression;
        const nodeViolationType = getNodeViolationType(valueNode);

        if (nodeViolationType) {
          context.report({
            node,
            message: `${typeToName[nodeViolationType]} must be defined outside render function to avoid unnecessary component rerenders.`
          });
        }
      }
    };
  }
};
